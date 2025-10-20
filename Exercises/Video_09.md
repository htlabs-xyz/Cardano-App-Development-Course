# 🎨 Video 09: Analyzing Ideas for an NFT Marketplace

## 📝 Bài tập 1: Phân tích chức năng cơ bản của NFT Marketplace

### Đề bài

Dựa trên nội dung bài giảng, hãy phân tích và mô tả **4 chức năng chính** của một NFT Marketplace trên Cardano.

### Yêu cầu

- Liệt kê đầy đủ các chức năng cơ bản.
- Giải thích ngắn gọn vai trò của từng chức năng trong hệ thống.
- Phân biệt chức năng nào cần sử dụng smart contract, chức năng nào chỉ cần query dữ liệu.

### Cách giải

1. Đọc lại phần mô tả về các chức năng chính trong marketplace (connect, list, update, delete, buy).
2. Xác định chức năng nào liên quan đến giao dịch on-chain.
3. Viết mô tả ngắn gọn (1–2 câu) cho mỗi chức năng.

### Đáp án

| Chức năng           | Mô tả                                                             | Cần Smart Contract |
| ------------------- | ----------------------------------------------------------------- | ------------------ |
| Connect Wallet      | Kết nối ví người dùng như Eternl hoặc Nami để xác thực danh tính. | ❌                 |
| List NFT for Sale   | Tạo giao dịch list NFT lên sàn cùng giá bán mong muốn.            | ✅                 |
| Update / Delist NFT | Cập nhật giá bán hoặc hủy niêm yết NFT.                           | ✅                 |
| Buy NFT             | Mua NFT từ người bán khác, tạo giao dịch chuyển quyền sở hữu.     | ✅                 |
| Show Listed NFTs    | Hiển thị danh sách NFT đang bán bằng cách query dữ liệu.          | ❌                 |

---

## 📝 Bài tập 2: Phân tích luồng giao dịch Mua NFT

### Đề bài

Mô tả chi tiết **luồng hoạt động (workflow)** khi người dùng mua một NFT trên marketplace.

### Yêu cầu

- Viết mô tả từng bước từ khi người dùng chọn NFT đến khi giao dịch hoàn tất.
- Ghi rõ vai trò của ví, smart contract, và blockchain trong quy trình.
- Biểu diễn lại quy trình bằng sơ đồ hoặc bullet list.

### Cách giải

1. Xác định các tác nhân: người mua, smart contract, blockchain.
2. Mô tả từng bước theo trình tự thời gian.
3. Chỉ ra dữ liệu nào được ghi nhận on-chain.

### Đáp án

1. Người dùng chọn NFT muốn mua.
2. Nhấn “Buy Now” → tạo giao dịch.
3. Ví ký và gửi giao dịch đến blockchain.
4. Smart contract xử lý thanh toán, chuyển NFT sang ví người mua.
5. Giao dịch được xác nhận → NFT hiển thị trong ví mới.

---

## 📝 Bài tập 3: Thiết kế giao diện người dùng cho Marketplace

### Đề bài

Thiết kế **giao diện cơ bản (UI)** cho NFT Marketplace bao gồm các phần chính.

### Yêu cầu

- Phác thảo layout (có thể bằng tay hoặc mô tả).
- Nêu rõ các thành phần: danh sách NFT, trang chi tiết, hồ sơ người dùng.
- Xác định nút và hành động tương ứng.

### Cách giải

1. Phân tích giao diện mẫu trong video (ví dụ jgp.store).
2. Xác định các khu vực chính của UI.
3. Mô tả cách người dùng tương tác qua từng phần.

### Đáp án

**Cấu trúc gợi ý:**

- **Trang chủ:** Hiển thị danh sách các bộ sưu tập NFT.
- **Trang chi tiết NFT:** Hình ảnh, mô tả, giá, nút “Buy Now”.
- **Trang Profile:** Hiển thị NFT đang sở hữu, có nút “Sell”, “Update”, “Delist”.
- **Thanh điều hướng:** Connect Wallet, My Profile, Marketplace.

---

## 📝 Bài tập 4: Phân tích Smart Contract cho Marketplace

### Đề bài

Xác định **4 hàm chính** cần có trong Smart Contract của NFT Marketplace và mô tả chức năng của từng hàm.

### Yêu cầu

- Đặt tên các hàm hợp lý (ví dụ: `listNFT`, `buyNFT`, …).
- Giải thích ngắn gọn input, output và hành động on-chain của mỗi hàm.
- Nêu rõ ai có quyền gọi mỗi hàm.

### Cách giải

1. Dựa vào 4 chức năng chính đã học.
2. Mô tả vai trò của mỗi hàm trong quy trình giao dịch.
3. Viết bảng tóm tắt tên, input, output, người gọi.

### Đáp án

| Hàm             | Input           | Output            | Người gọi | Mục đích               |
| --------------- | --------------- | ----------------- | --------- | ---------------------- |
| `listNFT()`     | NFT ID, giá     | Tạo list on-chain | Người bán | Đưa NFT lên sàn        |
| `updatePrice()` | NFT ID, giá mới | Cập nhật dữ liệu  | Người bán | Thay đổi giá NFT       |
| `delistNFT()`   | NFT ID          | NFT về ví         | Người bán | Hủy niêm yết           |
| `buyNFT()`      | NFT ID          | NFT → buyer       | Người mua | Mua NFT từ marketplace |

---

## 📝 Bài tập 5: So sánh NFT Marketplace thực tế

### Đề bài

So sánh hai nền tảng **JPG.store** và **cNFT.io** về các đặc điểm vận hành và trải nghiệm người dùng.

### Yêu cầu

- So sánh về UI, tính năng, hiệu suất, và độ phổ biến.
- Nêu ra điểm mạnh và điểm yếu của từng nền tảng.
- Gợi ý cải tiến nếu bạn xây dựng marketplace của riêng mình.

### Cách giải

1. Truy cập hai trang web và quan sát trực tiếp.
2. Ghi nhận điểm khác biệt trong giao diện và tốc độ phản hồi.
3. Đưa ra nhận xét và đề xuất của bản thân.

### Đáp án

| Tiêu chí       | JPG.store                           | cNFT.io                |
| -------------- | ----------------------------------- | ---------------------- |
| Giao diện      | Hiện đại, dễ dùng                   | Đơn giản, truyền thống |
| Tính năng      | Có buy/sell, offer, auction         | Chỉ có buy/sell cơ bản |
| Phổ biến       | Rất cao (90% giao dịch Cardano NFT) | Thấp hơn               |
| Hiệu suất      | Nhanh, ổn định                      | Chậm hơn               |
| Gợi ý cải tiến | Thêm phần community và analytics    | Cải thiện UI và tốc độ |

---

✅ **Ghi chú cuối:**
Các bài tập này giúp học viên nắm vững nền tảng lý thuyết và thực hành tư duy thiết kế NFT Marketplace trước khi bước sang phần **UI development** và **Smart Contract implementation** trong các video sau.
