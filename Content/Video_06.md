# Video 06: Making Transaction

Bài viết này hướng dẫn cách tạo giao dịch chuyển tiền trên blockchain Cardano, sử dụng thư viện MeshJS trong một dự án Next.js. Nội dung được thiết kế cho các nhà phát triển xây dựng ứng dụng phi tập trung (dApps) trên Cardano, bao gồm cả việc xây dựng giao dịch ở phía client và server. Bài viết cung cấp giao diện mẫu, logic xử lý giao dịch, và giải thích lý do nên ưu tiên xây dựng giao dịch trên server trong các ứng dụng thực tế.

## Yêu Cầu Chuẩn Bị

Trước khi bắt đầu, hãy đảm bảo bạn có:

- **Node.js và npm**: Cài đặt Node.js (khuyến nghị phiên bản 16 trở lên) và npm để quản lý phụ thuộc JavaScript.
- **Trình Soạn Thảo Mã**: Sử dụng trình soạn thảo như Visual Studio Code.
- **Ví Cardano**: Thiết lập ví Cardano (như Eternl) với một lượng test ADA (tADA) trên mạng thử nghiệm Cardano testnet.
- **Tài Khoản Blockfrost** (cho server-side): Đăng ký tại [Blockfrost Dashboard](https://blockfrost.io/) để nhận Project ID nếu xây dựng giao dịch ở phía server.
- **Kiến Thức Cơ Bản**: Hiểu biết về JavaScript, API REST, và các khái niệm blockchain như UTXO, giao dịch, và ký giao dịch.

## Tổng Quan Về Giao Dịch Cardano

Giao dịch trên Cardano là quá trình chuyển tài sản (như ADA) từ một ví sang ví khác, được thực hiện thông qua các bước:

1. **Xây Dựng Giao Dịch**: Tạo giao dịch với các thông tin như địa chỉ người nhận, số lượng ADA, và UTXO (unspent transaction outputs) từ ví người gửi.
2. **Ký Giao Dịch**: Sử dụng ví để ký giao dịch, đảm bảo tính xác thực.
3. **Gửi Giao Dịch**: Submit giao dịch lên blockchain để các validator xác nhận và ghi vào sổ cái.

Giao dịch có thể được xây dựng ở:
- **Phía Client**: Phù hợp cho các ứng dụng đơn giản, nhưng kém bảo mật vì logic giao dịch có thể bị lộ.
- **Phía Server**: An toàn hơn, đặc biệt với các giao dịch phức tạp như đa chữ ký (multisig), vì logic được xử lý trên server và không bị lộ cho người dùng.

## Thiết Lập Giao Diện Người Dùng (UI)

Chúng ta sẽ tạo một giao diện đơn giản để người dùng nhập địa chỉ nhận và số lượng ADA, sau đó thực hiện giao dịch. Giao diện bao gồm:

- **Nút Connect Wallet**: Kết nối với ví Cardano (như Eternl) để lấy thông tin ví và ký giao dịch.
- **Form Nhập Dữ Liệu**: Ô input cho địa chỉ người nhận và số lượng ADA.
- **Nút Tạo Giao Dịch**: Thực hiện xây dựng, ký, và gửi giao dịch.

### Bước 1: Cài Đặt Dự Án Next.js
Giả sử bạn đã tạo một dự án Next.js (nếu chưa, chạy lệnh `npx create-next-app@latest`). Cài đặt MeshJS:

```bash
npm install @meshsdk/core@1.8.14
```

Cập nhật `next.config.js` để hỗ trợ MeshJS với App Router:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@meshsdk/core'],
};

module.exports = nextConfig;
```

### Bước 2: Tạo Thành Phần Connect Wallet
Tạo tệp `app/components/WalletConnect.jsx` để xử lý kết nối ví:

```jsx
import { useState, useEffect } from 'react';
import { BrowserWallet } from '@meshsdk/core';

export default function WalletConnect({ setWallet }) {
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(0);

  const connectWallet = async () => {
    try {
      const wallets = BrowserWallet.getInstalledWallets();
      if (wallets.length === 0) {
        alert('No wallet found. Please install a Cardano wallet (e.g., Eternl).');
        return;
      }
      const selectedWallet = await BrowserWallet.enable('eternl');
      setWallet(selectedWallet);
      const addresses = await selectedWallet.getUsedAddresses();
      setAddress(addresses[0]);
      const balance = await selectedWallet.getBalance();
      setBalance(balance.find(asset => asset.unit === 'lovelace').quantity / 1000000); // Convert lovelace to ADA
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet.');
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    setAddress('');
    setBalance(0);
  };

  return (
    <div>
      {address ? (
        <div>
          <p>Connected: {address.slice(0, 8)}...{address.slice(-8)}</p>
          <p>Balance: {balance} ADA</p>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
        </div>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}
```

### Bước 3: Tạo Trang Gửi Giao Dịch
Tạo tệp `app/send/page.jsx` cho trang `/send` với form nhập dữ liệu và logic giao dịch:

```jsx
'use client';
import { useState, useEffect } from 'react';
import { Transaction, BrowserWallet } from '@meshsdk/core';
import WalletConnect from '../components/WalletConnect';

export default function Send() {
  const [wallet, setWallet] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const getBalance = async () => {
      if (wallet) {
        try {
          const balance = await wallet.getBalance();
          setBalance(balance.find(asset => asset.unit === 'lovelace').quantity / 1000000);
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      } else {
        setBalance(0);
      }
    };
    getBalance();
  }, [wallet]);

  const createTransaction = async () => {
    if (!wallet) {
      alert('Please connect a wallet first.');
      return;
    }
    if (!recipient || !amount) {
      alert('Please fill in recipient address and amount.');
      return;
    }

    try {
      const amountInLovelace = String(Number(amount) * 1000000); // Convert ADA to lovelace
      const tx = new Transaction({ initiator: wallet });
      tx.sendValue(
        { lovelace: amountInLovelace },
        recipient
      );

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      alert(`Transaction submitted: ${txHash}`);
      console.log('Transaction Hash:', txHash);
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Failed to create transaction.');
    }
  };

  return (
    <main>
      <h1>Send ADA</h1>
      <WalletConnect setWallet={setWallet} />
      <div>
        <h2>Recipient Information</h2>
        <div>
          <label>Recipient Address:</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter recipient address"
          />
        </div>
        <div>
          <label>Amount (ADA):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount in ADA"
          />
        </div>
        <button onClick={createTransaction}>Create Transaction</button>
      </div>
      <p>Balance: {balance} ADA</p>
    </main>
  );
}
```

**Giải Thích Mã**:
- **State Management**: Sử dụng `useState` để lưu trữ địa chỉ người nhận (`recipient`) và số lượng ADA (`amount`).
- **Wallet Balance**: `useEffect` tự động cập nhật số dư ví khi `wallet` thay đổi.
- **Transaction Logic**:
  - Kiểm tra ví đã kết nối và thông tin đầu vào đầy đủ.
  - Chuyển đổi số lượng ADA thành lovelace (1 ADA = 1,000,000 lovelace).
  - Sử dụng `Transaction` từ MeshJS để xây dựng giao dịch, gửi ADA đến địa chỉ người nhận.
  - `build()` tạo giao dịch chưa ký (`unsignedTx`).
  - `signTx()` yêu cầu ví ký giao dịch (hiển thị pop-up để nhập mật khẩu).
  - `submitTx()` gửi giao dịch lên blockchain, trả về hash giao dịch.
- **Error Handling**: Hiển thị thông báo lỗi nếu thiếu ví hoặc thông tin đầu vào.

**Kiểm Tra Giao Dịch**:
- Chạy dự án: `npm run dev`.
- Truy cập `http://localhost:3000/send`.
- Kết nối ví Eternl, nhập địa chỉ người nhận và số lượng ADA (ví dụ: 1000 ADA), nhấn "Create Transaction".
- Kiểm tra hash giao dịch trên [Cardano Testnet Explorer](https://testnet.cardanoscan.io/).

## Xây Dựng Giao Dịch Ở Phía Server

Xây dựng giao dịch ở phía client đơn giản nhưng có hạn chế:
- **Bảo Mật**: Logic giao dịch có thể bị lộ, cho phép người dùng chỉnh sửa hoặc tạo giao dịch giả mạo.
- **Hạn Chế Chức Năng**: Không hỗ trợ các giao dịch phức tạp như đa chữ ký (multisig).

Xây dựng ở phía server an toàn hơn và phù hợp với các ứng dụng thực tế.

### Bước 4: Tạo API Route Cho Giao Dịch
Tạo tệp `app/api/cardano/send/route.js` để xử lý giao dịch trên server:

```javascript
import { NextResponse } from 'next/server';
import { Transaction } from '@meshsdk/core';

export async function POST(request) {
  try {
    const { sender, receiver, amount } = await request.json();

    if (!sender || !receiver || !amount) {
      return NextResponse.json({ error: 'Missing sender, receiver, or amount' }, { status: 400 });
    }

    // Lấy UTXO từ Blockfrost
    const projectId = 'preprodYourProjectIdHere'; // Thay bằng Project ID của bạn
    const response = await fetch(`https://cardano-preprod.blockfrost.io/api/v0/addresses/${sender}/utxos`, {
      headers: { project_id: projectId },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const utxos = await response.json();
    if (utxos.length === 0) {
      return NextResponse.json({ error: 'No UTXOs found for sender address' }, { status: 400 });
    }

    // Format UTXO cho MeshJS
    const formattedUtxos = utxos.map(utxo => ({
      input: {
        outputIndex: utxo.output_index,
        txHash: utxo.tx_hash,
      },
      output: {
        address: sender,
        amount: utxo.amount.map(asset => ({
          unit: asset.unit,
          quantity: asset.quantity,
        })),
      },
    }));

    // Xây dựng giao dịch
    const tx = new Transaction({ initiator: null }); // Không cần ví trên server
    tx.setTxInputs(formattedUtxos);
    tx.sendValue(
      { lovelace: String(Number(amount) * 1000000) }, // Convert ADA to lovelace
      receiver
    );

    const unsignedTx = await tx.build();
    return NextResponse.json({ unsignedTx });
  } catch (error) {
    console.error('Error building transaction:', error);
    return NextResponse.json({ error: 'Failed to build transaction' }, { status: 500 });
  }
}
```

### Bước 5: Tích Hợp API Vào Trang Send
Cập nhật `app/send/page.jsx` để gọi API server thay vì xây dựng giao dịch trực tiếp:

```jsx
'use client';
import { useState, useEffect } from 'react';
import { BrowserWallet } from '@meshsdk/core';
import WalletConnect from '../components/WalletConnect';

export default function Send() {
  const [wallet, setWallet] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [sender, setSender] = useState('');

  useEffect(() => {
    const getBalance = async () => {
      if (wallet) {
        try {
          const balance = await wallet.getBalance();
          setBalance(balance.find(asset => asset.unit === 'lovelace').quantity / 1000000);
          const addresses = await wallet.getUsedAddresses();
          setSender(addresses[0]);
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      } else {
        setBalance(0);
        setSender('');
      }
    };
    getBalance();
  }, [wallet]);

  const createTransaction = async () => {
    if (!wallet || !sender) {
      alert('Please connect a wallet first.');
      return;
    }
    if (!recipient || !amount) {
      alert('Please fill in recipient address and amount.');
      return;
    }

    try {
      // Gửi yêu cầu đến server
      const response = await fetch('/api/cardano/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender, receiver: recipient, amount }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const { unsignedTx } = await response.json();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      alert(`Transaction submitted: ${txHash}`);
      console.log('Transaction Hash:', txHash);
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Failed to create transaction.');
    }
  };

  return (
    <main>
      <h1>Send ADA</h1>
      <WalletConnect setWallet={setWallet} />
      <div>
        <h2>Recipient Information</h2>
        <div>
          <label>Recipient Address:</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Enter recipient address"
          />
        </div>
        <div>
          <label>Amount (ADA):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount in ADA"
          />
        </div>
        <button onClick={createTransaction}>Create Transaction</button>
      </div>
      <p>Balance: {balance} ADA</p>
    </main>
  );
}
```

**Giải Thích Mã**:
- **Server-Side**:
  - API route `/api/cardano/send` nhận thông tin `sender`, `receiver`, và `amount` từ client.
  - Sử dụng Blockfrost để lấy UTXO của địa chỉ người gửi.
  - Format UTXO để tương thích với MeshJS (Blockfrost trả về định dạng khác với `wallet.getUtxos()`).
  - Xây dựng giao dịch chưa ký (`unsignedTx`) và trả về cho client.
- **Client-Side**:
  - Gửi yêu cầu POST đến API với thông tin giao dịch.
  - Nhận `unsignedTx`, ký bằng ví (`signTx`), và gửi lên blockchain (`submitTx`).
- **Lợi Ích**:
  - Logic giao dịch được xử lý trên server, tăng bảo mật.
  - Hỗ trợ các giao dịch phức tạp như đa chữ ký bằng cách trả về `unsignedTx` cho nhiều ví ký.
  - Ngăn người dùng can thiệp vào logic giao dịch.

**Kiểm Tra Giao Dịch**:
- Nhập địa chỉ người nhận (ví dụ: một địa chỉ testnet khác) và số lượng ADA (ví dụ: 250 ADA).
- Kiểm tra tab Network trong DevTools để xác nhận yêu cầu POST và phản hồi `unsignedTx`.
- Kiểm tra hash giao dịch trên [Cardano Testnet Explorer](https://testnet.cardanoscan.io/).

## Lợi Ích Của Xây Dựng Giao Dịch Ở Server

1. **Bảo Mật**:
   - Logic giao dịch được ẩn trên server, ngăn người dùng đọc hoặc chỉnh sửa.
   - Tránh lộ thông tin nhạy cảm như cách UTXO được chọn.

2. **Hỗ Trợ Multisig**:
   - Giao dịch đa chữ ký yêu cầu nhiều bên ký. Server tạo `unsignedTx`, sau đó mỗi bên ký riêng, đảm bảo tính linh hoạt.

3. **Tối Ưu Hiệu Suất**:
   - Server có thể sử dụng Blockfrost để lấy UTXO, đảm bảo dữ liệu chính xác và giảm tải cho client.

4. **Kiểm Soát**:
   - Ngăn chặn việc tạo giao dịch giả mạo hoặc khai thác lỗ hổng.

**Nhược điểm**:
- Phụ thuộc vào server và Blockfrost.
- Cần thêm bước gọi API, có thể tăng độ trễ nhỏ.

## Tài Liệu Tham Khảo

- [MeshJS Documentation](https://meshjs.dev/): Hướng dẫn sử dụng Transaction và BrowserWallet.
- [Blockfrost API Documentation](https://docs.blockfrost.io/): Endpoint để lấy UTXO và gửi giao dịch.
- [Cardano Developer Portal](https://devs.cardano.org/): Công cụ và tài liệu phát triển Cardano.
- [Cardano Testnet Explorer](https://testnet.cardanoscan.io/): Kiểm tra giao dịch.

## Kết Luận

Bài viết đã hướng dẫn cách tạo giao dịch chuyển tiền trên Cardano, từ xây dựng giao diện người dùng đến xử lý logic giao dịch ở cả phía client và server. Xây dựng giao dịch ở phía server được khuyến nghị cho các ứng dụng thực tế vì tính bảo mật và khả năng hỗ trợ các giao dịch phức tạp. Bạn có thể mở rộng bằng cách thêm hỗ trợ đa chữ ký hoặc tích hợp các tính năng khác như mint token, tham khảo tài liệu MeshJS và Blockfrost.
