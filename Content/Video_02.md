# 📘 Video 02: Frontend Framework and Library

---

## **1. Khái niệm MPA (Multi-Page Application)**

### 🔹 MPA là gì?

**MPA (Multi-Page Application)** là mô hình phát triển web truyền thống, trong đó **mỗi lần người dùng chuyển sang một trang mới**, trình duyệt sẽ **gửi một yêu cầu (HTTP request)** lên **server** để tải về **toàn bộ tài nguyên HTML, CSS, và JavaScript mới**.

Mỗi trang trên website là **một file HTML riêng biệt**, và việc điều hướng giữa các trang là thông qua **các liên kết (links)** đến các file đó.

### 🔹 Cách hoạt động của MPA

- Khi người dùng truy cập một trang mới:
  1. Trình duyệt gửi request đến server.
  2. Server phản hồi lại bằng **một file HTML hoàn chỉnh mới**.
  3. Trình duyệt tải lại toàn bộ nội dung trang, bao gồm cả CSS, JS, và hình ảnh.

### 🔹 Ví dụ minh họa

Giả sử bạn vào trang báo **VNExpress**:

- Khi click vào một bài viết khác, trang sẽ **reload hoàn toàn**.
- Nếu bạn mở tab **Network** trong **DevTools**, bạn sẽ thấy trình duyệt gửi một request và nhận lại toàn bộ file HTML mới.
- Những phần giống nhau (như header, footer) cũng bị tải lại — làm **tốn băng thông và thời gian tải**.

### 🔹 Demo MPA đơn giản

**Tạo website MPA cơ bản gồm 2 trang:**

```
index.html
about.html
style.css
script.js
```

**index.html**

```html
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <title>Trang chủ - MPA Demo</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <h1>Chào mừng đến với trang chủ!</h1>
    <a href="about.html">Đi đến trang giới thiệu</a>
  </body>
</html>
```

**about.html**

```html
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <title>Giới thiệu - MPA Demo</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <h1>Trang giới thiệu</h1>
    <a href="index.html">Quay lại trang chủ</a>
  </body>
</html>
```

➡ Khi bấm chuyển trang, trình duyệt **load lại toàn bộ nội dung** — đó là cách hoạt động của MPA.

### 🔹 Ưu điểm và nhược điểm

| Ưu điểm                                   | Nhược điểm                              |
| ----------------------------------------- | --------------------------------------- |
| Tối ưu SEO tốt do mỗi trang là HTML riêng | Tốc độ tải chậm do reload toàn bộ trang |
| Dễ triển khai trên server truyền thống    | Mất trạng thái khi chuyển trang         |
| Phù hợp cho website nhỏ (blog, tin tức)   | Trải nghiệm người dùng không mượt mà    |

---

## **2. Khái niệm SPA (Single Page Application)**

### 🔹 SPA là gì?

**SPA (Single Page Application)** là ứng dụng web chỉ có **một file HTML duy nhất**, được tải **một lần duy nhất** khi khởi động.

Sau đó, các **thay đổi nội dung** hoặc **chuyển trang** được thực hiện bằng **JavaScript (thường là React, Vue hoặc Angular)** — mà **không cần reload lại toàn bộ trang**.

### 🔹 Cách hoạt động của SPA

1. Khi người dùng truy cập lần đầu → trình duyệt tải `index.html`, các file CSS/JS.
2. Khi chuyển giữa các phần (ví dụ “Home” → “About”) → trình duyệt **không tải lại HTML**, mà chỉ **render lại phần nội dung cần thiết**.
3. Các dữ liệu được lấy từ server thông qua **API (JSON)**, không phải HTML.

### 🔹 Minh họa khác biệt giữa MPA và SPA

| Đặc điểm                     | MPA                    | SPA                              |
| ---------------------------- | ---------------------- | -------------------------------- |
| Cấu trúc                     | Nhiều file HTML        | Một file HTML duy nhất           |
| Request mỗi lần chuyển trang | Có (toàn bộ trang mới) | Không (chỉ request dữ liệu JSON) |
| Tốc độ                       | Chậm hơn               | Nhanh hơn                        |
| Framework phổ biến           | PHP, JSP, ASP.NET      | React, Vue, Angular              |

### 🔹 Demo SPA đơn giản

```html
<div id="app"></div>
<button onclick="navigate('home')">Trang chủ</button>
<button onclick="navigate('about')">Giới thiệu</button>

<script>
  function navigate(page) {
    const app = document.getElementById("app");
    if (page === "home") app.innerHTML = "<h1>Trang chủ</h1>";
    else if (page === "about") app.innerHTML = "<h1>Giới thiệu</h1>";
  }
  navigate("home");
</script>
```

👉 Khi bấm nút, nội dung thay đổi **ngay lập tức**, **không reload trang**.

---

## **3. Giới thiệu React và cách sử dụng cơ bản**

### **3.1 React là gì?**

- **React** là **thư viện JavaScript** được phát triển bởi **Facebook (Meta)**, dùng để xây dựng **giao diện người dùng (UI)**, đặc biệt là các **SPA**.
- Hoạt động theo tư duy **Component-Based** — chia giao diện thành nhiều khối nhỏ (component) dễ quản lý, tái sử dụng.
- React chỉ tập trung vào phần **View (V)** trong mô hình **MVC**.

### 🔹 So sánh React với các framework khác

| Tiêu chí         | React      | Vue.js        | Angular          |
| ---------------- | ---------- | ------------- | ---------------- |
| Loại             | Thư viện   | Framework nhẹ | Framework đầy đủ |
| Mức độ linh hoạt | Rất cao    | Trung bình    | Cứng nhắc hơn    |
| Dễ học           | Trung bình | Dễ            | Khó hơn          |
| Hệ sinh thái     | Rất lớn    | Vừa           | Lớn (enterprise) |

---

### **3.2 Import React bằng CDN (Cách truyền thống)**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>React CDN Demo</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="text/babel">
      function Hello() {
        return <h1>Xin chào React!</h1>;
      }
      ReactDOM.render(<Hello />, document.getElementById("root"));
    </script>
  </body>
</html>
```

📌 **Giải thích:**

- `root` là nơi React render toàn bộ ứng dụng.
- `ReactDOM.render()` sẽ chèn component `Hello` vào thẻ `<div id="root">`.
- Không reload lại trang khi nội dung thay đổi.

---

### **3.3 Demo cơ bản về Component và State**

```jsx
import React, { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h2>Bạn đã bấm {count} lần</h2>
      <button onClick={() => setCount(count + 1)}>Tăng</button>
    </div>
  );
}

export default Counter;
```

👉 Khi bạn bấm nút, React chỉ cập nhật phần tử thay đổi (state `count`), **không reload lại toàn bộ DOM**.

---

## **4. Cài đặt và khởi tạo dự án React với Vite**

### **4.1 Cài đặt Node.js**

- Truy cập: [https://nodejs.org](https://nodejs.org)
- Cài bản LTS.
- Kiểm tra sau khi cài:

```bash
node -v
npm -v
```

---

### **4.2 Khởi tạo ứng dụng React bằng Vite**

```bash
npm create vite@latest my-app
cd my-app
npm install
npm run dev
```

Khi chạy, bạn sẽ thấy ứng dụng React khởi động tại `http://localhost:5173`.

---

### **4.3 Cấu trúc thư mục của dự án React**

```
my-app/
│
├── index.html              # File HTML gốc (chỉ có <div id="root">)
├── package.json            # Quản lý dependencies & scripts
├── vite.config.js          # Cấu hình build của Vite
└── src/
    ├── main.jsx            # Entry point render <App />
    ├── App.jsx             # Component chính
    └── assets/             # Thư mục chứa hình ảnh, CSS, ...
```

📌 Trong `main.jsx`:

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

---

### **4.4 Chạy và Build ứng dụng**

- **Chạy ở môi trường dev:**

  ```bash
  npm run dev
  ```

  → Mở trình duyệt tại `localhost:5173`.

- **Build cho production:**
  ```bash
  npm run build
  ```
  → Tạo thư mục `dist/` chứa bản tối ưu.

---

### **4.5 Các khái niệm React cơ bản**

| Khái niệm          | Mô tả                                                 |
| ------------------ | ----------------------------------------------------- |
| **Component**      | Khối giao diện nhỏ, tái sử dụng được                  |
| **Props**          | Truyền dữ liệu từ component cha xuống con             |
| **State**          | Trạng thái nội bộ, dùng để quản lý dữ liệu động       |
| **Event Handling** | Xử lý sự kiện người dùng (`onClick`, `onChange`, ...) |
| **Hooks cơ bản**   | `useState`, `useEffect`, `useContext`, ...            |

---

## ✅ **Tổng kết**

- MPA: Mỗi trang là một file HTML riêng, reload toàn bộ mỗi lần chuyển trang.
- SPA: Chỉ có một HTML duy nhất, mọi thay đổi đều render trên client → nhanh và mượt.
- React: Thư viện xây dựng UI theo hướng component, tối ưu cho SPA.
- Vite: Công cụ tạo và chạy dự án React nhanh hơn `create-react-app`.
