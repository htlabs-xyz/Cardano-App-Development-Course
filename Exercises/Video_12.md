# 📘 Video 12: Writing Test Cases and Offchain Code for Smart Contracts

## 📝 Bài tập 1: Tạo file test cho smart contract Marketplace

### Đề bài
Khởi tạo file test để kiểm thử logic của smart contract Marketplace viết bằng Aiken.

### Yêu cầu
- Tạo file `marketplace.test` trong thư mục `tests/`.  
- Viết test đầu tiên kiểm tra khi người mua gửi đúng số ADA, giao dịch hợp lệ.  
- Dùng lệnh `aiken test` để chạy.

### Cách giải
Dùng lệnh tạo file test trong dự án Aiken và viết test cơ bản với `expect true`.

### Đáp án
```rust
test buy_successful {
  expect true == buy(100, 100)
}
```

---

## 📝 Bài tập 2: Viết test case cho hàm `buy` khi người mua gửi sai số tiền

### Đề bài
Kiểm tra trường hợp giao dịch không hợp lệ khi người mua gửi sai số tiền.

### Yêu cầu
- Thêm test mới trong `marketplace.test`.  
- Kiểm tra giá trị ADA nhỏ hơn giá NFT.  
- Kết quả mong đợi: test phải **fail**.

### Cách giải
So sánh giá trị `ada_sent` khác `nft_price` trong test.

### Đáp án
```rust
test buy_fail_incorrect_amount {
  expect false == buy(80, 100)
}
```

---

## 📝 Bài tập 3: Cấu hình Mesh SDK và Blockfrost Provider

### Đề bài
Cài đặt và cấu hình môi trường offchain với Mesh SDK.

### Yêu cầu
- Cài Mesh SDK bằng npm.  
- Tạo file `.env` lưu Project ID của Blockfrost.  
- Cấu hình provider trong code.

### Cách giải
Cài Mesh và tạo provider với Project ID từ Blockfrost.

### Đáp án
```bash
npm install @meshsdk/core @meshsdk/common
```

```ts
import { BlockfrostProvider } from "@meshsdk/core";

const provider = new BlockfrostProvider("mainnet", process.env.BLOCKFROST_ID);
```

---

## 📝 Bài tập 4: Viết hàm `sale()` trong offchain code

### Đề bài
Tạo hàm TypeScript `sale()` để đăng bán NFT trên marketplace.

### Yêu cầu
- Truyền vào tham số: `asset`, `price`, `sellerAddress`.  
- Dùng Mesh SDK để tạo giao dịch có metadata và output kèm datum.  
- Trả về hash giao dịch sau khi submit.

### Cách giải
Dùng Mesh SDK với `Transaction().sendAssets().attachMetadata()` và `submit()`.

### Đáp án
```ts
import { Transaction } from "@meshsdk/core";

async function sale(asset, price, sellerAddress) {
  const tx = new Transaction({ initiator: sellerAddress })
    .sendAssets({ address: MARKETPLACE_ADDR, assets: { [asset]: 1 } })
    .attachMetadata(721, { price })
    .build();

  const txHash = await tx.submit();
  return txHash;
}
```

---

## 📝 Bài tập 5: Kiểm thử giao dịch offchain bằng Vitest

### Đề bài
Viết test kiểm thử giao dịch `sale()` bằng Vitest.

### Yêu cầu
- Cài Vitest và viết test đơn giản gọi `sale()`.  
- In ra `txHash` nếu giao dịch thành công.  
- Sử dụng mô phỏng (mock) provider khi test.

### Cách giải
Sử dụng `vi.fn()` để tạo mock provider và xác minh hàm được gọi.

### Đáp án
```ts
import { describe, it, expect, vi } from "vitest";
import { sale } from "./marketplace";

describe("Marketplace sale", () => {
  it("should return tx hash", async () => {
    const mockProvider = vi.fn().mockResolvedValue("mockTxHash123");
    const result = await sale("asset1", 100, "addr_test1...");
    expect(result).toBeDefined();
  });
});
```

---
