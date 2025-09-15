# 📘 Video 05: Query data onchain

## 📝 Bài tập 1: Hiểu về Blockfrost và Lý do sử dụng

### Đề bài

Giải thích tại sao nên sử dụng Blockfrost API để truy vấn dữ liệu on-chain thay vì chạy node Cardano trực tiếp.

### Yêu cầu

- Mô tả cách Blockfrost API hoạt động.
- Liệt kê ít nhất 2 ưu điểm và 2 nhược điểm khi sử dụng Blockfrost.
- Đưa ra ví dụ về một trường hợp sử dụng Blockfrost trong dự án.

### Cách giải

1. **Cách Blockfrost hoạt động**:
   - Blockfrost cung cấp các API endpoint để truy vấn dữ liệu từ blockchain Cardano (như tài khoản, giao dịch, tài sản) thông qua HTTP requests, sử dụng project ID để xác thực.
2. **Ưu điểm và nhược điểm**:
   - **Ưu điểm**: Dễ tích hợp, không cần chạy node Cardano; cung cấp gói miễn phí (15 triệu request/tháng).
   - **Nhược điểm**: Có chi phí nếu vượt giới hạn request; phụ thuộc vào dịch vụ bên thứ ba.
3. **Ví dụ sử dụng**:
   - Theo dõi số dư ví hoặc lịch sử giao dịch trong ứng dụng DApp.

### Đáp án

- **Cách hoạt động**: Blockfrost cung cấp API HTTP để truy vấn dữ liệu blockchain Cardano, sử dụng project ID trong header để xác thực.
- **Ưu điểm**: Dễ tích hợp vào dự án; gói miễn phí hỗ trợ 15 triệu request/tháng.
- **Nhược điểm**: Chi phí khi vượt giới hạn request; phụ thuộc vào dịch vụ bên thứ ba.
- **Ví dụ**: Xây dựng DApp hiển thị lịch sử giao dịch của ví người dùng.

---

## 📝 Bài tập 2: Cài đặt Blockfrost trong dự án Next.js

### Đề bài

Tích hợp Blockfrost SDK vào dự án Next.js để hiển thị thông tin mạng Cardano.

### Yêu cầu

- Cài đặt Blockfrost SDK.
- Sử dụng API `/network` để lấy thông tin mạng (như epoch hiện tại).
- Hiển thị thông tin trên trang chủ.
- Đảm bảo gọi API từ server-side để bảo mật project ID.

### Cách giải

1. **Cài đặt Blockfrost SDK**:
   - Chạy lệnh: `npm install @blockfrost/blockfrost-js`.
   - Tạo project ID trên [Blockfrost dashboard](https://blockfrost.io/) (mạng Preprod).
2. **Tạo API route**:
   - Tạo file `app/api/network/route.ts` để gọi API `/network` từ server-side.
3. **Hiển thị dữ liệu**:
   - Fetch dữ liệu từ API route trong `app/page.tsx` và hiển thị.
4. **Kiểm tra**:
   - Chạy ứng dụng và kiểm tra thông tin mạng.

### Đáp án

Cài đặt:

```bash
npm install @blockfrost/blockfrost-js
```

Tạo file `app/api/network/route.ts`:

```ts
import { NextResponse } from "next/server";
import { BlockFrostAPI } from "@blockfrost/blockfrost-js";

export async function GET() {
  try {
    const api = new BlockFrostAPI({
      projectId: "preprodYourProjectIdHere", // Thay bằng project ID của bạn
    });
    const networkInfo = await api.network();
    return NextResponse.json(networkInfo);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

Sửa file `app/page.tsx`:

```tsx
"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [networkInfo, setNetworkInfo] = useState(null);

  useEffect(() => {
    async function fetchNetworkInfo() {
      try {
        const response = await fetch("/api/network");
        const data = await response.json();
        setNetworkInfo(data);
      } catch (error) {
        setNetworkInfo({ error: "Lỗi khi lấy thông tin mạng" });
      }
    }
    fetchNetworkInfo();
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Cardano Network Info</h1>
      {networkInfo && !networkInfo.error ? (
        <div>
          <p>Epoch: {networkInfo.epoch}</p>
          <p>Slot: {networkInfo.slot}</p>
        </div>
      ) : (
        <p>{networkInfo?.error || "Đang tải..."}</p>
      )}
    </div>
  );
}
```

Chạy `npm run dev`, truy cập `http://localhost:3000` để thấy thông tin mạng (epoch, slot). Đăng ký project ID tại [Blockfrost](https://blockfrost.io/).

---

## 📝 Bài tập 3: Truy vấn lịch sử giao dịch của ví

### Đề bài

Tạo một API route để truy vấn lịch sử giao dịch của một địa chỉ ví Cardano bằng Blockfrost.

### Yêu cầu

- Tạo API route `/api/address/[address]/transactions` để lấy danh sách giao dịch.
- Hiển thị danh sách giao dịch (Tx Hash) trên trang `/transactions/[address]`.
- Sử dụng dynamic routing để lấy địa chỉ ví từ URL.
- Định dạng danh sách giao diện đẹp mắt.

### Cách giải

1. **Tạo API route**:
   - Tạo file `app/api/address/[address]/transactions/route.ts` để gọi API `/addresses/{address}/transactions` của Blockfrost.
2. **Tạo trang dynamic**:
   - Tạo file `app/transactions/[address]/page.tsx` để fetch và hiển thị danh sách giao dịch.
3. **Định dạng giao diện**:
   - Sử dụng CSS inline hoặc file CSS để định dạng danh sách.

### Đáp án

Tạo file `app/api/address/[address]/transactions/route.ts`:

```ts
import { NextResponse } from "next/server";
import { BlockFrostAPI } from "@blockfrost/blockfrost-js";

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  try {
    const api = new BlockFrostAPI({
      projectId: "preprodYourProjectIdHere", // Thay bằng project ID của bạn
    });
    const transactions = await api.addressesTransactions(params.address);
    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

Tạo file `app/transactions/[address]/page.tsx`:

```tsx
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function Transactions() {
  const { address } = useParams();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch(`/api/address/${address}/transactions`);
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        setTransactions([{ error: "Lỗi khi lấy giao dịch" }]);
      }
    }
    fetchTransactions();
  }, [address]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Lịch sử giao dịch của ví: {address}</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {transactions.length > 0 && !transactions[0].error ? (
          transactions.map((tx: any) => (
            <li
              key={tx.tx_hash}
              style={{
                margin: "10px 0",
                padding: "10px",
                border: "1px solid #ccc",
              }}
            >
              Tx Hash: {tx.tx_hash}
            </li>
          ))
        ) : (
          <p>{transactions[0]?.error || "Không có giao dịch"}</p>
        )}
      </ul>
    </div>
  );
}
```

Chạy `npm run dev`, truy cập `http://localhost:3000/transactions/addr_test1...` (thay bằng địa chỉ ví Preprod) để thấy danh sách Tx Hash.

---

## 📝 Bài tập 4: Tối ưu truy vấn với Database Cache

### Đề bài

Tối ưu truy vấn lịch sử giao dịch bằng cách lưu dữ liệu vào database (giả lập bằng biến) để giảm số lượng request đến Blockfrost.

### Yêu cầu

- Tạo API route `/api/address/[address]/transactions` với cơ chế cache giả lập.
- Chỉ gọi Blockfrost nếu cache không có dữ liệu hoặc quá 1 phút.
- Hiển thị danh sách giao dịch trên trang `/transactions/[address]`.
- Hiển thị thời gian cache được cập nhật.

### Cách giải

1. **Tạo cache giả lập**:
   - Sử dụng biến `Map` trong API route để lưu dữ liệu và thời gian cập nhật.
2. **Kiểm tra cache**:
   - Nếu cache tồn tại và chưa quá 1 phút, trả về dữ liệu cache. Ngược lại, gọi Blockfrost.
3. **Hiển thị giao diện**:
   - Hiển thị danh sách giao dịch và thời gian cache trong `app/transactions/[address]/page.tsx`.
4. **Kiểm tra**:
   - Kiểm tra console log để xác nhận cache hoạt động.

### Đáp án

Tạo file `app/api/address/[address]/transactions/route.ts`:

```ts
import { NextResponse } from "next/server";
import { BlockFrostAPI } from "@blockfrost/blockfrost-js";

// Giả lập cache
const cache = new Map<string, { data: any; timestamp: number }>();

export async function GET(
  request: Request,
  { params }: { params: { address: string } }
) {
  const cacheKey = params.address;
  const cacheData = cache.get(cacheKey);

  // Kiểm tra cache (hết hạn sau 1 phút)
  if (cacheData && Date.now() - cacheData.timestamp < 60 * 1000) {
    console.log("Returning cached data for:", cacheKey);
    return NextResponse.json({
      ...cacheData.data,
      cachedAt: new Date(cacheData.timestamp).toISOString(),
    });
  }

  try {
    const api = new BlockFrostAPI({
      projectId: "preprodYourProjectIdHere", // Thay bằng project ID của bạn
    });
    const transactions = await api.addressesTransactions(params.address);
    cache.set(cacheKey, { data: transactions, timestamp: Date.now() });
    console.log("Fetched new data for:", cacheKey);
    return NextResponse.json({
      transactions,
      cachedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

Sửa file `app/transactions/[address]/page.tsx`:

```tsx
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function Transactions() {
  const { address } = useParams();
  const [data, setData] = useState({ transactions: [], cachedAt: "" });

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch(`/api/address/${address}/transactions`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        setData({
          transactions: [{ error: "Lỗi khi lấy giao dịch" }],
          cachedAt: "",
        });
      }
    }
    fetchTransactions();
  }, [address]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Lịch sử giao dịch của ví: {address}</h1>
      <p>Cached at: {data.cachedAt || "N/A"}</p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {data.transactions.length > 0 && !data.transactions[0].error ? (
          data.transactions.map((tx: any) => (
            <li
              key={tx.tx_hash}
              style={{
                margin: "10px 0",
                padding: "10px",
                border: "1px solid #ccc",
              }}
            >
              Tx Hash: {tx.tx_hash}
            </li>
          ))
        ) : (
          <p>{data.transactions[0]?.error || "Không có giao dịch"}</p>
        )}
      </ul>
    </div>
  );
}
```

Chạy `npm run dev`, truy cập `http://localhost:3000/transactions/addr_test1...`. Console log sẽ hiển thị "Returning cached data" nếu truy cập lại trong vòng 1 phút.

---

## 📝 Bài tập 5: Truy vấn chi tiết giao dịch

### Đề bài

Tạo trang hiển thị chi tiết giao dịch dựa trên Tx Hash bằng Blockfrost API.

### Yêu cầu

- Tạo API route `/api/transaction/[txHash]` để lấy chi tiết giao dịch.
- Tạo trang `/transaction/[txHash]` để hiển thị thông tin giao dịch (block, fee, inputs, outputs).
- Xử lý lỗi nếu Tx Hash không hợp lệ.
- Định dạng giao diện đẹp mắt.

### Cách giải

1. **Tạo API route**:
   - Tạo file `app/api/transaction/[txHash]/route.ts` để gọi API `/txs/{txHash}` của Blockfrost.
2. **Tạo trang dynamic**:
   - Tạo file `app/transaction/[txHash]/page.tsx` để fetch và hiển thị chi tiết giao dịch.
3. **Xử lý lỗi**:
   - Trả về thông báo lỗi nếu giao dịch không tồn tại.
4. **Định dạng**:
   - Sử dụng CSS inline để hiển thị thông tin rõ ràng.

### Đáp án

Tạo file `app/api/transaction/[txHash]/route.ts`:

```ts
import { NextResponse } from "next/server";
import { BlockFrostAPI } from "@blockfrost/blockfrost-js";

export async function GET(
  request: Request,
  { params }: { params: { txHash: string } }
) {
  try {
    const api = new BlockFrostAPI({
      projectId: "preprodYourProjectIdHere", // Thay bằng project ID của bạn
    });
    const transaction = await api.txs(params.txHash);
    return NextResponse.json(transaction);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

Tạo file `app/transaction/[txHash]/page.tsx`:

```tsx
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function TransactionDetail() {
  const { txHash } = useParams();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    async function fetchTransaction() {
      try {
        const response = await fetch(`/api/transaction/${txHash}`);
        const data = await response.json();
        setTransaction(data);
      } catch (error) {
        setTransaction({ error: "Lỗi khi lấy chi tiết giao dịch" });
      }
    }
    fetchTransaction();
  }, [txHash]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Chi tiết giao dịch: {txHash}</h1>
      {transaction && !transaction.error ? (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "5px",
          }}
        >
          <p>Block: {transaction.block}</p>
          <p>Fee: {transaction.fees / 1000000} ADA</p>
          <p>Inputs: {transaction.input_count}</p>
          <p>Outputs: {transaction.output_count}</p>
        </div>
      ) : (
        <p style={{ color: "red" }}>{transaction?.error || "Đang tải..."}</p>
      )}
    </div>
  );
}
```

Chạy `npm run dev`, truy cập `http://localhost:3000/transaction/<tx_hash>` (thay bằng Tx Hash hợp lệ từ Preprod) để thấy chi tiết giao dịch.

---

### Ghi chú

- File Markdown trên có thể được tải về để học tập hoặc giảng dạy.
- Các bài tập được thiết kế từ cơ bản đến nâng cao, phù hợp với nội dung tài liệu về truy vấn dữ liệu on-chain với Blockfrost.
- Bạn cần đăng ký project ID tại [Blockfrost](https://blockfrost.io/) và sử dụng mạng Preprod để thử nghiệm.
- Nếu bạn cần thêm bài tập, chỉnh sửa, hoặc giải thích chi tiết hơn, hãy cho tôi biết!
