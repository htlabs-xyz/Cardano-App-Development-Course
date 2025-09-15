# 📘 Video 7: Minting/Burning Assets On Cardano

## 📝 Bài tập 1: Tạo giao diện Form Minting FT

### Đề bài

Tạo một giao diện form trong Next.js để nhập thông tin metadata cho việc mint fungible token (FT).

### Yêu cầu

- Tạo trang `/mint` với form chứa các input: tên token, mô tả, link ảnh, vị trí (location), và địa chỉ ví nhận (tùy chọn).
- Sử dụng state để quản lý dữ liệu nhập vào.
- Hiển thị thông báo lỗi nếu input bắt buộc bị trống khi nhấn nút mint.
- Định dạng giao diện bằng CSS.

### Cách giải

1. **Tạo trang `/mint`**:
   - Tạo file `app/mint/page.tsx` để chứa form với các input cho metadata và địa chỉ ví nhận.
   - Sử dụng `useState` để quản lý dữ liệu nhập vào.
2. **Xử lý input và lỗi**:
   - Thêm sự kiện `onChange` cho các input để cập nhật state.
   - Kiểm tra các input bắt buộc (tên, mô tả) khi nhấn nút mint và hiển thị thông báo lỗi nếu trống.
3. **Định dạng giao diện**:
   - Sử dụng inline CSS để tạo giao diện đẹp và rõ ràng.

### Đáp án

Tạo file `app/mint/page.tsx`:

```tsx
"use client";
import { useState } from "react";

export default function Mint() {
  const [metadata, setMetadata] = useState({
    name: "",
    description: "",
    image: "",
    location: "",
    recipient: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!metadata.name || !metadata.description) {
      setError("Vui lòng nhập tên và mô tả token");
      return;
    }
    setError("");
    console.log("Metadata:", metadata);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Mint Fungible Token</h1>
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Tên token:</label>
          <input
            type="text"
            name="name"
            value={metadata.name}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Mô tả:</label>
          <input
            type="text"
            name="description"
            value={metadata.description}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Link ảnh:</label>
          <input
            type="text"
            name="image"
            value={metadata.image}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Vị trí:</label>
          <input
            type="text"
            name="location"
            value={metadata.location}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Địa chỉ ví nhận (tùy chọn):</label>
          <input
            type="text"
            name="recipient"
            value={metadata.recipient}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Mint Token
        </button>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>
    </div>
  );
}
```

Chạy `npm run dev`, truy cập `http://localhost:3000/mint`, nhập thông tin metadata, nhấn "Mint Token" để kiểm tra console log và thông báo lỗi nếu thiếu tên hoặc mô tả.

---

## 📝 Bài tập 2: Kết nối ví và hiển thị số dư

### Đề bài

Tích hợp ví Cardano vào trang `/mint` để hiển thị số dư ADA sau khi kết nối.

### Yêu cầu

- Sử dụng MeshJS để kết nối ví (như Eternl).
- Hiển thị số dư ADA của ví sau khi kết nối.
- Hiển thị thông báo lỗi nếu ví chưa kết nối.
- Định dạng giao diện số dư.

### Cách giải

1. **Cài đặt MeshJS**:
   - Cài đặt `@meshsdk/core` và `@meshsdk/react`.
2. **Tích hợp ví**:
   - Sử dụng hook `useWallet` để kết nối ví và lấy số dư.
   - Thêm nút "Connect Wallet" và hiển thị số dư sau khi kết nối.
3. **Xử lý lỗi**:
   - Kiểm tra trạng thái kết nối ví trước khi lấy số dư.
4. **Định dạng**:
   - Sử dụng inline CSS để hiển thị số dư.

### Đáp án

Cài đặt:

```bash
npm install @meshsdk/core @meshsdk/react
```

Sửa file `app/mint/page.tsx`:

```tsx
"use client";
import { useState, useEffect } from "react";
import { useWallet } from "@meshsdk/react";

export default function Mint() {
  const { connect, wallet, connected } = useWallet();
  const [metadata, setMetadata] = useState({
    name: "",
    description: "",
    image: "",
    location: "",
    recipient: "",
  });
  const [error, setError] = useState("");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    if (connected) {
      async function fetchBalance() {
        try {
          const balance = await wallet.getBalance();
          const ada =
            balance.find((asset) => asset.unit === "lovelace")?.quantity || "0";
          setBalance(`${parseInt(ada) / 1000000} ADA`);
        } catch (err) {
          setBalance("Lỗi khi lấy số dư");
        }
      }
      fetchBalance();
    }
  }, [connected, wallet]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!connected) {
      setError("Vui lòng kết nối ví!");
      return;
    }
    if (!metadata.name || !metadata.description) {
      setError("Vui lòng nhập tên và mô tả token");
      return;
    }
    setError("");
    console.log("Metadata:", metadata);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Mint Fungible Token</h1>
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        {!connected ? (
          <button
            onClick={() => connect("eternl")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "5px",
              marginBottom: "20px",
            }}
          >
            Connect Wallet
          </button>
        ) : (
          <p style={{ marginBottom: "20px" }}>Số dư: {balance}</p>
        )}
        <div style={{ marginBottom: "10px" }}>
          <label>Tên token:</label>
          <input
            type="text"
            name="name"
            value={metadata.name}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Mô tả:</label>
          <input
            type="text"
            name="description"
            value={metadata.description}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Link ảnh:</label>
          <input
            type="text"
            name="image"
            value={metadata.image}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Vị trí:</label>
          <input
            type="text"
            name="location"
            value={metadata.location}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Địa chỉ ví nhận (tùy chọn):</label>
          <input
            type="text"
            name="recipient"
            value={metadata.recipient}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Mint Token
        </button>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>
    </div>
  );
}
```

Chạy `npm run dev`, truy cập `http://localhost:3000/mint`, nhấn "Connect Wallet" để kết nối ví Eternl và hiển thị số dư ADA.

---

## 📝 Bài tập 3: Mint FT trên Client-side

### Đề bài

Tạo giao dịch mint fungible token (FT) trên client-side sử dụng MeshJS.

### Yêu cầu

- Sử dụng MeshJS để mint FT dựa trên thông tin metadata từ form `/mint`.
- Tạo policy ID từ địa chỉ ví người dùng bằng `ForgeScript`.
- Kiểm tra ví đã kết nối và input hợp lệ trước khi mint.
- Hiển thị Tx Hash sau khi mint thành công và liên kết đến CardanoScan.

### Cách giải

1. **Xây dựng giao dịch mint**:
   - Sử dụng `Transaction` và `ForgeScript` từ `@meshsdk/core` để tạo policy ID và mint FT.
   - Lấy metadata và địa chỉ ví nhận từ state.
2. **Ký và gửi giao dịch**:
   - Ký giao dịch bằng ví trình duyệt và submit lên blockchain.
3. **Xử lý lỗi**:
   - Kiểm tra kết nối ví và input bắt buộc, hiển thị thông báo lỗi nếu cần.
4. **Hiển thị Tx Hash**:
   - Hiển thị Tx Hash trong giao diện sau khi submit thành công.

### Đáp án

Sửa file `app/mint/page.tsx`:

```tsx
"use client";
import { useState, useEffect } from "react";
import { useWallet } from "@meshsdk/react";
import { Transaction, ForgeScript } from "@meshsdk/core";

export default function Mint() {
  const { connect, wallet, connected, walletAddress } = useWallet();
  const [metadata, setMetadata] = useState({
    name: "",
    description: "",
    image: "",
    location: "",
    recipient: "",
  });
  const [error, setError] = useState("");
  const [balance, setBalance] = useState("");
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    if (connected) {
      async function fetchBalance() {
        try {
          const balance = await wallet.getBalance();
          const ada =
            balance.find((asset) => asset.unit === "lovelace")?.quantity || "0";
          setBalance(`${parseInt(ada) / 1000000} ADA`);
        } catch (err) {
          setBalance("Lỗi khi lấy số dư");
        }
      }
      fetchBalance();
    }
  }, [connected, wallet]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!connected) {
      setError("Vui lòng kết nối ví!");
      return;
    }
    if (!metadata.name || !metadata.description) {
      setError("Vui lòng nhập tên và mô tả token");
      return;
    }

    try {
      const recipient = metadata.recipient || walletAddress;
      const tokenName = metadata.name.replace(/\s+/g, "_").toLowerCase();
      const forgeScript = ForgeScript.withOneSignature(walletAddress);
      const policyId = forgeScript.getPolicyId();

      const tx = new Transaction({ initiator: wallet });
      tx.mintAsset(forgeScript, {
        policyId,
        assetName: tokenName,
        quantity: "1",
        metadata: {
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          location: metadata.location,
        },
      });
      tx.sendAssets({ address: recipient }, [
        { unit: `${policyId}${tokenName}`, quantity: "1" },
      ]);
      tx.setMetadata(721, {
        [policyId]: { [tokenName]: { ...metadata, name: metadata.name } },
      });

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      setTxHash(txHash);
      setError("");
    } catch (err) {
      setError(`Lỗi: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Mint Fungible Token</h1>
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        {!connected ? (
          <button
            onClick={() => connect("eternl")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "5px",
              marginBottom: "20px",
            }}
          >
            Connect Wallet
          </button>
        ) : (
          <p style={{ marginBottom: "20px" }}>Số dư: {balance}</p>
        )}
        <div style={{ marginBottom: "10px" }}>
          <label>Tên token:</label>
          <input
            type="text"
            name="name"
            value={metadata.name}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Mô tả:</label>
          <input
            type="text"
            name="description"
            value={metadata.description}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Link ảnh:</label>
          <input
            type="text"
            name="image"
            value={metadata.image}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Vị trí:</label>
          <input
            type="text"
            name="location"
            value={metadata.location}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Địa chỉ ví nhận (tùy chọn):</label>
          <input
            type="text"
            name="recipient"
            value={metadata.recipient}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Mint Token
        </button>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        {txHash && (
          <p style={{ color: "green", marginTop: "10px" }}>
            Mint thành công! Tx Hash:{" "}
            <a
              href={`https://preprod.cardanoscan.io/transaction/${txHash}`}
              target="_blank"
            >
              {txHash}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
```

Chạy `npm run dev`, truy cập `http://localhost:3000/mint`, kết nối ví, nhập thông tin metadata, nhấn "Mint Token" để mint FT và kiểm tra Tx Hash trên [CardanoScan](https://preprod.cardanoscan.io/).

---

## 📝 Bài tập 4: Mint FT trên Server-side

### Đề bài

Tạo giao dịch mint fungible token (FT) trên server-side sử dụng MeshJS và Blockfrost.

### Yêu cầu

- Tạo API route `/api/cardano/mint` để xây dựng giao dịch unsigned cho minting FT.
- Gửi metadata và địa chỉ ví nhận từ client.
- Ký và submit giao dịch trên client-side.
- Hiển thị Tx Hash sau khi mint thành công.

### Cách giải

1. **Tạo API route**:
   - Tạo file `app/api/cardano/mint/route.ts` để xây dựng giao dịch unsigned bằng MeshJS và Blockfrost.
   - Lấy UTxO từ Blockfrost dựa trên địa chỉ ví người gửi.
2. **Gửi request từ client**:
   - Sửa `app/mint/page.tsx` để gửi POST request đến API route với metadata và địa chỉ ví nhận.
3. **Ký và submit**:
   - Nhận unsigned transaction từ server, ký bằng ví trên client, và submit.
4. **Hiển thị kết quả**:
   - Hiển thị Tx Hash hoặc lỗi trong giao diện.

### Đáp án

Tạo file `app/api/cardano/mint/route.ts`:

```ts
import { NextResponse } from "next/server";
import { Transaction, ForgeScript } from "@meshsdk/core";
import { BlockFrostAPI } from "@blockfrost/blockfrost-js";

export async function POST(request: Request) {
  try {
    const { sender, metadata, recipient } = await request.json();
    if (!sender || !metadata.name || !metadata.description) {
      return NextResponse.json(
        { error: "Thiếu thông tin sender hoặc metadata" },
        { status: 400 }
      );
    }

    const api = new BlockFrostAPI({ projectId: "preprodYourProjectIdHere" }); // Thay bằng project ID của bạn
    const utxos = await api.addressesUtxos(sender);
    const formattedUtxos = utxos.map((utxo) => ({
      input: { outputIndex: utxo.output_index, txHash: utxo.tx_hash },
      output: { address: utxo.address, amount: utxo.amount },
    }));

    const tokenName = metadata.name.replace(/\s+/g, "_").toLowerCase();
    const forgeScript = ForgeScript.withOneSignature(sender);
    const policyId = forgeScript.getPolicyId();

    const tx = new Transaction();
    tx.mintAsset(forgeScript, {
      policyId,
      assetName: tokenName,
      quantity: "1",
      metadata: {
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        location: metadata.location,
      },
    });
    tx.sendAssets({ address: recipient || sender }, [
      { unit: `${policyId}${tokenName}`, quantity: "1" },
    ]);
    tx.setMetadata(721, {
      [policyId]: { [tokenName]: { ...metadata, name: metadata.name } },
    });
    tx.setTxInputs(formattedUtxos);

    const unsignedTx = await tx.build();
    return NextResponse.json({ unsignedTx });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

Sửa file `app/mint/page.tsx`:

```tsx
"use client";
import { useState, useEffect } from "react";
import { useWallet } from "@meshsdk/react";

export default function Mint() {
  const { connect, wallet, connected, walletAddress } = useWallet();
  const [metadata, setMetadata] = useState({
    name: "",
    description: "",
    image: "",
    location: "",
    recipient: "",
  });
  const [error, setError] = useState("");
  const [balance, setBalance] = useState("");
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    if (connected) {
      async function fetchBalance() {
        try {
          const balance = await wallet.getBalance();
          const ada =
            balance.find((asset) => asset.unit === "lovelace")?.quantity || "0";
          setBalance(`${parseInt(ada) / 1000000} ADA`);
        } catch (err) {
          setBalance("Lỗi khi lấy số dư");
        }
      }
      fetchBalance();
    }
  }, [connected, wallet]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!connected) {
      setError("Vui lòng kết nối ví!");
      return;
    }
    if (!metadata.name || !metadata.description) {
      setError("Vui lòng nhập tên và mô tả token");
      return;
    }

    try {
      const response = await fetch("/api/cardano/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: walletAddress,
          metadata,
          recipient: metadata.recipient,
        }),
      });
      const { unsignedTx, error } = await response.json();
      if (error) throw new Error(error);

      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      setTxHash(txHash);
      setError("");
    } catch (err) {
      setError(`Lỗi: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Mint Fungible Token</h1>
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        {!connected ? (
          <button
            onClick={() => connect("eternl")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "5px",
              marginBottom: "20px",
            }}
          >
            Connect Wallet
          </button>
        ) : (
          <p style={{ marginBottom: "20px" }}>Số dư: {balance}</p>
        )}
        <div style={{ marginBottom: "10px" }}>
          <label>Tên token:</label>
          <input
            type="text"
            name="name"
            value={metadata.name}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Mô tả:</label>
          <input
            type="text"
            name="description"
            value={metadata.description}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Link ảnh:</label>
          <input
            type="text"
            name="image"
            value={metadata.image}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Vị trí:</label>
          <input
            type="text"
            name="location"
            value={metadata.location}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Địa chỉ ví nhận (tùy chọn):</label>
          <input
            type="text"
            name="recipient"
            value={metadata.recipient}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Mint Token
        </button>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        {txHash && (
          <p style={{ color: "green", marginTop: "10px" }}>
            Mint thành công! Tx Hash:{" "}
            <a
              href={`https://preprod.cardanoscan.io/transaction/${txHash}`}
              target="_blank"
            >
              {txHash}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
```

Chạy `npm run dev`, truy cập `http://localhost:3000/mint`, kết nối ví, nhập metadata, nhấn "Mint Token" để mint FT qua server-side. Kiểm tra Tx Hash trên [CardanoScan](https://preprod.cardanoscan.io/).

---

## 📝 Bài tập 5: Burning FT trên Client-side

### Đề bài

Tạo giao dịch burn fungible token (FT) trên client-side sử dụng MeshJS.

### Yêu cầu

- Tạo trang `/burn` với form nhập policy ID, tên token, và số lượng để burn.
- Sử dụng MeshJS để burn FT dựa trên thông tin nhập vào.
- Kiểm tra ví đã kết nối và input hợp lệ trước khi burn.
- Hiển thị Tx Hash sau khi burn thành công.

### Cách giải

1. **Tạo giao diện**:
   - Tạo file `app/burn/page.tsx` với form nhập policy ID, tên token, và số lượng.
   - Sử dụng `useState` để quản lý input.
2. **Xây dựng giao dịch burn**:
   - Sử dụng `Transaction` và `ForgeScript` từ `@meshsdk/core` để burn FT.
   - Đặt số lượng âm để thực hiện burn.
3. **Ký và gửi giao dịch**:
   - Ký giao dịch bằng ví trình duyệt và submit lên blockchain.
4. **Xử lý lỗi và kết quả**:
   - Kiểm tra kết nối ví và input, hiển thị Tx Hash hoặc lỗi.

### Đáp án

Tạo file `app/burn/page.tsx`:

```tsx
"use client";
import { useState, useEffect } from "react";
import { useWallet } from "@meshsdk/react";
import { Transaction, ForgeScript } from "@meshsdk/core";

export default function Burn() {
  const { connect, wallet, connected, walletAddress } = useWallet();
  const [burnData, setBurnData] = useState({
    policyId: "",
    tokenName: "",
    quantity: "",
  });
  const [error, setError] = useState("");
  const [balance, setBalance] = useState("");
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    if (connected) {
      async function fetchBalance() {
        try {
          const balance = await wallet.getBalance();
          const ada =
            balance.find((asset) => asset.unit === "lovelace")?.quantity || "0";
          setBalance(`${parseInt(ada) / 1000000} ADA`);
        } catch (err) {
          setBalance("Lỗi khi lấy số dư");
        }
      }
      fetchBalance();
    }
  }, [connected, wallet]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBurnData({ ...burnData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!connected) {
      setError("Vui lòng kết nối ví!");
      return;
    }
    if (!burnData.policyId || !burnData.tokenName || !burnData.quantity) {
      setError("Vui lòng nhập policy ID, tên token và số lượng");
      return;
    }

    try {
      const forgeScript = ForgeScript.withOneSignature(walletAddress);
      const tx = new Transaction({ initiator: wallet });
      tx.burnAsset(forgeScript, {
        policyId: burnData.policyId,
        assetName: burnData.tokenName,
        quantity: burnData.quantity,
      });

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);
      setTxHash(txHash);
      setError("");
    } catch (err) {
      setError(`Lỗi: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Burn Fungible Token</h1>
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        {!connected ? (
          <button
            onClick={() => connect("eternl")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "5px",
              marginBottom: "20px",
            }}
          >
            Connect Wallet
          </button>
        ) : (
          <p style={{ marginBottom: "20px" }}>Số dư: {balance}</p>
        )}
        <div style={{ marginBottom: "10px" }}>
          <label>Policy ID:</label>
          <input
            type="text"
            name="policyId"
            value={burnData.policyId}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Tên token:</label>
          <input
            type="text"
            name="tokenName"
            value={burnData.tokenName}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Số lượng:</label>
          <input
            type="number"
            name="quantity"
            value={burnData.quantity}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Burn Token
        </button>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        {txHash && (
          <p style={{ color: "green", marginTop: "10px" }}>
            Burn thành công! Tx Hash:{" "}
            <a
              href={`https://preprod.cardanoscan.io/transaction/${txHash}`}
              target="_blank"
            >
              {txHash}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
```

Chạy `npm run dev`, truy cập `http://localhost:3000/burn`, kết nối ví, nhập policy ID, tên token, và số lượng, nhấn "Burn Token" để burn FT và kiểm tra Tx Hash trên [CardanoScan](https://preprod.cardanoscan.io/).

---

### Ghi chú

- File Markdown trên có thể được tải về để học tập hoặc giảng dạy.
- Các bài tập được thiết kế từ cơ bản đến nâng cao, phù hợp với nội dung tài liệu về minting và burning tài sản trên Cardano.
- Bạn cần ví Cardano (như Eternl) với test ADA trên mạng Preprod và project ID từ [Blockfrost](https://blockfrost.io/) cho server-side.
- Nếu bạn cần thêm bài tập, chỉnh sửa, hoặc giải thích chi tiết hơn, hãy cho tôi biết!
