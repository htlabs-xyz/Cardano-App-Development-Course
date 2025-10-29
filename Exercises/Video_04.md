# 📘 Video 4: Cardano interaction using libraries and sdk

## 📝 Bài tập 1: Hiểu On-chain và Off-chain

### Đề bài

Giải thích sự khác biệt giữa on-chain và off-chain trong blockchain Cardano.

### Yêu cầu

- Mô tả khái niệm on-chain và off-chain.
- Liệt kê ít nhất 2 ví dụ cho mỗi loại.
- Giải thích vai trò của ví trong các hoạt động off-chain.

<details>
<summary>Cách giải</summary>

1. **Khái niệm**:
   - **On-chain**: Các hoạt động hoặc logic được thực hiện trực tiếp trên blockchain, do các validator xử lý. Ví dụ: Chạy hợp đồng thông minh, xác nhận giao dịch.
   - **Off-chain**: Các hoạt động diễn ra ngoài blockchain, như xây dựng giao dịch, ký giao dịch, hoặc tương tác với ví trình duyệt.
2. **Ví dụ**:
   - **On-chain**: Xác nhận giao dịch chuyển ADA, thực thi logic hợp đồng thông minh.
   - **Off-chain**: Tạo giao dịch trong ứng dụng, ký giao dịch bằng ví, query dữ liệu từ blockchain.
3. **Vai trò của ví**:
   - Ví (như Eternl) quản lý private key, hỗ trợ ký giao dịch và dữ liệu off-chain, sau đó gửi lên blockchain để xử lý on-chain.

### Đáp án

- **On-chain**: Logic chạy trên blockchain bởi các validator. Ví dụ: Xác nhận giao dịch, thực thi hợp đồng thông minh.
- **Off-chain**: Hoạt động ngoài blockchain. Ví dụ: Xây dựng giao dịch, ký giao dịch bằng ví.
- **Vai trò ví**: Quản lý private key, ký giao dịch/dữ liệu off-chain để gửi lên blockchain.

</details>

---

## 📝 Bài tập 2: Tích hợp MeshJS vào dự án Next.js

### Đề bài

Tích hợp thư viện MeshJS vào một dự án Next.js để hiển thị nút kết nối ví Cardano.

### Yêu cầu

- Cài đặt MeshJS trong dự án Next.js.
- Tạo component `WalletConnect` để hiển thị nút kết nối ví.
- Hiển thị tên ví và địa chỉ sau khi kết nối thành công.
- Đảm bảo sử dụng App Router của Next.js.

<details>
<summary>Cách giải</summary>

1. **Cài đặt MeshJS**:
   - Chạy lệnh: `npm install @meshsdk/core @meshsdk/react`.
   - Cấu hình `next.config.js` để hỗ trợ MeshJS với App Router.
2. **Tạo component WalletConnect**:
   - Tạo file `components/WalletConnect.tsx` sử dụng `useWallet` từ MeshJS.
   - Hiển thị nút kết nối và thông tin ví sau khi kết nối.
3. **Sử dụng component**:
   - Import và render component trong `app/page.tsx`.
4. **Kiểm tra**:
   - Chạy ứng dụng và kiểm tra kết nối ví (như Eternl).

### Đáp án

Cài đặt MeshJS:

```bash
npm install @meshsdk/core @meshsdk/react
```

Cấu hình `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },
};

module.exports = nextConfig;
```

Tạo file `components/WalletConnect.tsx`:

```tsx
"use client";
import { useWallet } from "@meshsdk/react";

export default function WalletConnect() {
  const { connect, disconnect, wallet, connected, name, walletAddress } =
    useWallet();

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {!connected ? (
        <button onClick={() => connect("eternl")}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected Wallet: {name}</p>
          <p>Address: {walletAddress}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      )}
    </div>
  );
}
```

Sửa file `app/page.tsx`:

```tsx
import WalletConnect from "../components/WalletConnect";

export default function Home() {
  return (
    <div>
      <h1>Cardano DApp</h1>
      <WalletConnect />
    </div>
  );
}
```

Chạy `npm run dev`, truy cập `http://localhost:3000`, nhấn nút "Connect Wallet" để kết nối ví Eternl và hiển thị thông tin ví.

</details>

---

## 📝 Bài tập 3: Gửi ADA bằng MeshJS

### Đề bài

Tạo chức năng gửi 1 ADA từ ví người dùng đến một địa chỉ ví khác bằng MeshJS.

### Yêu cầu

- Tạo nút "Send ADA" trong trang chủ.
- Sử dụng MeshJS để xây dựng và ký giao dịch chuyển 1 ADA.
- Hiển thị thông báo thành công hoặc lỗi sau khi gửi.
- Kiểm tra giao dịch trên Cardano explorer (như cardanoscan.io).

<details>
<summary>Cách giải</summary>

1. **Tạo hàm gửi ADA**:
   - Sử dụng `Transaction` từ `@meshsdk/core` để xây dựng giao dịch.
   - Lấy địa chỉ ví người nhận từ input hoặc hardcode.
   - Ký giao dịch bằng ví trình duyệt và submit lên blockchain.
2. **Tạo giao diện**:
   - Thêm nút và thông báo trạng thái trong `app/page.tsx`.
3. **Kiểm tra**:
   - Kiểm tra console log và Cardano explorer để xác nhận giao dịch.

### Đáp án

Sửa file `app/page.tsx`:

```tsx
"use client";
import { useState } from "react";
import { useWallet } from "@meshsdk/react";
import { Transaction } from "@meshsdk/core";

export default function Home() {
  const { wallet, connected } = useWallet();
  const [status, setStatus] = useState("");

  const sendADA = async () => {
    if (!connected) {
      setStatus("Vui lòng kết nối ví!");
      return;
    }

    try {
      const tx = new Transaction({ initiator: wallet });
      tx.sendAssets(
        { address: "addr_test1..." }, // Thay bằng địa chỉ ví người nhận
        [{ unit: "lovelace", quantity: "1000000" }] // 1 ADA = 1,000,000 lovelace
      );

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);

      setStatus(`Giao dịch thành công! Tx Hash: ${txHash}`);
    } catch (error) {
      setStatus(`Lỗi: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Cardano DApp</h1>
      <button onClick={sendADA} disabled={!connected}>
        Send 1 ADA
      </button>
      <p>{status}</p>
    </div>
  );
}
```

Chạy `npm run dev`, kết nối ví, nhấn "Send 1 ADA", kiểm tra thông báo và giao dịch trên [cardanoscan.io](https://cardanoscan.io/) bằng Tx Hash.

</details>

---

## 📝 Bài tập 4: Lấy dữ liệu từ Blockchain bằng MeshJS Provider

### Đề bài

Sử dụng MeshJS provider để lấy số dư ví từ blockchain Cardano.

### Yêu cầu

- Sử dụng `BlockfrostProvider` để query số dư ví.
- Hiển thị số dư ADA trong ví sau khi kết nối.
- Xử lý lỗi nếu không kết nối ví.
- Định dạng giao diện hiển thị số dư.

<details>
<summary>Cách giải</summary>

1. **Cài đặt provider**:
   - Cài đặt `@meshsdk/core` và cấu hình `BlockfrostProvider` với API key.
2. **Query số dư**:
   - Sử dụng `BlockfrostProvider` để lấy số dư ví bằng `wallet.getBalance()`.
3. **Hiển thị giao diện**:
   - Thêm trạng thái số dư vào `app/page.tsx` và hiển thị bằng CSS.
4. **Xử lý lỗi**:
   - Kiểm tra trạng thái kết nối ví trước khi query.

### Đáp án

Cài đặt:

```bash
npm install @meshsdk/core
```

Sửa file `app/page.tsx`:

```tsx
"use client";
import { useState, useEffect } from "react";
import { useWallet } from "@meshsdk/react";
import { BlockfrostProvider } from "@meshsdk/core";

export default function Home() {
  const { wallet, connected, walletAddress } = useWallet();
  const [balance, setBalance] = useState("");

  useEffect(() => {
    if (connected && walletAddress) {
      const provider = new BlockfrostProvider("your_blockfrost_api_key"); // Thay bằng API key của bạn
      async function fetchBalance() {
        try {
          const balance = await wallet.getBalance();
          const ada =
            balance.find((asset) => asset.unit === "lovelace")?.quantity || "0";
          setBalance(`${parseInt(ada) / 1000000} ADA`);
        } catch (error) {
          setBalance("Lỗi khi lấy số dư");
        }
      }
      fetchBalance();
    }
  }, [connected, walletAddress]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Cardano DApp</h1>
      {connected ? (
        <div>
          <p>Address: {walletAddress}</p>
          <p>Balance: {balance}</p>
        </div>
      ) : (
        <p>Vui lòng kết nối ví</p>
      )}
    </div>
  );
}
```

Chạy `npm run dev`, kết nối ví, kiểm tra số dư hiển thị trên trang. Đăng ký API key tại [Blockfrost](https://blockfrost.io/) để sử dụng `BlockfrostProvider`.

</details>

---

## 📝 Bài tập 5: Ký và Xác minh Dữ liệu với MeshJS

### Đề bài

Tạo chức năng ký dữ liệu và xác minh chữ ký bằng MeshJS để đăng nhập bằng ví Cardano.

### Yêu cầu

- Tạo nút "Sign Data" để ký một chuỗi dữ liệu bất kỳ.
- Xác minh chữ ký để kiểm tra quyền sở hữu ví.
- Hiển thị thông báo thành công hoặc lỗi.
- Đảm bảo logic chạy trên client-side.

<details>
<summary>Cách giải</summary>

1. **Ký dữ liệu**:
   - Sử dụng `wallet.signData()` để ký chuỗi dữ liệu.
   - Lưu chữ ký và dữ liệu gốc.
2. **Xác minh chữ ký**:
   - Sử dụng `Mesh.verifyData()` để kiểm tra chữ ký hợp lệ.
3. **Giao diện**:
   - Thêm nút và trạng thái hiển thị trong `app/page.tsx`.
4. **Kiểm tra**:
   - Kiểm tra console log và thông báo trên giao diện.

### Đáp án

Sửa file `app/page.tsx`:

```tsx
"use client";
import { useState } from "react";
import { useWallet } from "@meshsdk/react";
import { Mesh } from "@meshsdk/core";

export default function Home() {
  const { wallet, connected, walletAddress } = useWallet();
  const [status, setStatus] = useState("");

  const signAndVerify = async () => {
    if (!connected) {
      setStatus("Vui lòng kết nối ví!");
      return;
    }

    try {
      const data = "Hello, Cardano!";
      const signedData = await wallet.signData(walletAddress, data);
      console.log("Signed Data:", signedData);

      const isValid = Mesh.verifyData(
        walletAddress,
        data,
        signedData.signature
      );
      setStatus(
        isValid
          ? "Chữ ký hợp lệ! Đăng nhập thành công."
          : "Chữ ký không hợp lệ!"
      );
    } catch (error) {
      setStatus(`Lỗi: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Cardano DApp</h1>
      <button onClick={signAndVerify} disabled={!connected}>
        Sign Data
      </button>
      <p>{status}</p>
    </div>
  );
}
```

Chạy `npm run dev`, kết nối ví, nhấn "Sign Data" để ký dữ liệu và kiểm tra thông báo xác minh. Console log sẽ hiển thị dữ liệu đã ký.

</details>

---
