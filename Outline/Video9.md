**1. Trình bày demo một NFT Marketplace thực tế trên Cardano**

---

- Ví dụ thực tế: Sử dụng một nền tảng như **CNFT.io** hoặc **jpg.store** để minh họa.
- Các bước trình diễn:
    - Kết nối ví Cardano (Nami, Eternl, hoặc Yoroi).
    - Xem danh sách NFT, thực hiện mua hoặc liệt kê NFT.
- Điểm nổi bật trong demo:
    - Cách ví tích hợp với ứng dụng.
    - Trải nghiệm người dùng khi thực hiện giao dịch.
- Câu hỏi dẫn dắt: "Các chức năng này được triển khai như thế nào trên Cardano?"

**2. Phân tích các chức năng cơ bản của NFT Marketplace trên Cardano**

- **Liệt kê NFT (Listing):**
    - Quy trình: Người bán khóa NFT vào một hợp đồng (script address) với giá bán.
    - Yêu cầu kỹ thuật:
        - Tạo giao dịch với native asset (NFT) và gửi đến script.
        - Đảm bảo metadata của NFT (tên, mô tả, hình ảnh) được lưu trữ phù hợp.
- **Hủy liệt kê NFT (Delisting):**
    - Quy trình: Người bán rút NFT từ script về ví cá nhân.
    - Yêu cầu kỹ thuật:
        - Xác minh quyền sở hữu thông qua UTxO và chữ ký.
        - Hủy bỏ trạng thái "đang bán" trong hợp đồng.
- **Mua NFT (Buying):**
    - Quy trình: Người mua gửi ADA đến script, NFT được mở khóa và chuyển về ví người mua.
    - Yêu cầu kỹ thuật:
        - Kiểm tra số dư ADA trong ví người mua.
        - Chuyển NFT và thanh toán ADA trong cùng một giao dịch (atomic swap).

**3. Phân tích logic của Validator theo từng chức năng**

- **Validator trong Cardano:**
    - Là script chạy trên-chain để kiểm tra tính hợp lệ của giao dịch dựa trên các điều kiện được định nghĩa trước.
    - Gắn với UTxO để kiểm soát các giao dịch cụ thể.
- **Logic Validator cho từng chức năng:**
    - **Listing (Liệt kê NFT):**
        - Điều kiện kiểm tra:
            - Xác minh NFT được gửi từ ví của người bán hợp lệ.
            - Đảm bảo giá bán được ghi rõ trong dữ liệu đi kèm UTxO.
    - **Delisting (Hủy liệt kê):**
        - Điều kiện kiểm tra:
            - Chỉ cho phép người bán (chủ sở hữu ban đầu) rút NFT về ví.
            - Kiểm tra NFT chưa được mua bởi người khác.
    - **Buying (Mua NFT):**
        - Điều kiện kiểm tra:
            - Xác minh người mua gửi đủ ADA theo giá đã định.
            - Đảm bảo NFT được chuyển từ script sang ví người mua.
            - Kiểm tra ADA được chuyển từ người mua sang người bán.
- **Thách thức kỹ thuật:**
    - Cần thiết kế dữ liệu đi kèm (datum) và thông tin kích hoạt (redeemer) phù hợp.
    - Đảm bảo validator không quá phức tạp để tránh vượt giới hạn kích thước giao dịch.
