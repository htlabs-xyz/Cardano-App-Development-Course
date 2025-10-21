# 🧩 Video 12: Writing Test Cases and Offchain Code for Smart Contracts

## 🧠 Giới thiệu
Phần này giúp bạn hiểu cách **kiểm thử validator logic của Aiken** và **xây dựng offchain code** trong Next.js để tương tác với smart contract.  
Bạn sẽ thực hành viết **test case**, **mock giao dịch**, và **triển khai API backend** để mint/buy/withdraw NFT trên marketplace.

---

## 📝 Bài tập 1: Viết test cơ bản cho chức năng Buy

### Đề bài
Tạo test kiểm tra điều kiện “Buy” của validator để xác minh người mua phải trả đủ ADA.

### Yêu cầu
- Tạo file `tests/marketplace_buy_test.ak`.  
- Viết test cho trường hợp:
  - Người mua trả đúng giá → ✅ PASS.  
  - Người mua trả thiếu giá → ❌ FAIL.  
- Sử dụng module `aiken/test` để chạy test.

### Cách giải
1. Tạo thư mục `tests/` trong dự án Aiken.  
2. Khai báo module test:
   ```aiken
   use aiken/test

   test buy_should_pass_when_paid_enough() {
     let datum = MarketplaceDatum { seller: "addr_seller", price: 10000000, policy_id: "123", asset_name: "token" }
     let tx = build_tx(paid_to_seller: 11000000)
     expect is_buy_valid(tx, datum)
   }
   ```

3. Viết thêm test fail khi trả thiếu:
   ```aiken
   test buy_should_fail_when_paid_less() {
     let datum = MarketplaceDatum { seller: "addr_seller", price: 10000000, policy_id: "123", asset_name: "token" }
     let tx = build_tx(paid_to_seller: 5000000)
     expect !is_buy_valid(tx, datum)
   }
   ```

### Đáp án
Chạy lệnh:
```bash
aiken test
```
Kết quả hiển thị:  
✅ `buy_should_pass_when_paid_enough` passed.  
❌ `buy_should_fail_when_paid_less` failed (đúng như mong đợi).

---

## 📝 Bài tập 2: Viết test cho chức năng Withdraw/Update

### Đề bài
Kiểm tra xem chỉ **seller** mới có thể thực hiện `WithdrawOrUpdate`.

### Yêu cầu
- Test pass khi `seller` nằm trong `tx.signatories`.  
- Test fail khi người ký khác không phải `seller`.

### Cách giải
```aiken
test withdraw_should_pass_for_seller() {
  let datum = MarketplaceDatum { seller: "addr_seller", price: 10000000, policy_id: "123", asset_name: "token" }
  let tx = build_tx(signatories: ["addr_seller"])
  expect is_withdraw_valid(tx, datum)
}

test withdraw_should_fail_for_other_user() {
  let datum = MarketplaceDatum { seller: "addr_seller", price: 10000000, policy_id: "123", asset_name: "token" }
  let tx = build_tx(signatories: ["addr_buyer"])
  expect !is_withdraw_valid(tx, datum)
}
```

### Đáp án
Khi chạy `aiken test`, test thứ hai sẽ fail đúng logic, xác nhận validator chỉ cho phép seller rút/cập nhật NFT.

---

## 📝 Bài tập 3: Test tổng hợp validator

### Đề bài
Viết test gọi trực tiếp validator `marketplace` với cả hai loại redeemer (`Buy` và `WithdrawOrUpdate`).

### Yêu cầu
- Test 1: Redeemer = `Buy`, người mua trả đủ ADA → ✅ PASS.  
- Test 2: Redeemer = `WithdrawOrUpdate`, seller ký giao dịch → ✅ PASS.  
- Test 3: Redeemer = `Buy`, người mua trả thiếu ADA → ❌ FAIL.

### Cách giải
```aiken
test validator_should_validate_buy() {
  let datum = MarketplaceDatum { seller: "addr_seller", price: 10000000, policy_id: "123", asset_name: "token" }
  let tx = build_tx(paid_to_seller: 11000000)
  let ctx = ScriptContext { tx }
  expect marketplace(datum, Buy, ctx)
}

test validator_should_validate_withdraw() {
  let datum = MarketplaceDatum { seller: "addr_seller", price: 10000000, policy_id: "123", asset_name: "token" }
  let tx = build_tx(signatories: ["addr_seller"])
  let ctx = ScriptContext { tx }
  expect marketplace(datum, WithdrawOrUpdate, ctx)
}
```

### Đáp án
Cả hai test đầu pass, test thứ ba fail → chứng minh validator hoạt động đúng theo logic mong đợi.

---

## 📝 Bài tập 4: Tạo API Offchain cho giao dịch Buy

### Đề bài
Tạo endpoint `/api/marketplace/buy` trong Next.js để build giao dịch mua NFT thông qua MeshJS.

### Yêu cầu
- Nhận dữ liệu từ client: `buyerAddress`, `sellerAddress`, `price`, `policyId`, `assetName`.  
- Sử dụng `Transaction` của MeshJS để tạo giao dịch.  
- Trả về `unsignedTx` cho client ký.

### Cách giải
Tạo file `app/api/marketplace/buy/route.ts`:
```ts
import { NextResponse } from "next/server";
import { Transaction } from "@meshsdk/core";

export async function POST(request: Request) {
  const { buyerAddress, sellerAddress, price, policyId, assetName } = await request.json();
  try {
    const tx = new Transaction();
    tx.sendLovelace({ address: sellerAddress }, price);
    tx.sendAssets({ address: buyerAddress }, [{ unit: `${policyId}${assetName}`, quantity: "1" }]);
    const unsignedTx = await tx.build();
    return NextResponse.json({ unsignedTx });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
```

### Đáp án
Client gửi `POST /api/marketplace/buy`, server trả về `unsignedTx`, sau đó client ký và submit bằng `wallet.submitTx()`.

---

## 📝 Bài tập 5: Kết nối test onchain và offchain

### Đề bài
Tạo test case tích hợp để kiểm tra validator hoạt động đồng bộ giữa **Aiken logic** và **Next.js offchain API**.

### Yêu cầu
- Gọi API `/api/marketplace/buy`.  
- Dùng script hash của validator để attach vào giao dịch.  
- Gửi giao dịch testnet và kiểm tra `TxHash` trên [Cardanoscan](https://preprod.cardanoscan.io).

### Cách giải
1. Lấy script hash sau khi compile:
   ```bash
   aiken build
   ```
2. Trong API, thêm script hash:
   ```ts
   tx.attachSpendingValidator({ type: "PlutusV2", script: validatorCompiled });
   ```
3. Client ký và gửi giao dịch, kiểm tra `txHash` trả về.

### Đáp án
Nếu validator và offchain code hoạt động chính xác, `TxHash` xuất hiện trên Cardanoscan → xác minh thành công toàn bộ quy trình.

---

✅ **Tổng kết**
Qua 5 bài tập này, bạn sẽ hiểu cách:
- Viết test case Aiken cho từng hành vi logic.  
- Mô phỏng tình huống giao dịch hợp lệ / không hợp lệ.  
- Xây dựng API backend kết nối MeshJS và Aiken.  
- Kiểm tra tích hợp end-to-end trên testnet.
