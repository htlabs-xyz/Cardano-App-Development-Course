# Video 07: Minting/Burning Assets

Bài viết này hướng dẫn cách mint (tạo) và burn (hủy) tài sản (assets) trên blockchain Cardano, sử dụng thư viện MeshJS trong một dự án Next.js. Nội dung được thiết kế cho các nhà phát triển xây dựng ứng dụng phi tập trung (dApps) trên Cardano, bao gồm cả việc xử lý logic minting ở phía client và server. Bài viết cung cấp giao diện mẫu, logic xử lý giao dịch, và giải thích cách tạo tài sản như fungible tokens (FT) hoặc NFT, cùng với các lưu ý về bảo mật và tối ưu.

## Yêu Cầu Chuẩn Bị

Trước khi bắt đầu, hãy đảm bảo bạn có:

- **Node.js và npm**: Cài đặt Node.js (khuyến nghị phiên bản 16 trở lên) và npm để quản lý phụ thuộc JavaScript.
- **Trình Soạn Thảo Mã**: Sử dụng trình soạn thảo như Visual Studio Code.
- **Ví Cardano**: Thiết lập ví Cardano (như Eternl) với một lượng test ADA (tADA) trên mạng thử nghiệm Cardano testnet.
- **Tài Khoản Blockfrost** (cho server-side): Đăng ký tại [Blockfrost Dashboard](https://blockfrost.io/) để nhận Project ID nếu xây dựng giao dịch ở phía server.
- **Kiến Thức Cơ Bản**: Hiểu biết về JavaScript, API REST, và các khái niệm blockchain như UTXO, policy ID, và metadata.

## Tổng Quan Về Minting và Burning

### Minting Là Gì?
Minting là quá trình tạo mới một tài sản (asset) trên blockchain Cardano, như fungible tokens (FT) hoặc non-fungible tokens (NFT). Quá trình này bao gồm:

1. **Tạo Policy ID**: Một định danh duy nhất xác định bộ sưu tập tài sản, thường được tạo từ khóa công khai (public key) của ví hoặc một địa chỉ cố định.
2. **Xây Dựng Metadata**: Định nghĩa thông tin về tài sản (như tên, mô tả, link ảnh) theo chuẩn CIP-25 (metadata format 721).
3. **Xây Dựng Giao Dịch**: Tạo giao dịch minting, bao gồm UTXO đầu vào, metadata, và thông tin người nhận.
4. **Ký và Gửi**: Ký giao dịch bằng ví và gửi lên blockchain.

### Burning Là Gì?
Burning là quá trình hủy tài sản bằng cách gửi một giao dịch với số lượng tài sản âm (negative quantity). Điều này yêu cầu sử dụng cùng policy ID đã dùng để mint tài sản.

### Policy ID và Forging Script
- **Policy ID**: Được tạo từ một forging script, đảm bảo mỗi ví hoặc tổ chức có một định danh duy nhất. Ví dụ, MeshJS sử dụng `NativeScript` để tạo policy ID từ địa chỉ ví.
- **Forging Script**: Một đoạn mã xác định quyền mint tài sản, thường dựa trên khóa công khai của ví hoặc một địa chỉ cố định (cho các dự án tập trung như quản lý tín chỉ).

## Thiết Lập Giao Diện Người Dùng (UI)

Chúng ta sẽ tạo một giao diện để người dùng nhập thông tin tài sản (metadata) và địa chỉ người nhận, sau đó thực hiện minting. Giao diện bao gồm:

- **Nút Connect Wallet**: Kết nối ví Cardano để lấy thông tin và ký giao dịch.
- **Form Nhập Metadata**: Các trường như tên tài sản, mô tả, link ảnh, và vị trí (location).
- **Trường Receiver**: Địa chỉ người nhận tài sản (mặc định là ví của người gửi nếu không nhập).
- **Nút Mint**: Thực hiện giao dịch minting.

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
      const balance = await wallet.getBalance();
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

### Bước 3: Tạo Trang Mint Tài Sản
Tạo tệp `app/mint/page.jsx` cho trang `/mint` với form nhập metadata và logic minting:

```jsx
'use client';
import { useState, useEffect } from 'react';
import { Transaction, NativeScript } from '@meshsdk/core';
import WalletConnect from '../components/WalletConnect';

export default function Mint() {
  const [wallet, setWallet] = useState(null);
  const [metadata, setMetadata] = useState({
    name: '',
    image: '',
    description: '',
    location: '',
  });
  const [receiver, setReceiver] = useState('');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMetadata((prev) => ({ ...prev, [name]: value }));
  };

  const handleMint = async () => {
    if (!wallet) {
      alert('Please connect a wallet first.');
      return;
    }
    if (!metadata.name || !metadata.image || !metadata.description || !metadata.location) {
      alert('Please fill in all metadata fields.');
      return;
    }

    try {
      // Lấy địa chỉ ví người gửi
      const addresses = await wallet.getUsedAddresses();
      const senderAddress = addresses[0];
      const recipientAddress = receiver || senderAddress; // Mặc định gửi về ví người gửi

      // Tạo forging script và policy ID
      const forgingScript = NativeScript.fromAddress(senderAddress);
      const policyId = forgingScript.getPolicyId();

      // Chuẩn hóa token name
      const tokenName = metadata.name.replace(/\s+/g, '_').toLowerCase();
      const assetName = Buffer.from(tokenName).toString('hex');

      // Tạo metadata theo chuẩn CIP-25
      const assetMetadata = {
        [policyId]: {
          [tokenName]: {
            name: metadata.name,
            image: metadata.image,
            description: metadata.description,
            location: metadata.location,
          },
        },
      };

      // Xây dựng giao dịch
      const tx = new Transaction({ initiator: wallet });
      tx.mintAsset(
        forgingScript,
        {
          unit: `${policyId}${assetName}`,
          quantity: '1',
          label: '721',
        },
        assetMetadata
      );
      tx.sendValue(
        { assets: [{ unit: `${policyId}${assetName}`, quantity: '1' }] },
        recipientAddress
      );

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx, true); // true để ký với forging script
      const txHash = await wallet.submitTx(signedTx);
      alert(`Asset minted: ${txHash}`);
      console.log('Transaction Hash:', txHash);
    } catch (error) {
      console.error('Error minting asset:', error);
      alert('Failed to mint asset.');
    }
  };

  return (
    <main>
      <h1>Mint Asset</h1>
      <WalletConnect setWallet={setWallet} />
      <div>
        <h2>Asset Metadata</h2>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={metadata.name}
            onChange={handleInputChange}
            placeholder="Enter asset name"
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            value={metadata.image}
            onChange={handleInputChange}
            placeholder="Enter image URL"
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={metadata.description}
            onChange={handleInputChange}
            placeholder="Enter description"
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={metadata.location}
            onChange={handleInputChange}
            placeholder="Enter location"
          />
        </div>
        <div>
          <label>Recipient Address (optional):</label>
          <input
            type="text"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            placeholder="Enter recipient address or leave blank"
          />
        </div>
        <button onClick={handleMint}>Mint Asset</button>
      </div>
      <p>Balance: {balance} ADA</p>
    </main>
  );
}
```

**Giải Thích Mã**:
- **State Management**: Sử dụng `useState` để lưu trữ metadata (name, image, description, location) và địa chỉ người nhận (`receiver`).
- **Wallet Balance**: `useEffect` tự động cập nhật số dư ví khi `wallet` thay đổi.
- **Forging Script**: Sử dụng `NativeScript.fromAddress` để tạo policy ID từ địa chỉ ví, đảm bảo mỗi ví có policy ID duy nhất.
- **Token Name**: Chuẩn hóa tên tài sản (loại bỏ khoảng trắng, chuyển thành chữ thường, mã hóa thành hex).
- **Metadata**: Định dạng theo chuẩn CIP-25 (721) để lưu thông tin tài sản trên blockchain.
- **Transaction Logic**:
  - Tạo giao dịch với `Transaction` từ MeshJS.
  - Gọi `mintAsset` để mint tài sản với policy ID, số lượng (1), và metadata.
  - Gọi `sendValue` để gửi tài sản đến địa chỉ người nhận (mặc định là ví người gửi nếu không nhập `receiver`).
  - `build()` tạo giao dịch chưa ký (`unsignedTx`).
  - `signTx(true)` ký giao dịch với forging script.
  - `submitTx()` gửi giao dịch lên blockchain, trả về hash giao dịch.
- **Error Handling**: Hiển thị thông báo lỗi nếu thiếu ví hoặc metadata.

**Kiểm Tra Giao Dịch**:
- Chạy dự án: `npm run dev`.
- Truy cập `http://localhost:3000/mint`.
- Kết nối ví Eternl, nhập metadata (ví dụ: name: "MyToken", image: "ipfs://...", description: "Test token", location: "Hanoi"), và địa chỉ người nhận (tùy chọn).
- Nhấn "Mint Asset" và kiểm tra hash giao dịch trên [Cardano Testnet Explorer](https://testnet.cardanoscan.io/).

## Xây Dựng Minting Ở Phía Server

Xây dựng giao dịch minting ở phía client đơn giản nhưng có hạn chế về bảo mật và khả năng mở rộng. Xây dựng ở phía server an toàn hơn, đặc biệt với các ứng dụng yêu cầu policy ID cố định (như quản lý tín chỉ) hoặc giao dịch phức tạp.

### Bước 4: Tạo API Route Cho Minting
Tạo tệp `app/api/cardano/mint/route.js` để xử lý minting trên server:

```javascript
import { NextResponse } from 'next/server';
import { Transaction, NativeScript } from '@meshsdk/core';

export async function POST(request) {
  try {
    const { sender, receiver, metadata } = await request.json();

    if (!sender || !metadata || !metadata.name || !metadata.image || !metadata.description || !metadata.location) {
      return NextResponse.json({ error: 'Missing sender or metadata fields' }, { status: 400 });
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

    // Tạo forging script và policy ID
    const issuerAddress = 'addr_test1...issuer_address...'; // Thay bằng địa chỉ cố định của tổ chức (nếu cần)
    const forgingScript = NativeScript.fromAddress(issuerAddress);
    const policyId = forgingScript.getPolicyId();

    // Chuẩn hóa token name
    const tokenName = metadata.name.replace(/\s+/g, '_').toLowerCase();
    const assetName = Buffer.from(tokenName).toString('hex');

    // Tạo metadata theo chuẩn CIP-25
    const assetMetadata = {
      [policyId]: {
        [tokenName]: {
          name: metadata.name,
          image: metadata.image,
          description: metadata.description,
          location: metadata.location,
        },
      },
    };

    // Xây dựng giao dịch
    const tx = new Transaction({ initiator: null }); // Không cần ví trên server
    tx.setTxInputs(formattedUtxos);
    tx.mintAsset(
      forgingScript,
      {
        unit: `${policyId}${assetName}`,
        quantity: '1',
        label: '721',
      },
      assetMetadata
    );
    tx.sendValue(
      { assets: [{ unit: `${policyId}${assetName}`, quantity: '1' }] },
      receiver || sender // Mặc định gửi về ví người gửi
    );

    const unsignedTx = await tx.build();
    return NextResponse.json({ unsignedTx });
  } catch (error) {
    console.error('Error building mint transaction:', error);
    return NextResponse.json({ error: 'Failed to build mint transaction' }, { status: 500 });
  }
}
```

### Bước 5: Tích Hợp API Vào Trang Mint
Cập nhật `app/mint/page.jsx` để gọi API server thay vì xây dựng giao dịch trực tiếp:

```jsx
'use client';
import { useState, useEffect } from 'react';
import { BrowserWallet } from '@meshsdk/core';
import WalletConnect from '../components/WalletConnect';

export default function Mint() {
  const [wallet, setWallet] = useState(null);
  const [metadata, setMetadata] = useState({
    name: '',
    image: '',
    description: '',
    location: '',
  });
  const [receiver, setReceiver] = useState('');
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMetadata((prev) => ({ ...prev, [name]: value }));
  };

  const handleMint = async () => {
    if (!wallet || !sender) {
      alert('Please connect a wallet first.');
      return;
    }
    if (!metadata.name || !metadata.image || !metadata.description || !metadata.location) {
      alert('Please fill in all metadata fields.');
      return;
    }

    try {
      // Gửi yêu cầu đến server
      const response = await fetch('/api/cardano/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender, receiver, metadata }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const { unsignedTx } = await response.json();
      const signedTx = await wallet.signTx(unsignedTx, true);
      const txHash = await wallet.submitTx(signedTx);
      alert(`Asset minted: ${txHash}`);
      console.log('Transaction Hash:', txHash);
    } catch (error) {
      console.error('Error minting asset:', error);
      alert('Failed to mint asset.');
    }
  };

  return (
    <main>
      <h1>Mint Asset</h1>
      <WalletConnect setWallet={setWallet} />
      <div>
        <h2>Asset Metadata</h2>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={metadata.name}
            onChange={handleInputChange}
            placeholder="Enter asset name"
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            value={metadata.image}
            onChange={handleInputChange}
            placeholder="Enter image URL"
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={metadata.description}
            onChange={handleInputChange}
            placeholder="Enter description"
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={metadata.location}
            onChange={handleInputChange}
            placeholder="Enter location"
          />
        </div>
        <div>
          <label>Recipient Address (optional):</label>
          <input
            type="text"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            placeholder="Enter recipient address or leave blank"
          />
        </div>
        <button onClick={handleMint}>Mint Asset</button>
      </div>
      <p>Balance: {balance} ADA</p>
    </main>
  );
}
```

**Giải Thích Mã**:
- **Server-Side**:
  - API route `/api/cardano/mint` nhận thông tin `sender`, `receiver`, và `metadata` từ client.
  - Lấy UTXO từ Blockfrost và format để tương thích với MeshJS.
  - Sử dụng địa chỉ cố định (`issuerAddress`) để tạo policy ID thống nhất (phù hợp với các ứng dụng như quản lý tín chỉ).
  - Tạo giao dịch minting với `mintAsset` và `sendValue`, trả về `unsignedTx`.
- **Client-Side**:
  - Gửi yêu cầu POST đến API với thông tin metadata và địa chỉ.
  - Nhận `unsignedTx`, ký với ví (`signTx(true)`), và gửi lên blockchain (`submitTx`).
- **Policy ID**:
  - Sử dụng địa chỉ cố định (`issuerAddress`) để đảm bảo policy ID thống nhất cho tất cả tài sản trong dự án.
  - Nếu muốn mỗi người dùng có policy ID riêng, sử dụng `sender` thay vì `issuerAddress`.

**Kiểm Tra Giao Dịch**:
- Nhập metadata và địa chỉ người nhận (tùy chọn).
- Kiểm tra tab Network trong DevTools để xác nhận yêu cầu POST và phản hồi `unsignedTx`.
- Kiểm tra hash giao dịch trên [Cardano Testnet Explorer](https://testnet.cardanoscan.io/).

## Burning Tài Sản

Để burn (hủy) tài sản, bạn sử dụng cùng logic minting nhưng đặt số lượng (`quantity`) là âm. Ví dụ, để burn 1 token:

```javascript
// Trong hàm mintAsset
tx.mintAsset(
  forgingScript,
  {
    unit: `${policyId}${assetName}`,
    quantity: '-1', // Số lượng âm để burn
    label: '721',
  },
  assetMetadata
);
```

- **Lưu Ý**: Cần sử dụng cùng `forgingScript` và `policyId` đã dùng khi mint tài sản.
- Cập nhật logic trong `handleMint` hoặc API route để hỗ trợ burning bằng cách thêm tùy chọn (ví dụ: radio button để chọn mint hoặc burn).

## Lợi Ích Của Xây Dựng Minting Ở Server

1. **Bảo Mật**:
   - Logic minting được ẩn trên server, ngăn người dùng can thiệp vào policy ID hoặc metadata.
2. **Policy ID Thống Nhất**:
   - Sử dụng địa chỉ cố định để tạo policy ID duy nhất, phù hợp với các dự án như quản lý tín chỉ.
3. **Hỗ Trợ Giao Dịch Phức Tạp**:
   - Dễ dàng mở rộng cho các trường hợp như multisig hoặc minting hàng loạt.
4. **Kiểm Soát**:
   - Ngăn chặn tạo tài sản giả mạo hoặc khai thác lỗ hổng.

**Nhược điểm**:
- Phụ thuộc vào server và Blockfrost.
- Thêm bước gọi API, có thể tăng độ trễ nhỏ.

## Tài Liệu Tham Khảo

- [MeshJS Documentation](https://meshjs.dev/): Hướng dẫn sử dụng `Transaction`, `NativeScript`, và `mintAsset`.
- [Blockfrost API Documentation](https://docs.blockfrost.io/): Endpoint để lấy UTXO.
- [Cardano Developer Portal](https://devs.cardano.org/): Công cụ và tài liệu phát triển Cardano.
- [Cardano Testnet Explorer](https://testnet.cardanoscan.io/): Kiểm tra giao dịch và tài sản.
- [CIP-25 Metadata Standard](https://cips.cardano.org/cips/cip25/): Chuẩn metadata cho NFT.

## Kết Luận

Bài viết đã hướng dẫn cách mint và burn tài sản trên Cardano, từ xây dựng giao diện người dùng đến xử lý logic giao dịch ở cả phía client và server. Xây dựng giao dịch ở phía server được khuyến nghị cho các ứng dụng thực tế vì tính bảo mật và khả năng kiểm soát policy ID. Bạn có thể mở rộng bằng cách thêm hỗ trợ burning, multisig, hoặc tích hợp các tính năng khác như quản lý bộ sưu tập NFT, tham khảo tài liệu MeshJS và Blockfrost.
