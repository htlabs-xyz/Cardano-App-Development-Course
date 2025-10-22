# Video 08:  Introduction eUTxO model (datums, redeemers, etc.)

---

**1. Ôn tập về mô hình EUTxO (Extended Unspent Transaction Output)**

- **Blocks & Transactions**:
    - Giải thích cơ bản về cách blockchain Cardano tổ chức dữ liệu qua các khối và giao dịch.
    - Vai trò của giao dịch trong việc chuyển giá trị và thực thi logic smart contract.
- **Outputs và Inputs**:
    - Định nghĩa Output (đầu ra chưa sử dụng - UTXO) và Input (tham chiếu đến UTXO để tiêu dùng).
    - Sự khác biệt giữa UTXO truyền thống (Bitcoin) và EUTxO (Cardano).
- **Addresses**:
    - Các loại địa chỉ (address) trên Cardano: địa chỉ ví thông thường và địa chỉ script.
    - Mối liên hệ giữa địa chỉ và smart contract.
- **Scripts, Datums và Redeemers**:
    - Scripts: Logic điều khiển việc tiêu dùng UTXO (validator script).
    - Datums: Dữ liệu gắn liền với UTXO để lưu trữ trạng thái hợp đồng.
    - Redeemers: Dữ liệu cung cấp bởi người dùng để đáp ứng điều kiện của script.

---

**2. Aiken là gì?**

- **Giới thiệu tổng quan và lịch sử**:
    - So sánh Aiken với các công cụ trước đó như Plutus (dựa trên Haskell): sự khác biệt về cách tiếp cận và mục tiêu.
    - Lý do ra đời của Aiken: tối ưu hóa quá trình phát triển smart contract trên Cardano.
- **Điểm mạnh của Aiken**:
    - Hiệu năng: Tối ưu hóa việc biên dịch và thực thi trên blockchain.
    - Dễ sử dụng: Ngôn ngữ thân thiện hơn so với Haskell, cú pháp đơn giản, dễ học.
    - Tích hợp tốt với hệ sinh thái Cardano: Công cụ dòng lệnh (CLI) và khả năng kiểm thử.
- **Trình biên dịch của Aiken**:
    - Quy trình biên dịch: Từ mã Aiken sang UPLC (Untyped Plutus Core) – ngôn ngữ cấp thấp mà Cardano sử dụng.
    - CBOR Hex:
        - Giải thích đây là định dạng mã hóa dữ liệu (Compact Binary Object Representation) được sử dụng để đưa smart contract lên blockchain.
        - Ý nghĩa: Đảm bảo tính nhỏ gọn và tương thích với node Cardano.

---

**3. Kỹ thuật lập trình với Aiken**

- **Cú pháp cơ bản**:
    - **Data Types**: Cách định nghĩa và sử dụng các kiểu dữ liệu (ví dụ: structs, enums).
    - **Functions**: Cấu trúc hàm, tham số, giá trị trả về.
    - **Câu lệnh điều kiện**: Sử dụng if-else trong logic smart contract.
- **Các từ khóa và cú pháp quan trọng**:
    - validator: Định nghĩa validator để kiểm soát việc tiêu dùng UTXO.
    - datum và redeemer: Cách khai báo và sử dụng trong validator.
    - Một số hàm tích hợp phổ biến (ví dụ: kiểm tra chữ ký, thời gian).
- **Validator Handlers**:
    - Giới thiệu vai trò của validator trong smart contract.
    - Cách viết validator: Đầu vào (datum, redeemer, context) và logic xác thực.
- **Viết và chạy Unit Test**:
    - Tầm quan trọng của việc kiểm thử smart contract trước khi triển khai.
    - Sử dụng framework kiểm thử của Aiken: Viết test case, mô phỏng giao dịch, kiểm tra kết quả.

---

**4. Ví dụ và Demo thực tế**

- **Tạo một dự án Aiken mới**:
    - Hướng dẫn cài đặt Aiken và khởi tạo dự án bằng CLI.
    - Phân tích cấu trúc dự án và các tệp được tạo ra sau khi build (ví dụ: tệp UPLC, CBOR Hex).
- **Ví dụ thực tế: Hợp đồng Lock ADA đơn giản (Hello World)**:
    - Mục tiêu: Khóa một lượng ADA và chỉ cho phép mở khóa với điều kiện cụ thể (ví dụ: chữ ký hợp lệ).
    - **Phân tích**:
        - Đầu vào: Datum (trạng thái hợp đồng), Redeemer (điều kiện mở khóa), Context (thông tin giao dịch).
        - Đầu ra: Logic validator kiểm tra điều kiện và cho phép/khóa ADA.
    - **Triển khai demo**:
        - Viết mã Aiken cho hợp đồng.
        - Build và kiểm tra đầu ra (UPLC, CBOR Hex).
        - Mô phỏng giao dịch trên testnet Cardano (nếu có thể).
