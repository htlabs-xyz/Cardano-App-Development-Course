# Video 08: Introduction eUTxO model (datums, redeemers, etc.) and Introduction Aiken and aiken syntax

## Bài tập 1: Hiểu về UTxO và giao dịch cơ bản

### Đề bài

Alice có 200 ADA trong một UTxO. Cô ấy muốn chuyển 50 ADA cho Bob và giữ lại phần còn lại. Hãy mô tả cách giao dịch này hoạt động trong mô hình UTxO.

### Yêu cầu

- Mô tả các thành phần đầu vào và đầu ra của giao dịch.
- Xác định số dư còn lại của Alice và Bob sau giao dịch.

<details>
<summary>Cách giải</summary>

1. Trong mô hình UTxO, một giao dịch sử dụng UTxO làm đầu vào và tạo ra các UTxO mới làm đầu ra.
2. Đầu vào: Alice sử dụng UTxO chứa 200 ADA.
3. Đầu ra:
   - 50 ADA được chuyển đến ví của Bob (tạo UTxO mới cho Bob).
   - Phần còn lại (200 - 50 = 150 ADA) được trả về ví của Alice (tạo UTxO mới cho Alice).
4. Giao dịch phải được ký bởi Alice để xác nhận rằng cô ấy có quyền chi tiêu UTxO này.
5. Sau khi giao dịch được xác nhận và đưa vào blockchain, trạng thái UTxO được cập nhật.

### Đáp án

- **Đầu vào**: UTxO của Alice chứa 200 ADA.
- **Đầu ra**:
  - UTxO mới cho Bob: 50 ADA.
  - UTxO mới cho Alice: 150 ADA.
- **Số dư sau giao dịch**:
  - Alice: 150 ADA.
  - Bob: 50 ADA.

</details>

---

## Bài tập 2: Hiểu về eUTxO và Smart Contract

### Đề bài

Một smart contract trên Cardano chứa một UTxO với 100 ADA và một datum lưu giá trị `"LockUntil:2025-12-31"`. Để mở khóa UTxO này, cần cung cấp một redeemer. Hãy giải thích vai trò của datum và redeemer trong giao dịch này.

### Yêu cầu

- Giải thích datum và redeemer là gì.
- Mô tả cách giao dịch sử dụng chúng để mở khóa UTxO.

<details>
<summary>Cách giải</summary>

1. **Datum**: Là dữ liệu được đính kèm vào UTxO trong smart contract, ở đây là `"LockUntil:2025-12-31"`, biểu thị điều kiện khóa (ví dụ: thời gian khóa đến 31/12/2025).
2. **Redeemer**: Là dữ liệu được cung cấp trong giao dịch để tương tác với script, ví dụ: thời gian hiện tại hoặc chữ ký xác nhận.
3. Trong giao dịch:
   - Đầu vào: UTxO chứa 100 ADA và datum `"LockUntil:2025-12-31"`.
   - Redeemer: Người thực hiện giao dịch cung cấp giá trị (ví dụ: thời gian hiện tại) để so sánh với datum.
   - Validator script: Kiểm tra xem redeemer (thời gian hiện tại) có thỏa mãn điều kiện trong datum (sau 31/12/2025) không. Nếu đúng, giao dịch hợp lệ và UTxO được chi tiêu.
4. Kết quả: Nếu validator trả về `true`, 100 ADA được chuyển đến ví của người thực hiện giao dịch.

### Đáp án

- **Datum**: Lưu trữ thông tin điều kiện khóa, ở đây là `"LockUntil:2025-12-31"`.
- **Redeemer**: Cung cấp dữ liệu (ví dụ: thời gian hiện tại) để validator kiểm tra.
- **Quy trình**:
  - Giao dịch lấy UTxO với 100 ADA làm đầu vào.
  - Redeemer được so sánh với datum qua validator script.
  - Nếu thời gian hiện tại > 31/12/2025, validator trả về `true`, UTxO được mở khóa và 100 ADA được chuyển.

</details>

---

## Bài tập 3: Viết hợp đồng Aiken cơ bản

### Đề bài

Viết một hợp đồng Aiken đơn giản cho phép khóa 50 ADA vào một smart contract với datum là `"Hello"`. Để mở khóa, redeemer phải khớp với datum.

### Yêu cầu

- Viết mã Aiken cho validator của hợp đồng.
- Giải thích cách validator kiểm tra điều kiện.

<details>
<summary>Cách giải</summary>

1. Trong Aiken, một validator được định nghĩa để kiểm tra logic giao dịch.
2. Validator nhận 3 tham số:
   - Datum: Chuỗi `"Hello"`.
   - Redeemer: Chuỗi do người dùng cung cấp.
   - Script context: Thông tin giao dịch (ở đây không sử dụng).
3. Logic: So sánh redeemer với datum, trả về `true` nếu chúng khớp.
4. Mã Aiken được viết trong file trong thư mục `validators`.

### Đáp án

```aiken
validator {
  fn spend(datum: String, redeemer: String, _ctx: ScriptContext) -> Bool {
    datum == redeemer
  }
}
```

- **Giải thích**:
  - Datum được lưu là `"Hello"`.
  - Redeemer là chuỗi do người dùng cung cấp khi giao dịch.
  - Validator kiểm tra `datum == redeemer`. Nếu redeemer là `"Hello"`, trả về `true`, cho phép chi tiêu UTxO chứa 50 ADA.
  - Lệnh `aiken build` sẽ biên dịch mã này thành file `plutus.json` để sử dụng trong giao dịch.

</details>

---

## Bài tập 4: Giao dịch với nhiều UTxO

### Đề bài

Bob có hai UTxO: một chứa 60 ADA và một chứa 20 ADA. Anh ta muốn chuyển 70 ADA cho Charlie. Hãy mô tả cách giao dịch này được thực hiện trong mô hình eUTxO.

### Yêu cầu

- Mô tả các UTxO đầu vào và đầu ra.
- Tính toán số dư còn lại của Bob sau giao dịch.

<details>
<summary>Cách giải</summary>

1. Để chuyển 70 ADA, Bob phải sử dụng cả hai UTxO vì không UTxO nào đủ 70 ADA.
2. Đầu vào:
   - UTxO 1: 60 ADA.
   - UTxO 2: 20 ADA.
   - Tổng: 60 + 20 = 80 ADA.
3. Đầu ra:
   - UTxO mới cho Charlie: 70 ADA.
   - UTxO mới trả lại cho Bob: 80 - 70 = 10 ADA.
4. Giao dịch được ký bởi Bob và đưa vào blockchain.

### Đáp án

- **Đầu vào**:
  - UTxO 1: 60 ADA.
  - UTxO 2: 20 ADA.
- **Đầu ra**:
  - UTxO cho Charlie: 70 ADA.
  - UTxO trả lại cho Bob: 10 ADA.
- **Số dư còn lại của Bob**: 10 ADA.

</details>

---

## Bài tập 5: Hiểu về địa chỉ và script trong Cardano

### Đề bài

Một địa chỉ smart contract trên Cardano chứa một UTxO với 30 ADA và datum `"Vote:Yes"`. Một giao dịch được gửi để chi tiêu UTxO này với redeemer `"Vote:Yes"`. Hãy giải thích cách địa chỉ script và validator hoạt động trong trường hợp này.

### Yêu cầu

- Mô tả cấu trúc địa chỉ script.
- Giải thích cách validator sử dụng datum và redeemer để xác thực giao dịch.

<details>
<summary>Cách giải</summary>

1. **Địa chỉ script**:
   - Gồm 3 phần: header (loại địa chỉ và mạng), payment (liên kết với script hash), delegation (tùy chọn, thường không có trong script).
   - Địa chỉ này đại diện cho smart contract, không có private key.
2. **Validator**:
   - Nhận datum (`"Vote:Yes"`), redeemer (`"Vote:Yes"`), và script context.
   - Kiểm tra xem redeemer có khớp với datum không.
   - Nếu khớp, validator trả về `true`, cho phép chi tiêu UTxO.
3. **Giao dịch**:
   - Đầu vào: UTxO chứa 30 ADA và datum `"Vote:Yes"`.
   - Redeemer: `"Vote:Yes"`.
   - Nếu validator trả về `true`, 30 ADA được chuyển đến địa chỉ người gửi giao dịch.

### Đáp án

- **Cấu trúc địa chỉ script**:
  - Header: Xác định mạng (mainnet/testnet) và loại địa chỉ (script).
  - Payment: Hash của script (thay vì public key như ví người dùng).
  - Delegation: Thường trống.
- **Quy trình xác thực**:
  - Validator so sánh datum (`"Vote:Yes"`) với redeemer (`"Vote:Yes"`).
  - Nếu chúng khớp, validator trả về `true`, giao dịch hợp lệ.
  - UTxO chứa 30 ADA được chi tiêu và chuyển đến ví người gửi giao dịch.

</details>

---

### Hướng dẫn thêm

- Để thực hành, bạn có thể cài đặt Aiken qua lệnh `npm install -g aiken` hoặc `bun install -g aiken`.
- Sử dụng lệnh `aiken new` để tạo dự án mới và `aiken build` để biên dịch hợp đồng.
- Tham khảo tài liệu Aiken tại [https://aiken-lang.org](https://aiken-lang.org) để biết thêm chi tiết.
