# Video 04:  Cardano interaction using libraries and sdk

Bài viết này cung cấp hướng dẫn toàn diện về cách tương tác với blockchain Cardano, bao gồm cả hoạt động on-chain và off-chain bằng cách sử dụng các thư viện và SDK, với trọng tâm là thư viện MeshJS cho các dự án dựa trên JavaScript. Hướng dẫn này dành cho các nhà phát triển xây dựng ứng dụng phi tập trung (dApps) trên Cardano, đặc biệt là sử dụng Node.js và Next.js. Bằng cách làm theo hướng dẫn, bạn có thể thiết lập dự án, kết nối ví Cardano và thực hiện các tương tác blockchain cơ bản như xây dựng và gửi giao dịch.

## Yêu Cầu Chuẩn Bị

Trước khi bắt đầu, hãy đảm bảo bạn có:

- **Node.js và npm**: Cài đặt Node.js (khuyến nghị phiên bản 16 trở lên) và npm để quản lý các phụ thuộc JavaScript.
- **Trình Soạn Thảo Mã**: Sử dụng trình soạn thảo như Visual Studio Code để phát triển.
- **Ví Cardano**: Thiết lập ví Cardano (ví dụ: Eternl) với một lượng test ADA (tADA) trên mạng thử nghiệm Cardano testnet. Tham khảo [tài liệu testnet của Cardano](https://docs.cardano.org/cardano-testnet) để biết cách thiết lập.
- **Kiến Thức Cơ Bản**: Hiểu biết cơ bản về JavaScript, Node.js và các khái niệm blockchain.

## Hiểu Biết On-Chain và Off-Chain

### On-Chain Là Gì?
Hoạt động on-chain là các logic và quy trình được thực thi trực tiếp trên blockchain Cardano, thông qua các validator (nút) trong mạng. Ví dụ bao gồm:

- **Hợp Đồng Thông Minh**: Logic xử lý các hành động như chuyển giao tài sản hoặc kiểm tra điều kiện hợp đồng được thực hiện bởi các validator. Chẳng hạn, trong giao dịch mua bán, hợp đồng thông minh kiểm tra các điều kiện (ví dụ: bên A có gửi tiền hay không) và ghi kết quả lên blockchain.
- **Tính Bất Biến Dữ Liệu**: Khi một giao dịch được xác thực và thêm vào block, nó trở thành bất biến và không thể thay đổi.

### Off-Chain Là Gì?
Hoạt động off-chain diễn ra bên ngoài blockchain, bao gồm việc chuẩn bị dữ liệu hoặc giao dịch để gửi lên blockchain. Ví dụ bao gồm:

- **Xây Dựng Giao Dịch**: Tạo giao dịch với các tham số cần thiết (ví dụ: địa chỉ người nhận, số lượng) trong ứng dụng của bạn.
- **Tương Tác Với Ví**: Kết nối với ví của người dùng, ký giao dịch và gửi giao dịch lên blockchain.
- **Dữ Liệu Nhị Phân**: Các quy trình off-chain tạo ra một tệp nhị phân đã biên dịch (ví dụ: định dạng CBOR) để gửi lên blockchain nhằm xác thực.

Tóm lại, hoạt động on-chain xử lý việc thực thi logic và lưu trữ dữ liệu trên blockchain, trong khi hoạt động off-chain liên quan đến việc chuẩn bị và ký giao dịch cục bộ trước khi gửi.

## Tổng Quan Về Công Cụ Phát Triển Cardano

Cardano cung cấp nhiều thư viện và SDK để hỗ trợ phát triển. Bạn có thể khám phá các công cụ này tại [devs.cardano.org/tools](https://devs.cardano.org/tools). Một số thư viện đáng chú ý bao gồm:

- **Python**: PyCardano để xây dựng giao dịch off-chain.
- **JavaScript**: MeshJS, một thư viện off-chain toàn diện để tích hợp ví, xây dựng giao dịch và truy vấn dữ liệu blockchain.
- **Khác**: Các thư viện như Lucid cũng hỗ trợ các chức năng tương tự.

## Cài Đặt Thư Viện MeshJS Trong Dự Án Next.js

Dưới đây là các bước chi tiết để tích hợp thư viện MeshJS vào một dự án Next.js.

### Bước 1: Thiết Lập Dự Án Next.js
Giả sử bạn đã tạo một dự án Next.js (nếu chưa, chạy lệnh `npx create-next-app@latest` để tạo). Đảm bảo dự án của bạn sử dụng **App Router** (không phải Pages Router) vì đây là cách tiếp cận hiện đại hơn.

### Bước 2: Cài Đặt MeshJS
1. Mở terminal trong thư mục dự án Next.js.
2. Cài đặt phiên bản mới nhất của MeshJS (phiên bản 1.8.14 được khuyến nghị vì tính ổn định):
   ```bash
   npm install @meshsdk/core@1.8.14
   ```
   **Lưu ý**: Tránh sử dụng phiên bản beta (ví dụ: 1.9.x) vì chúng có thể không ổn định.

3. Nếu dự án sử dụng các thành phần giao diện, bạn có thể cần cài thêm thư viện hỗ trợ, ví dụ:
   ```bash
   npm install @meshsdk/react
   ```
   Tuy nhiên, trong hướng dẫn này, chúng ta sẽ tự tạo các thành phần giao diện thay vì sử dụng các thành phần có sẵn từ MeshJS.

### Bước 3: Cấu Hình Next.js
MeshJS hướng dẫn sử dụng Pages Router, nhưng vì chúng ta dùng App Router, cần chỉnh sửa tệp cấu hình `next.config.js`. Dưới đây là cấu hình mẫu:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@meshsdk/core', '@meshsdk/react'],
};

module.exports = nextConfig;
```

- Tạo hoặc cập nhật tệp `next.config.js` trong thư mục gốc của dự án và dán nội dung trên.
- Tệp này đảm bảo MeshJS được biên dịch đúng cách với App Router.

**Lưu ý**: Bạn có thể tìm cấu hình mẫu trên GitHub của MeshJS hoặc liên hệ với tác giả video để lấy liên kết chính xác.

### Bước 4: Tạo Thành Phần Kết Nối Ví
Để kết nối ví Cardano (như Eternl), tạo một thành phần giao diện để hiển thị nút "Connect Wallet" và xử lý tương tác ví.

1. Trong thư mục `app/components`, tạo một thư mục `wallet-connect`.
2. Tạo tệp `WalletConnect.jsx` với nội dung sau:

```jsx
import { useState } from 'react';
import { BrowserWallet } from '@meshsdk/core';

export default function WalletConnect() {
  const [wallet, setWallet] = useState(null);
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
      {wallet ? (
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

3. Trong tệp `app/page.jsx`, thêm thành phần `WalletConnect`:

```jsx
import WalletConnect from './components/wallet-connect/WalletConnect';

export default function Home() {
  return (
    <main>
      <h1>Cardano dApp</h1>
      <WalletConnect />
    </main>
  );
}
```

4. Chạy dự án bằng lệnh:
   ```bash
   npm run dev
   ```
   Truy cập `http://localhost:3000` và bạn sẽ thấy nút "Connect Wallet". Khi nhấp vào, nó sẽ hiển thị danh sách ví đã cài đặt (như Eternl) và cho phép kết nối để xem địa chỉ và số dư.

### Bước 5: Xây Dựng và Gửi Giao Dịch
Để minh họa cách xây dựng và gửi giao dịch, chúng ta sẽ tạo một hàm gửi 1 ADA đến một địa chỉ cụ thể.

1. Trong `app/page.jsx`, thêm hàm gửi ADA:

```jsx
import { useState } from 'react';
import { BrowserWallet, Transaction } from '@meshsdk/core';
import WalletConnect from './components/wallet-connect/WalletConnect';

export default function Home() {
  const [wallet, setWallet] = useState(null);

  const sendAda = async () => {
    if (!wallet) {
      alert('Please connect a wallet first.');
      return;
    }

    try {
      const tx = new Transaction({ initiator: wallet });
      tx.sendValue(
        { lovelace: 1000000 }, // 1 ADA
        'addr_test1...recipient_address...' // Thay bằng địa chỉ nhận thực tế
      );

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      console.log('Transaction Hash:', txHash);
      alert(`Transaction submitted: ${txHash}`);
    } catch (error) {
      console.error('Error sending ADA:', error);
      alert('Failed to send ADA.');
    }
  };

  return (
    <main>
      <h1>Cardano dApp</h1>
      <WalletConnect setWallet={setWallet} />
      <button onClick={sendAda}>Send 1 ADA</button>
    </main>
  );
}
```

2. Cập nhật `WalletConnect.jsx` để truyền `setWallet`:

```jsx
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
      setBalance(balance.find(asset => asset.unit === 'lovelace').quantity / 1000000);
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

3. **Giải Thích Mã**:
   - `BrowserWallet.getInstalledWallets()`: Lấy danh sách ví đã cài đặt trên trình duyệt.
   - `BrowserWallet.enable('eternl')`: Kích hoạt ví Eternl.
   - `Transaction`: Lớp MeshJS để xây dựng giao dịch. `sendValue` thêm thông tin chuyển 1 ADA đến địa chỉ nhận.
   - `build()`: Tạo giao dịch chưa ký.
   - `signTx()`: Yêu cầu ví ký giao dịch (hiển thị pop-up để nhập mật khẩu).
   - `submitTx()`: Gửi giao dịch đã ký lên blockchain, trả về hash giao dịch.

4. **Kiểm Tra Giao Dịch**:
   - Sau khi gửi, bạn có thể kiểm tra giao dịch trên [Cardano testnet explorer](https://testnet.cardanoscan.io/).
   - Giao dịch cần được các validator xác nhận, có thể mất vài phút để xuất hiện trên blockchain.

## Các Chức Năng Chính Của MeshJS

MeshJS cung cấp ba thành phần chính:

1. **Wallet (Ví)**:
   - **BrowserWallet**: Tương tác với ví trên trình duyệt (như Eternl). Các hàm chính:
     - `getInstalledWallets()`: Lấy danh sách ví.
     - `enable()`: Kích hoạt ví.
     - `getBalance()`: Lấy số dư (đơn vị lovelace, 1 ADA = 1,000,000 lovelace).
     - `getUsedAddresses()`: Lấy địa chỉ ví.
     - `signData()`: Ký dữ liệu để xác minh quyền sở hữu ví (không mất phí gas).
     - `signTx()`: Ký giao dịch.
     - `submitTx()`: Gửi giao dịch lên blockchain.
   - **AppWallet**: Tự động ký giao dịch bằng private key (dùng trên server, không khuyến khích cho client vì lý do bảo mật).

2. **Transaction Builder**:
   - Dùng để tạo giao dịch như chuyển ADA, mint tài sản, hoặc tương tác với hợp đồng thông minh.
   - Ví dụ: `tx.sendValue()` để chuyển ADA, `tx.mintAsset()` để mint token.
   - Quy trình: Khởi tạo `Transaction`, thêm tham số (như địa chỉ, số lượng), xây dựng (`build`), ký (`signTx`), và gửi (`submitTx`).

3. **Provider**:
   - Kết nối với blockchain để truy vấn dữ liệu (như số dư, UTXO) hoặc gửi giao dịch.
   - Hỗ trợ các nhà cung cấp như Blockfrost hoặc Koios. Ví dụ:
     - `getAssets()`: Lấy danh sách tài sản.
     - `getAddress()`: Lấy thông tin địa chỉ.
     - `submitTx()`: Gửi giao dịch thông qua provider.

## Tài Liệu Tham Khảo

- [MeshJS Documentation](https://meshjs.dev/): Hướng dẫn chi tiết về các hàm và API.
- [Cardano Developer Portal](https://devs.cardano.org/): Danh sách công cụ và thư viện.
- [Cardano Testnet Explorer](https://testnet.cardanoscan.io/): Kiểm tra giao dịch.

## Kết Luận

Bằng cách sử dụng MeshJS, bạn có thể dễ dàng tích hợp ví Cardano, xây dựng giao dịch và truy vấn dữ liệu blockchain trong ứng dụng Next.js. Hướng dẫn này đã cung cấp các bước cụ thể để thiết lập dự án, kết nối ví và gửi giao dịch. Để mở rộng, bạn có thể khám phá các chức năng như mint token hoặc tương tác với hợp đồng thông minh bằng cách tham khảo tài liệu MeshJS.
