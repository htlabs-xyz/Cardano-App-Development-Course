# Video 13: Developing the Frontend Marketplace with Corresponding Functions

---

- **Tổng quan**

  - Nhắc lại những phần đã hoàn thiện: UI, SC
  - Những gì sẽ làm trong bài học hôm nay: tích hợp
  - Xác định các chức năng sẽ viết thành hàm để gọi

---

- **Tổ chức kết nối API Mesh**

  - Tổ chức folder để viết các hàm, tham số tương tác với API
  - Tách những tham số có thể sử dụng chung: API KEY, URL,...
  - Viết Provider để lưu những giá sử dụng toàn cục: địa chỉ ví,...

---

- **Tổ chức kết nối hợp đồng thông minh**

  - Copy file plutus.json và đọc validator
  - Tạo schema của object Datum & Redeemer
  - Viết hàm đọc mã hợp đồng từ file

---

- **Kết nối ví**

  - Xác định API gọi để connect tới ví (Eternal)
  - Lưu những thông tin của người dùng khi đã kết nối tới ví vào context
  - Test trên giao diện thử kết nối tới ví trình duyệt 
  - Test log ra những thông số khi kết nối thành công

---

- **Trang Account**
  - Xác định API cần dùng để query list NFT có trong ví đã kết nối: đầu vào, đầu ra
  - Tạo schema của object chứa các trường là input, output API để mapping dữ liệu
  - Phân loại NFT đang trên sàn | chưa lên sàn 
    - Query từ hợp đồng để lọc ra những NFT của mình đang bán
  - Kiểm tra các thông tin NFT hiển thị | log ra có chính xác hay không
  - Hành động ấn Sell 
    - Tạo schema của object là đầu vào là datum chứa các thông tin nft
    - Viết hàm đọc và gọi đến hợp đồng
    - Kiểm tra query xem NFT đã tồn tại trên hợp đồng sell chưa
  - Hành động ấn Refund 
    - Tạo schema của object là đầu vào là redeemer chứa các thông tin người bán
    - Viết hàm đọc và gọi đến hợp đồng
    - Kiểm tra xem NFT còn trên hợp đồng không

---

- **Trang Home**

  - Xác định API cần dùng để query list NFT từ hợp đồng: đầu vào, đầu ra
  - Tạo schema của object chứa các trường là input, output API để mapping dữ liệu
  - Viết hàm gọi đến API chứa đầu vào và đầu ra mong muốn (đầu ra là list các NFT đã lock trong hợp đồng sell)
  - Test log ra thông tin
  - Test hiển thị giao diện

---

- **Trang Details**

  - Xác định API cần dùng để query thông tin 1 NFT từ hợp đồng: đầu vào, đầu ra 
    - Tạo schema của object chứa các trường là input, output API để mapping dữ liệu
    - Viết hàm gọi đến API chứa đầu vào và đầu ra mong muốn (đầu vào là policyID, asset name, đầu ra các thông tin của 1 NFT)
  - Xác định API cần dùng để query thông tin list offer của 1 NFT 1 NFT từ hợp đồng 
    - Tạo schema của object chứa các trường là input, output của hợp đồng để mapping dữ liệu
    - Viết hàm đọc và gọi đến hợp đồng, đầu ra mong muốn là list các datum chứa thông tin các offer
  - \[Ở phía người mua\] 
    - Hành động ấn Buy: 
      - Tạo schema của object là đầu vào là redeemer chứa các thông tin người mua
      - Viết hàm đọc và gọi đến hợp đồng
      - test mua của 1 addr khác và kiểm tra số tiền bị trừ và NFT trong ví

---

- **Test tổng thể**

  - Lên 1 số kịch bản mua bán, refund, update
  - Thực hiện kiểm tra với từng case

---

- **Kết thúc:**

  - Tóm tắt nội dung học
  - Bài tập
  - Chuẩn bị cho bài kế tiếp
