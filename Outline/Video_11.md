**Nội dung chính**

- **Phân tích bài toán**

  - Phân tích các phần phải làm việc với onchain
  - Xác định các hợp đồng cần viết, tác dụng của mỗi hợp đồng
  - Xác định ràng buộc của mỗi hợp đồng
  - Phân tích datum của các hợp đồng, phân loại hợp đồng
  - Phân tích Logic của từng hợp đồng, input, UTXO, có thể show sơ đồ biểu thị

- **Khởi tạo dự án Aiken**

  - Chạy lệnh, cài đặt, cấu hình, quy định đặt tên, tổ chức thư mục
  - Khởi tạo các module, tham số

- **Viết hợp đồng cho chức năng Sell**

  - Xác định các ràng buộc, Xác định loại hợp đồng (Spend), mục đích của hợp đồng
  - Phân tích luồng logic chính của hợp đồng, luồng đi biểu diễn UTXO
  - Viết code theo logic đã phân tích 
    - Import các thư viện cần thiết
    - Khai báo datum, redeemer
    - Tách hàm nếu có thể để code minh bạch hơn
    - Kết hợp các thành phần để hoàn thiện hợp đồng
  - test hợp đồng với đầu vào với 1 số input đơn giản

- **Viết hợp đồng cho chức năng Offer**

  - Xác định các ràng buộc, Xác định loại hợp đồng, mục đích của hợp đồng
  - Phân tích luồng logic chính của hợp đồng, luồng đi biểu diễn UTXO
  - Viết code theo logic đã phân tích 
    - Import các thư viện cần thiết
    - Khai báo datum, redeemer
    - Tách hàm nếu có thể để code minh bạch hơn
    - Kết hợp các thành phần để hoàn thiện hợp đồng
  - test hợp đồng với đầu vào với 1 số input đơn giản

- **Build hợp đồng**

  - kiểm tra lại mã hợp đồng trên cardano scan

- **Kết thúc**

  - Tóm tắt nội dung học
  - Bài tập
  - Hướng bài học tiếp theo Writing Test Cases for Smart Contracts 
    - bài kế tiếp ta sẽ phân tích một vài kịch bản và viết test case cho các tường hợp đó
  - Chuẩn bị cho bài kế tiếp
