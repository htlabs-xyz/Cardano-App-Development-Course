# Video 10: Designing the NFT Marketplace User Interface

---

**1. Nội dung chính**

- **Giới thiệu mục tiêu:**
    - Hướng dẫn thiết kế giao diện người dùng (UI) cho NFT Marketplace trên Cardano.
    - Tập trung vào trải nghiệm người dùng (UX) và tích hợp ví Cardano.
- **Tổng quan nội dung:**
    - Trình bày wireframe/giao diện mẫu.
    - Khởi tạo dự án lập trình.
    - Thiết kế từng phần giao diện (Layout, Home, Details, Account).

---

**2. Show và mô tả wireframe hoặc giao diện trang web đã hoàn thiện**

- **Mục đích:** Minh họa các thành phần giao diện chính của NFT Marketplace.
- **Bố cục Layout:**
    - **Header:** Chứa logo, thanh điều hướng, nút "Kết nối ví" (hiển thị trạng thái ví và số dư ADA khi kết nối).
    - **Main Body:** Khu vực chính hiển thị nội dung (danh sách NFT, chi tiết NFT, tài khoản).
    - **Footer:** Thông tin bản quyền, liên kết mạng xã hội, tài liệu Cardano.
- **Trang Home:**
    - Hiển thị danh sách NFT đang được bán dưới dạng lưới (grid).
    - Mỗi NFT item có ảnh, tên, giá ADA.
- **Trang Details:**
    - Hiển thị thông tin chi tiết của một NFT: tên, giá bán, mô tả, policy ID (định danh trên Cardano), nút hành động (mua/delist).
- **Trang Account:**
    - Hiển thị NFT của người dùng: danh sách đang bán và chưa bán.

---

**3. Khởi tạo dự án**

- **Tạo dự án:**
    - Sử dụng framework Next.js (phù hợp với Cardano dApp và triển khai dễ dàng).
    - Tạo cấu trúc thư mục: app/, components/, lib/, public/.
- **Cài đặt thư viện:**
    - Shadcn/ui cho UI components.
    - Meshjs để tích hợp ví Cardano (Nami, Eternl).
    - Blockfrost API lấy dữ liệu NFT từ Cardano blockchain.
- **Cấu hình tham số:**
    - Tạo file config.ts để lưu các tham số chung: network (testnet/mainnet), API endpoint.
- **Push lên Git:**
    - Khởi tạo repository, push code lên GitHub.
    - Chuẩn bị cho bài cuối: triển khai trên Vercel.

---

**4. Thiết kế Layout**

- **File xử lý:** Mở app/layout.tsx.
- **Phân chia bố cục:**
    - **Header:**
        - Component <Header /> với nút "Connect Wallet".
        - Sự kiện: Khi click "Connect Wallet", hiển thị dialog liệt kê các ví Cardano khả dụng (Nami, Eternl, Yoroi).
    - **Main Body:**
        - Thêm <main> với CSS linh hoạt (flexbox/grid) để chứa nội dung động.
    - **Footer:**
        - Component <Footer /> với các liên kết tĩnh.

---

**5. Thiết kế trang Home**

- **Mục đích:** Hiển thị danh sách NFT đang được bán trên Marketplace.
- **File xử lý:** Mở app/page.tsx.
- **Phân chia bố cục:**
    - Tiêu đề: "Explore NFTs" hoặc tương tự.
    - Grid: Hiển thị danh sách NFT dưới dạng lưới (responsive).
- **Thông tin mỗi NFT item:**
    - Ảnh, tên, giá bán (ADA), nút/link dẫn đến trang Details.
- **Thực hiện:**
    - Tách <NFTCard /> thành component riêng để tái sử dụng.
    - CSS: Hover effect, shadow, border cho từng item.
- **Dữ liệu:**
    - Giả lập dữ liệu NFT (policy_id và asset_name) hoặc lấy từ API Cardano (ví dụ: Blockfrost).

--- 

**6. Thiết kế trang Details**

- **Mục đích:** Hiển thị thông tin chi tiết của một NFT cụ thể.
- **File xử lý:** Tạo app/assets/[policyId]/page.tsx (dynamic route).
- **Phân chia bố cục:**
    - Hai cột:
        - Bên trái: Hiển thị ảnh NFT (từ IPFS hoặc URL metadata).
        - Bên phải: Thông tin chi tiết (tên, giá ADA, mô tả, policy ID, chủ sở hữu).
    - Nút hành động:
        - "Buy" (cho người mua, kiểm tra ví đã kết nối).
        - "Delist" (cho owner, chỉ hiển thị nếu NFT thuộc sở hữu).
- **Thông tin chi tiết:**
    - Tên, giá, metadata (thuộc tính NFT), lịch sử giao dịch (nếu có).
- **CSS:**
    - Tùy chỉnh layout responsive, button styling.

---

**7. Thiết kế trang Account**

- **Mục đích:** Hiển thị danh sách NFT của người dùng (đang bán và chưa bán).
- **File xử lý:** Tạo app/account/page.tsx.
- **Phân chia bố cục:**
    - Hai phần:
        - **NFT đang bán:** Danh sách NFT đã liệt kê trên Marketplace.
        - **NFT chưa bán:** Danh sách NFT trong ví chưa được liệt kê.
    - Mỗi item: Ảnh, tên, giá (nếu đang bán), nút hành động.
- **Thông tin mỗi item:**
    - Đang bán: Hiển thị giá, nút "Refund" (hủy liệt kê).
    - Chưa bán: Nút "Sell" để liệt kê lên sàn.
- **Sự kiện:**
    - "Sell": Mở form nhập giá, gửi giao dịch đến Cardano blockchain.
    - "Refund": Gửi yêu cầu hủy liệt kê, trả NFT về ví.
- **CSS:**
    - Sử dụng tab hoặc grid để phân chia hai danh sách.

