# Video 06: Making transaction

---

- **Lý thuyết cơ sở**
    - **Giao dịch trên blockchain là gì?**
        - Định nghĩa cơ bản: Giao dịch là hành động chuyển giá trị (tiền, tài sản số) giữa các thực thể trên blockchain.
        - Quá trình giao dịch giữa A và B: Từ việc ký giao dịch, gửi lên mạng, đến xác nhận bởi các node.
        - Chi phí phát sinh: Phí giao dịch (transaction fee), phụ thuộc vào kích thước giao dịch và tải mạng.
    - **Tầm quan trọng của giao dịch trong blockchain**
        - Là nền tảng của mọi hoạt động: chuyển tiền, thực thi hợp đồng thông minh, lưu trữ dữ liệu.
        - Liên quan đến mọi bài toán thực tế trong Web3 (mua bán, trao đổi, quản lý tài sản).
    - **Giao dịch trong Web3**
        - Đặc điểm: Phi tập trung, minh bạch, không cần trung gian.
        - Lợi ích: Thuận tiện, nhanh chóng, kiểm soát bởi người dùng.
    - **Mô hình eUTXO trên Cardano**
        - Khác biệt so với UTXO của Bitcoin: Mỗi UTxO có thể chứa dữ liệu bổ sung (datum) và logic hợp đồng thông minh.
        - So sánh với mô hình tài khoản (Account Model) của Ethereum: Deterministic hơn, dễ dự đoán chi phí.
        - Ưu điểm: Minh bạch, hiệu quả, bảo mật cao.
---

- **Đưa ra bài toán**
    - **Mô tả bài toán**: Tạo một ứng dụng đơn giản để chuyển ADA từ ví của người dùng (Owner) sang ví đích (Recipient).
        - Các đối tượng tham gia: Ví Owner, ví Recipient, mạng Cardano, MeshJS (thư viện hỗ trợ).
        - Tương tác: Owner nhập số ADA và địa chỉ ví Recipient → Gửi giao dịch → Mạng xác nhận.
    - **Luồng dữ liệu**
        - Khi Owner nhập thông tin và nhấn nút gửi: Dữ liệu (số ADA, địa chỉ đích) được MeshJS xử lý → Tạo giao dịch → Ký bằng ví trình duyệt → Gửi lên mạng Cardano.
        - Lưu trữ: Giao dịch được ghi lại trên blockchain, có thể tra cứu qua CardanoScan.
    - **Chi phí giao dịch**
        - Phí tối thiểu (~0.17 ADA) và phụ thuộc vào kích thước giao dịch (bytes).
        - Cách tính phí: MeshJS tự động ước lượng dựa trên giao dịch.
    - **Cách demo**
        - Chuẩn bị trước code hoàn chỉnh.
        - Demo trực quan: Hiển thị số dư trước/sau, kiểm tra giao dịch trên CardanoScan.

---

- **Chuẩn bị trước**
    - **Cài đặt ví trình duyệt**
        - Hỗ trợ: Nami, Eternl, hoặc Flint.
        - Hướng dẫn cài đặt nhanh và kết nối với ứng dụng.
    - **Tạo ví và nạp ADA**
        - Request test ADA từ Cardano Faucet (testnet).
        - Lưu ý: Sử dụng testnet để thực hành.
    - **Tài liệu và API**
        - MeshJS Docs: API kết nối ví, tạo và gửi giao dịch.
        - Cardano Developer Portal: Tài liệu về eUTXO và giao dịch.
    - **Công cụ và thư viện**
        - MeshJS (thư viện chính).
        - Node.js, npm (môi trường lập trình).
        - Framework UI (tùy chọn: React, Vue).

---

- **Tạo giao diện (UI)**
    - **Phần chọn ví và hiển thị số dư**
        - Dropdown/list để chọn ví (Nami, Eternl...).
        - Hiển thị địa chỉ ví và số dư ADA hiện tại.
    - **Phần nhập liệu và gửi giao dịch**
        - Ô nhập: Số ADA cần gửi, địa chỉ ví đích.
        - Nút “Gửi” để kích hoạt giao dịch.
     
--- 

- **Code logic và kết nối Offchain API**
    - **Kết nối ví và hiển thị số dư**
        - API: MeshJS BrowserWallet (hàm enable() để kết nối ví).
        - Input: Không cần, chỉ yêu cầu người dùng chọn ví.
        - Output: Địa chỉ ví (pubKeyHash), số dư (lovelace).
        - Task blockchain: Gọi getBalance() để lấy số dư.
        - Debugging: Log thông tin ví ra console để kiểm tra.
    - **Gửi ADA cho ví đích**
        - API: MeshJS Transaction (hàm sendAssets() hoặc sendLovelace()).
        - Input: Số ADA (tính bằng lovelace: 1 ADA = 1,000,000 lovelace), địa chỉ ví đích.
        - Output: Transaction hash (txHash) sau khi gửi thành công.
        - Task blockchain: Tạo giao dịch → Ký bằng ví → Gửi lên mạng.
        - Debugging: Log txHash để kiểm tra trên CardanoScan.

---

- **Kiểm tra chương trình**
    - **Test giao dịch**
        - Kiểm tra số dư của ví Owner và Recipient trước/sau khi gửi.
        - Xác nhận giao dịch hoàn tất trên CardanoScan (dùng txHash).
    - **Xử lý lỗi**
        - Trường hợp ví không đủ ADA → Thông báo thiếu phí.
        - Lỗi kết nối ví → Hướng dẫn người dùng kiểm tra lại.
