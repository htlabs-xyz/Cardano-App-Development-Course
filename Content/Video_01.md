# Video 01: Web3 and Web development Basic

### **Mục tiêu bài học**

- Hiểu được vai trò của HTML, CSS, JavaScript trong phát triển web.
- Biết cách tạo trang web tĩnh có tương tác cơ bản.
- Làm quen với khái niệm Web3 và cách kết nối giữa Web2 và blockchain.

### **Phần 1: Giới thiệu về phát triển web**

#### **1.1. Lập trình web là gì**

- Lập trình web là quá trình xây dựng và phát triển ứng dụng chạy trên trình duyệt web, cho phép người dùng truy cập từ bất kỳ thiết bị nào có Internet.
- Gồm hai phần chính:
  - **Frontend (Giao diện người dùng)**: Mọi thứ mà người dùng thấy và tương tác trực tiếp trên trình duyệt.
  - **Backend (Máy chủ, xử lý dữ liệu)**: Xử lý logic, lưu trữ dữ liệu và trả về phản hồi dưới dạng HTML, JSON hoặc API.
- Trình duyệt chịu trách nhiệm phân tích và hiển thị nội dung dựa trên mã HTML, CSS, và JavaScript.

Ví dụ: Khi bạn đăng nhập vào Facebook, trình duyệt gửi yêu cầu (request) đến máy chủ. Máy chủ xác minh thông tin, truy vấn dữ liệu từ cơ sở dữ liệu, rồi trả về giao diện hiển thị kết quả cho bạn.

#### **1.2. Cách hoạt động cơ bản của web**

- Người dùng nhập địa chỉ trang web (ví dụ: https://google.com).
- Trình duyệt gửi yêu cầu đến máy chủ web (server).
- Server phản hồi lại mã HTML, CSS, JavaScript.
- Trình duyệt hiển thị nội dung trang web.

---

### **Phần 2: Giới thiệu HTML**

#### **2.1. HTML là gì?**

- HTML (HyperText Markup Language) là ngôn ngữ đánh dấu siêu văn bản dùng để tạo cấu trúc nội dung cho trang web.
- HTML không phải là ngôn ngữ lập trình mà chỉ là tập hợp các thẻ (tags) để trình duyệt hiểu và hiển thị nội dung.
- Cấu trúc cơ bản của một trang HTML:
  ```html
  <!DOCTYPE html>
  <html lang="vi">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Giới thiệu HTML</title>
    </head>
    <body>
      <h1>Chào mừng đến với bài học HTML</h1>
      <p>Đây là đoạn văn bản đầu tiên của bạn!</p>
    </body>
  </html>
  ```

#### **2.2. iới thiệu một số thẻ HTML cơ bản**:

- `<h1> - <h6>`: Tiêu đề
- `<p>`: Đoạn văn bản
- `<a>`: Liên kết đường dẫn
- `<img>`: Hình ảnh hiển thị
- `<ul>, <ol>, <li>`: Tạo danh sách
- `<table>`: Bảng danh sách
- `<form>, <input>, <button>`: Biểu mẫu thu thập dữ liệu người dùng

#### **1.3 Bài tập HTML Code demo form điền thông tin đơn giản (chưa có CSS, JS)**

Tạo một trang giới thiệu bản thân:

Hiển thị họ tên, ảnh đại diện và đoạn mô tả ngắn.

Thêm liên kết đến một trang web bạn yêu thích.

```html

```

---

### **Phần 3: CSS là gì?**

#### **3.1. CSS là gì?**

- CSS (Cascading Style Sheets) là ngôn ngữ dùng để thiết kế giao diện và định dạng trang web.
- Tác dụng của CSS:
  - Kiểm soát màu sắc, font chữ, khoảng cách, bố cục trang web.
  - Giúp trang web hiển thị đẹp mắt và chuyên nghiệp hơn.
- **Thêm CSS vào HTML (3 cách chính)**:
  1. **Internal CSS**: Viết trong thẻ `<style>` bên trong file HTML.
  2. **External CSS**: Viết trong file `.css` riêng và liên kết với HTML qua `<link>`.
  3. **Inline CSS**: Viết trực tiếp trong thuộc tính `style` của từng phần tử.
- **Demo form có CSS**

  ```html
  <!DOCTYPE html>
  <html lang="vi">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Giới thiệu HTML</title>
      <style>
        form {
          width: 300px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: #f9f9f9;
        }
        input {
          width: 100%;
          padding: 8px;
          margin: 5px 0;
          border: 1px solid #ccc;
        }
        button {
          background-color: blue;
          color: white;
          padding: 10px;
          border: none;
          cursor: pointer;
        }
      </style>
    </head>
    <body>
      <h1>Chào mừng đến với bài học HTML</h1>
      <p>Đây là đoạn văn bản đầu tiên của bạn!</p>
      <form>
        <label for="name">Họ và tên:</label>
        <input type="text" id="name" name="name" />

        <label for="email">Email:</label>
        <input type="email" id="email" name="email" />

        <button type="submit">Gửi</button>
      </form>
    </body>
  </html>
  ```

---

### **4. JavaScript là gì?**

- JavaScript (JS) là ngôn ngữ lập trình giúp tạo ra các tính năng động và tương tác trên trang web.
- **Tác dụng của JavaScript**:
  - Thay đổi nội dung HTML, cập nhật CSS mà không cần tải lại trang.
  - Xử lý sự kiện (click, nhập liệu, gửi form...).
  - Giao tiếp với server (AJAX, Fetch API).
- **Cách JavaScript tương tác với HTML & CSS**:
  - Thêm JavaScript vào trang web qua `<script>`.
  - Sử dụng `document.getElementById()`, `querySelector()` để truy cập và thay đổi nội dung.
- **Demo sử dụng JavaScript để thay đổi nội dung HTML**

  ```html
  <script>
    function changeText() {
      document.getElementById("demo").innerHTML = "Nội dung đã được thay đổi!";
    }
  </script>

  <p id="demo">Nội dung ban đầu</p>
  <button onclick="changeText()">Nhấn để thay đổi</button>
  ```

- **Demo sử dụng JavaScript để xử lý sự kiện form**

  ```html
  <script>
    function handleSubmit(event) {
      event.preventDefault();
      let name = document.getElementById("name").value;
      alert("Chào bạn, " + name + "!");
    }
  </script>

  <form onsubmit="handleSubmit(event)">
    <label for="name">Nhập tên:</label>
    <input type="text" id="name" required />
    <button type="submit">Gửi</button>
  </form>
  ```

---

### **5. JavaScript là gì?**

#### **5.1. Sự phát triển của web**

| Phiên bản | Đặc điểm chính                                            |
| --------- | --------------------------------------------------------- |
| **Web1**  | Nội dung tĩnh, chỉ đọc                                    |
| **Web2**  | Nội dung động, người dùng tương tác (Facebook, YouTube)   |
| **Web3**  | Ứng dụng phi tập trung (DApp), người dùng làm chủ dữ liệu |

#### **5.2. Web3 là gì?**

Web3 là thế hệ web mới xây dựng trên blockchain, nơi dữ liệu và tài sản kỹ thuật số được lưu trữ phi tập trung, không phụ thuộc vào máy chủ trung tâm.

- Web2 = Website + Server + Database
- Web3 = Website + Smart Contract + Blockchain

#### **5.3. Thành phần của một DApp**

| Thành phần             | Vai trò                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| **Frontend**           | Giao diện người dùng (HTML, CSS, JS, React, Next.js)             |
| **Smart Contract**     | Logic xử lý, lưu trữ dữ liệu trên blockchain                     |
| **Wallet**             | Nơi người dùng quản lý khóa cá nhân và ký giao dịch              |
| **Blockchain Network** | Mạng phi tập trung để ghi nhận dữ liệu (Ethereum, Cardano, v.v.) |
