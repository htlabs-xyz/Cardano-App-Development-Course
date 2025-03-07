# Video 05: Query data onchain

---

**1. Nội dung chính**

**Blockfrost là gì? ([https://blockfrost.dev](https://blockfrost.dev/))**

- **Nền tảng và vai trò**
    - Blockfrost là một API mạnh mẽ cung cấp phương thức truy cập nhanh chóng và đơn giản vào blockchain Cardano mà không cần chạy node riêng.
    - Vai trò: thay thế cho việc tự đồng bộ hóa blockchain, giúp lập trình viên truy vấn dữ liệu trực tiếp qua các endpoint RESTful.
    - Đặc điểm nổi bật: nhẹ nhàng, dễ tích hợp, không yêu cầu kiến thức sâu về hạ tầng blockchain.
- **Thông tin bổ sung**
    - Được phát triển bởi Five Binaries, một công ty tập trung vào các giải pháp blockchain.
    - Tài nguyên cộng đồng: kênh Discord chính thức, GitHub ([github.com/blockfrost](https://github.com/blockfrost)), tài liệu API chi tiết.
- **Các tính năng và liên kết nổi bật**
    - Hỗ trợ SDK cho hầu hết các ngôn ngữ lập trình phổ biến (JavaScript, Python, Go, Rust, v.v.).
    - Tích hợp với IPFS (InterPlanetary File System) để truy xuất dữ liệu phân tán.
    - Hỗ trợ Webhooks để nhận thông báo thời gian thực về các sự kiện trên blockchain.
- **Phân loại module**
    - Hầu hết các module đều sử dụng phương thức GET để truy vấn dữ liệu từ blockchain.
    - Một số module chính:
        - **Accounts**: Quản lý thông tin tài khoản stake.
        - **Addresses**: Truy vấn chi tiết địa chỉ ví.
        - **Assets**: Theo dõi thông tin tài sản (token, NFT).
        - **Blocks**: Truy xuất dữ liệu khối.
        - **Epochs**: Thông tin về các epoch trên Cardano.
        - **Transactions**: Quản lý giao dịch (bao gồm cả truy vấn và gửi giao dịch).

---

**2. Giới thiệu module Accounts**

- **Tổng quan**: Cung cấp dữ liệu liên quan đến tài khoản stake trên Cardano (stake address), không phải địa chỉ ví thông thường.
- **Các chức năng chính**:
    - GET /accounts/{stake_address}: Lấy thông tin tổng quan (số dư, phần thưởng staking).
    - GET /accounts/{stake_address}/history: Lịch sử đăng ký và phần thưởng staking.
    - GET /accounts/{stake_address}/delegations: Thông tin lịch sử ủy quyền (delegation).
- **Ứng dụng**: Theo dõi hiệu suất staking hoặc phân tích tài khoản.

---

**3. Giới thiệu module Addresses**

- **Tổng quan**: Tập trung vào việc truy vấn thông tin chi tiết về địa chỉ ví (payment address), bao gồm số dư và giao dịch liên quan.
- **Các chức năng chính**:
    - GET /addresses/{address}: Lấy thông tin tổng quan về địa chỉ.
    - GET /addresses/{address}/utxos: Danh sách UTXO (Unspent Transaction Outputs) của địa chỉ.
    - GET /addresses/{address}/transactions: Lịch sử giao dịch liên quan.
- **Ứng dụng**: Kiểm tra số dư ví, phân tích hoạt động giao dịch.

---

**4. Giới thiệu module Assets**

- **Tổng quan**: Cung cấp thông tin về các tài sản trên Cardano, bao gồm native tokens và NFT.
- **Các chức năng chính**:
    - GET /assets: Danh sách tất cả tài sản.
    - GET /assets/{asset}: Chi tiết một tài sản cụ thể (tên, số lượng, metadata).
    - GET /assets/policy/{policy_id}: Lấy danh sách tài sản theo policy ID.
- **Ứng dụng**: Theo dõi token, kiểm tra NFT hoặc phân tích metadata.

---

**5. Giới thiệu module Transactions**

- **Tổng quan**: Quản lý dữ liệu giao dịch, từ truy vấn chi tiết đến gửi giao dịch mới lên blockchain.
- **Các chức năng chính**:
    - GET /txs/{hash}: Lấy thông tin chi tiết một giao dịch.
    - GET /txs/{hash}/utxos: UTXO đầu vào và đầu ra của giao dịch.
    - POST /tx/submit: Gửi giao dịch đã ký lên mạng Cardano.
- **Ứng dụng**: Tích hợp ví, xây dựng DApp hoặc theo dõi trạng thái giao dịch.

---

**6. Cách đăng ký và sử dụng**

- **Quy trình đăng ký**:
    1. Truy cập [blockfrost.io](https://blockfrost.io/), tạo tài khoản.
    2. Tạo một dự án (project) để nhận **Project ID** (dùng làm API key).
    3. Chọn mạng (mainnet, testnet) phù hợp với mục đích sử dụng.
- **Giới hạn tài khoản miễn phí**:
    - 50 yêu cầu mỗi giây (rate limit).
    - 50.000 yêu cầu mỗi ngày.
    - Không hỗ trợ một số tính năng nâng cao như Webhooks (yêu cầu gói trả phí).
- **Lưu ý**: Nâng cấp lên gói trả phí để tăng giới hạn và truy cập thêm tính năng.

---

**7. Demo thực hành**

- **Mục tiêu**: Query dữ liệu thực tế và so sánh với ví Cardano (ví dụ: Yoroi, Daedalus).
- **Ví dụ thực hành**:
    1. Sử dụng endpoint /addresses/{address} để lấy số dư ví và so sánh với số dư hiển thị trong Yoroi.
    2. Query /accounts/{stake_address} để kiểm tra phần thưởng staking và đối chiếu với ví.
- **Công cụ hỗ trợ**: Postman hoặc cURL để gửi yêu cầu API.
- **Kết quả mong đợi**: Học viên hiểu cách sử dụng Blockfrost và thấy được sự tương đồng giữa dữ liệu API và ví.
