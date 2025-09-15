# Video 07: Minting/Burning Assets

---

**1. Những khái niệm cơ bản**

- **NFT và Token là gì?**
    - Định nghĩa: NFT (Non-Fungible Token) là tài sản số độc nhất, không thể thay thế; Token có thể là fungible (có thể thay thế) hoặc non-fungible.
    - Ý nghĩa: Đại diện cho quyền sở hữu, tài sản số, hoặc dữ liệu độc quyền trên blockchain.
    - Ứng dụng: Nghệ thuật số, game, vé sự kiện, tài sản trong metaverse, v.v.
- **Minting và Burning là gì?**
    - Minting: Quá trình tạo mới một NFT hoặc token trên blockchain. Kết quả: Một tài sản số được ghi nhận trên ledger Cardano.
    - Burning: Quá trình hủy bỏ NFT/token. Kết quả: Tài sản bị xóa khỏi ví và không còn tồn tại trên blockchain.
- **Vai trò của NFT trong dApp**
    - Ứng dụng phổ biến: Xác thực sở hữu, giao dịch tài sản, tích hợp trong game hoặc DeFi.
    - Ví dụ thực tế: Marketplace (JPG Store), game (Cardano Warriors).
- **NFT trên Cardano**
    - Đặc điểm: Không cần smart contract phức tạp, sử dụng native assets (tích hợp sẵn trong giao thức Cardano).
    - Chuẩn: Metadata dựa trên CIP-25 (Cardano Improvement Proposal), khác biệt với ERC-721/ERC-1155 của Ethereum.
    - Điểm nổi bật: Chi phí thấp, hiệu quả năng lượng, tính minh bạch.

---

**2. Đưa ra bài toán thực tế**

- **Bài toán 1: Tạo (Mint) NFT**
    - **Phân tích yêu cầu:**
        - Đầu vào: Metadata (tên, mô tả, hình ảnh, thuộc tính), địa chỉ ví, chính sách mint (policy).
        - Đầu ra: NFT được ghi vào blockchain và hiển thị trong ví người dùng.
    - **Luồng dữ liệu:**
        - Người dùng nhập metadata → Gửi giao dịch qua MeshJS → Giao dịch được ký và gửi lên blockchain → NFT xuất hiện trong ví.
    - **Chi phí giao dịch:**
        - Phí giao dịch Cardano (~0.17-0.2 ADA) + phí bổ sung nếu mint số lượng lớn.
    - **Demo:**
        - Chuẩn bị trước code hoàn chỉnh, chạy trực quan: Nhập metadata → Nhấn "Mint" → Kiểm tra NFT trong ví (ví dụ: Eternl hoặc Nami).
- **Bài toán 2: Hủy (Burn) NFT**
    - **Phân tích yêu cầu:**
        - Đầu vào: Asset ID (Policy ID + Asset Name) của NFT cần burn, địa chỉ ví.
        - Đầu ra: NFT bị xóa khỏi ví và blockchain.
    - **Luồng dữ liệu:**
        - Chọn NFT từ danh sách → Gửi giao dịch burn qua MeshJS → Giao dịch được ký và gửi lên blockchain → NFT biến mất khỏi ví.
    - **Chi phí giao dịch:**
        - Phí giao dịch tương tự như mint (~0.17-0.2 ADA).
    - **Demo:**
        - Chuẩn bị code hoàn chỉnh, chạy trực quan: Chọn NFT → Nhấn "Burn" → Kiểm tra ví không còn NFT.

---

**3. Chuẩn bị trước khi code**

- **Tài liệu cần tham khảo:**
    - MeshJS Docs: API kết nối ví (Nami, Eternl), API TransactionBuilder cho mint/burn.
    - CIP-25: Chuẩn metadata NFT trên Cardano.
    - Cardano Serialization Lib: Tạo Policy ID và Asset Name.
- **Công cụ và thư viện:**
    - MeshJS: Thư viện JavaScript để tương tác với blockchain Cardano.
    - IPFS (tùy chọn): Lưu trữ metadata/hình ảnh off-chain.
    - Ví trình duyệt: Nami hoặc Eternl để ký giao dịch.
    - Node.js: Môi trường chạy code off-chain.
- **Yêu cầu môi trường:**
    - Cài đặt MeshJS qua npm: npm install @meshjs/core @meshjs/react.
    - Kết nối ví thử nghiệm trên testnet Cardano (Preprod hoặc Preview).

---

**4. Thiết kế giao diện người dùng (UI)**

- **Màn hình chính:**
    - **Danh sách NFT trong ví:** Hiển thị danh sách NFT (tên, hình ảnh), mỗi NFT có nút "Burn".
    - **Form mint NFT:** Các trường nhập (tên, mô tả, URL ảnh), nút "Submit" để mint.
- **Yêu cầu giao diện:**
    - Responsive, đơn giản, dễ sử dụng.
    - Hiển thị trạng thái giao dịch (đang xử lý, thành công, lỗi).

---

**5. Code logic và kết nối Off-chain API**

- **Lấy danh sách NFT trong ví:**
    - API: MeshJS Wallet.getAssets().
    - Input: Địa chỉ ví (từ ví trình duyệt).
    - Output: Danh sách assets (Policy ID, Asset Name, metadata).
- **Mint NFT:**
    - API: MeshJS TransactionBuilder.
    - Input: Metadata (theo CIP-25), Policy ID, địa chỉ ví.
    - Output: Giao dịch được ký và gửi lên blockchain.
    - Quy trình:
        1. Tạo Policy ID (dùng MeshJS hoặc Cardano Serialization Lib).
        2. Chuẩn bị metadata và giao dịch mint.
        3. Ký giao dịch qua ví → Gửi lên blockchain → Kiểm tra NFT trong ví.
- **Burn NFT:**
    - API: MeshJS TransactionBuilder.
    - Input: Asset ID (Policy ID + Asset Name), địa chỉ ví.
    - Output: Giao dịch burn được gửi lên blockchain.
    - Quy trình:
        1. Tạo giao dịch burn với số lượng âm (-1) cho asset.
        2. Ký giao dịch qua ví → Gửi lên blockchain → Kiểm tra NFT bị xóa.
- **Xử lý lỗi:**
    - Kiểm tra số dư ADA trong ví đủ để trả phí.
    - Hiển thị thông báo lỗi nếu giao dịch thất bại.

---

**6. Kiểm thử chương trình**

- **Test case:**
    - Mint 3 NFT với metadata khác nhau → Kiểm tra danh sách NFT trong ví.
    - Burn 1 NFT → Kiểm tra NFT đã bị xóa khỏi ví.
- **Công cụ kiểm thử:**
    - Testnet Cardano: Preprod hoặc Preview.
    - Ví thử nghiệm: Nami/Eternl với ADA testnet.
