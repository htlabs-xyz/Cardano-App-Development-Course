# Video 12: Test & Offchain cho Marketplace Aiken

## 📝 Bài tập 1 – Buy Successful

### 🧭 Đề bài

Viết test case để xác nhận rằng giao dịch **Buy** thành công khi người mua trả đủ ADA và chỉ có một script input.

### 🎯 Yêu cầu

- Chỉ 1 script input từ hợp đồng.
- Tổng ADA gửi cho seller >= price + minAda.
- Redeemer: `Buy`.

### 💡 Cách giải (Gợi ý)

- Dùng `mock_datum()` để tạo Datum.
- Dùng `get_buy_tx(true, true)` để mô phỏng giao dịch hợp lệ.

### ✅ Đáp án

```aiken
test buy_successful {
  let datum = mock_datum()
  let tx = get_buy_tx(true, true)
  marketplace(datum, Buy, tx) == True
}
```

---

## 📝 Bài tập 2 – Buy Fails with Multiple Inputs

### 🧭 Đề bài

Kiểm tra rằng giao dịch Buy bị từ chối nếu có nhiều script input (double-spend).

### 🎯 Yêu cầu

- Nhiều script input → vi phạm điều kiện.
- Redeemer: `Buy`.

### 💡 Cách giải

- Dùng `get_buy_tx(false, true)` để mô phỏng nhiều input.

### ✅ Đáp án

```aiken
test buy_fails_multiple_inputs {
  let datum = mock_datum()
  let tx = get_buy_tx(false, true)
  !marketplace(datum, Buy, tx)
}
```

---

## 📝 Bài tập 3 – Buy Fails Underpriced

### 🧭 Đề bài

Test giao dịch Buy khi người mua không trả đủ ADA.

### 🎯 Yêu cầu

- ADA < price + minAda.
- Redeemer: `Buy`.

### 💡 Cách giải

- Dùng `get_buy_tx(true, false)`.

### ✅ Đáp án

```aiken
test buy_fails_underpriced {
  let datum = mock_datum()
  let tx = get_buy_tx(true, false)
  !marketplace(datum, Buy, tx)
}
```

---

## 📝 Bài tập 4 – Withdraw Successful by Seller

### 🧭 Đề bài

Kiểm tra khi seller thực hiện Withdraw hoặc Update thành công.

### 🎯 Yêu cầu

- Seller có trong `tx.signatories`.
- Redeemer: `WithdrawOrUpdate`.

### 💡 Cách giải

- Dùng `get_withdraw_tx(true)`.

### ✅ Đáp án

```aiken
test withdraw_success_by_seller {
  let datum = mock_datum()
  let tx = get_withdraw_tx(true)
  marketplace(datum, WithdrawOrUpdate, tx) == True
}
```

---

## 📝 Bài tập 5 – Withdraw Fails – Wrong Signer

### 🧭 Đề bài

Kiểm tra Withdraw thất bại nếu người ký không phải seller.

### 🎯 Yêu cầu

- Không có seller trong chữ ký.
- Redeemer: `WithdrawOrUpdate`.

### 💡 Cách giải

- Dùng `get_withdraw_tx(false)`.

### ✅ Đáp án

```aiken
test withdraw_fails_wrong_signer {
  let datum = mock_datum()
  let tx = get_withdraw_tx(false)
  !marketplace(datum, WithdrawOrUpdate, tx)
}
```
