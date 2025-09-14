# 📘 Video 1: Web3 and Web development Basic

---

## 📝 Bài tập 1: Trang giới thiệu bản thân (HTML)

### Đề bài

Tạo trang web giới thiệu bản thân.

### Yêu cầu

- Hiển thị họ tên, ảnh đại diện, đoạn mô tả ngắn.
- Thêm liên kết đến trang web yêu thích.

### Cách giải

Sử dụng các thẻ HTML cơ bản: `<h1>`, `<img>`, `<p>`, `<a>`.

### Đáp án

```html
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <title>Giới thiệu bản thân</title>
  </head>
  <body>
    <h1>Nguyễn Văn A</h1>
    <img src="avatar.jpg" alt="Ảnh đại diện" width="150" />
    <p>
      Xin chào! Mình là Nguyễn Văn A, mình yêu thích lập trình web và công nghệ
      mới.
    </p>
    <a href="https://www.google.com" target="_blank"
      >Trang web yêu thích của tôi</a
    >
  </body>
</html>
```

---

## 📝 Bài tập 2: Trang trí giao diện (CSS)

### Đề bài

Trang trí trang web ở Bài tập 1.

### Yêu cầu

- Nền màu nhẹ.
- Tiêu đề căn giữa, màu đậm.
- Ảnh đại diện dạng hình tròn.
- Link đổi màu khi hover.

### Cách giải

Tạo file `style.css` và liên kết vào HTML, sau đó viết CSS cho body, h1, img, a.

### Đáp án

```css
/* style.css */
body {
  background-color: #f5f5f5;
  font-family: Arial, sans-serif;
  text-align: center;
}

h1 {
  color: #333;
}

img {
  border-radius: 50%;
}

a {
  color: blue;
  text-decoration: none;
}

a:hover {
  color: red;
}
```

---

## 📝 Bài tập 3: Form đăng ký (HTML + CSS)

### Đề bài

Tạo form đăng ký với các input và nút.

### Yêu cầu

- Form gồm: Họ tên, Email, Mật khẩu, nút Đăng ký.
- CSS để căn giữa, thêm màu nền, border radius, hiệu ứng hover cho nút.

### Cách giải

Dùng `<form>` chứa `<input>` và `<button>`. CSS căn giữa và trang trí form.

### Đáp án

```html
<form class="register-form">
  <h2>Đăng ký</h2>
  <input type="text" id="name" placeholder="Họ tên" />
  <input type="email" id="email" placeholder="Email" />
  <input type="password" id="password" placeholder="Mật khẩu" />
  <button type="submit">Đăng ký</button>
</form>
```

```css
.register-form {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
}
```

---

## 📝 Bài tập 4: JavaScript xử lý nội dung

### Đề bài

Thêm nút bấm đổi nội dung đoạn văn.

### Yêu cầu

- Có thẻ `<p>` với nội dung ban đầu.
- Khi nhấn nút, đổi nội dung bằng JavaScript.

### Cách giải

Dùng `document.getElementById` và thuộc tính `innerHTML` trong hàm JavaScript.

### Đáp án

```html
<p id="demo">Xin chào!</p>
<button onclick="changeText()">Đổi nội dung</button>

<script>
  function changeText() {
    document.getElementById("demo").innerHTML =
      "Chào mừng bạn đến với website của tôi!";
  }
</script>
```

---

## 📝 Bài tập 5: Kiểm tra form (JavaScript nâng cao)

### Đề bài

Kiểm tra dữ liệu form đăng ký.

### Yêu cầu

- Email phải có ký tự `@`.
- Mật khẩu tối thiểu 6 ký tự.
- Hiển thị thông báo thành công hoặc lỗi.

### Cách giải

Dùng sự kiện `onsubmit`, `event.preventDefault()`, kiểm tra chuỗi và độ dài.

### Đáp án

```html
<form onsubmit="return validateForm(event)">
  <input type="email" id="email" placeholder="Email" />
  <p id="emailError" style="color:red;"></p>
  <input type="password" id="password" placeholder="Mật khẩu" />
  <p id="passError" style="color:red;"></p>
  <button type="submit">Đăng ký</button>
  <p id="successMsg" style="color:green;"></p>
</form>

<script>
  function validateForm(event) {
    event.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let emailError = document.getElementById("emailError");
    let passError = document.getElementById("passError");
    let successMsg = document.getElementById("successMsg");

    emailError.innerText = "";
    passError.innerText = "";
    successMsg.innerText = "";

    let isValid = true;

    if (!email.includes("@")) {
      emailError.innerText = "Email phải chứa ký tự @";
      isValid = false;
    }

    if (password.length < 6) {
      passError.innerText = "Mật khẩu phải có ít nhất 6 ký tự";
      isValid = false;
    }

    if (isValid) {
      successMsg.innerText = "Đăng ký thành công!";
    }
    return false;
  }
</script>
```
