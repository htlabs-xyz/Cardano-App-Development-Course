# Video 01: Web3 and Web development Basic

### **1. Lập trình Web là gì?**

- Lập trình web là quá trình xây dựng và phát triển ứng dụng chạy trên trình duyệt web.
- Cho phép người dùng truy cập từ bất kỳ thiết bị nào có kết nối internet.
- Gồm hai phần chính:
    - **Frontend (Giao diện người dùng)**: Mọi thứ mà người dùng thấy và tương tác trực tiếp trên trình duyệt.
    - **Backend (Máy chủ, xử lý dữ liệu)**: Xử lý logic, lưu trữ dữ liệu và trả về phản hồi dưới dạng HTML, JSON hoặc API.
- Trình duyệt chịu trách nhiệm phân tích và hiển thị nội dung dựa trên mã HTML, CSS, và JavaScript.

---

## **2. HTML là gì?**

- HTML (HyperText Markup Language) là ngôn ngữ đánh dấu siêu văn bản dùng để tạo cấu trúc nội dung cho trang web.
- HTML không phải là ngôn ngữ lập trình mà chỉ là tập hợp các thẻ (tags) để trình duyệt hiểu và hiển thị nội dung.
- Cấu trúc cơ bản của một trang HTML:
    
    ```html
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Giới thiệu HTML</title>
    </head>
    <body>
        <h1>Chào mừng đến với bài học HTML</h1>
        <p>Đây là đoạn văn bản đầu tiên của bạn!</p>
    </body>
    </html>
    
    ```
    
- **Giới thiệu một số thẻ HTML cơ bản**:
    - `<h1> - <h6>`: Tiêu đề
    - `<p>`: Đoạn văn bản
    - `<a>`: Liên kết
    - `<img>`: Hình ảnh
    - `<ul>, <ol>, <li>`: Danh sách
    - `<table>`: Bảng
    - `<form>, <input>, <button>`: Biểu mẫu
- **Code demo form điền thông tin đơn giản (chưa có CSS, JS)**
    
    ```html
    <form>
        <label for="name">Họ và tên:</label>
        <input type="text" id="name" name="name">
    
        <label for="email">Email:</label>
        <input type="email" id="email" name="email">
    
        <button type="submit">Gửi</button>
    </form>
    
    ```
    

---

## **3. CSS là gì?**

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
    
    ```
    

---

## **4. JavaScript là gì?**

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
        <input type="text" id="name" required>
        <button type="submit">Gửi</button>
    </form>
    
    ```
    

---
