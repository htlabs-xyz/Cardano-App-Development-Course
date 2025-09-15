# 📘 Video 2: Frontend framework and library

---
## 📝 Bài tập 1: So sánh MPA và SPA

### Đề bài

Giải thích sự khác biệt giữa MPA (Multi-Page Application) và SPA (Single-Page Application) dựa trên cách chúng hoạt động và hiệu suất.

### Yêu cầu

- Mô tả cách MPA và SPA xử lý yêu cầu và hiển thị nội dung.
- Liệt kê ít nhất 2 ưu điểm và 2 nhược điểm của mỗi loại.
- Đưa ra ví dụ thực tế cho từng loại ứng dụng.

### Cách giải

1. **Cách hoạt động**:
   - **MPA**: Mỗi lần chuyển trang, trình duyệt gửi yêu cầu đến server, server trả về file HTML mới cùng các tài nguyên (CSS, JS), tải lại toàn bộ trang.
   - **SPA**: Tải một trang HTML duy nhất ban đầu, các thay đổi nội dung được xử lý bằng JavaScript trên trình duyệt, sử dụng dữ liệu (thường là JSON) để cập nhật giao diện.
2. **Ưu và nhược điểm**:
   - **MPA**:
     - **Ưu điểm**: Dễ phát triển cho website đơn giản; tốt cho SEO vì mỗi trang có nội dung riêng.
     - **Nhược điểm**: Tốc độ tải chậm do tải lại toàn bộ trang; trải nghiệm người dùng kém mượt mà.
   - **SPA**:
     - **Ưu điểm**: Tốc độ phản hồi nhanh, trải nghiệm mượt; giảm tải server vì chỉ gửi dữ liệu cần thiết.
     - **Nhược điểm**: Phức tạp hơn khi phát triển; SEO cần tối ưu thêm.
3. **Ví dụ**:
   - MPA: Trang tin tức như Vietnam Express.
   - SPA: Ứng dụng như Gmail hoặc Trello.

### Đáp án

- **MPA**: Mỗi yêu cầu trả về một trang HTML mới, tải lại toàn bộ tài nguyên. Ví dụ: Vietnam Express. **Ưu điểm**: Dễ phát triển, tốt cho SEO. **Nhược điểm**: Tốc độ chậm, trải nghiệm kém mượt.
- **SPA**: Tải một trang HTML ban đầu, dùng JavaScript để cập nhật nội dung. Ví dụ: Gmail. **Ưu điểm**: Nhanh, mượt mà. **Nhược điểm**: Phức tạp, SEO cần tối ưu.

---

## 📝 Bài tập 2: Tạo ứng dụng React cơ bản

### Đề bài

Tạo một ứng dụng React đơn giản hiển thị dòng chữ "Chào mừng đến với React" trên giao diện.

### Yêu cầu

- Sử dụng Vite để tạo dự án React.
- Tạo component `Welcome` hiển thị dòng chữ trên.
- Chạy ứng dụng và kiểm tra trên trình duyệt.

### Cách giải

1. **Khởi tạo dự án**:
   - Cài Node.js và npm.
   - Chạy lệnh: `npm create vite@latest my-react-app -- --template react`.
   - Di chuyển vào thư mục: `cd my-react-app` và cài dependencies: `npm install`.
2. **Tạo component Welcome**:
   - Tạo file `Welcome.jsx` trong thư mục `src`.
   - Viết mã JSX để hiển thị dòng chữ.
3. **Sử dụng component**:
   - Sửa file `App.jsx` để import và render `Welcome`.
4. **Chạy ứng dụng**:
   - Chạy: `npm run dev` và kiểm tra tại `http://localhost:5173`.

### Đáp án

Tạo file `src/Welcome.jsx`:

```jsx
function Welcome() {
  return <h1>Chào mừng đến với React</h1>;
}
export default Welcome;
```

Sửa file `src/App.jsx`:

```jsx
import Welcome from "./Welcome";

function App() {
  return (
    <div>
      <Welcome />
    </div>
  );
}
export default App;
```

Chạy `npm run dev`, truy cập `http://localhost:5173` để thấy dòng chữ "Chào mừng đến với React".

---

## 📝 Bài tập 3: Tạo component tái sử dụng trong React

### Đề bài

Tạo component `Button` tái sử dụng với nội dung và màu sắc tùy chỉnh.

### Yêu cầu

- Component `Button` nhận props: `text` (nội dung) và `color` (màu nền).
- Sử dụng component trong `App.jsx` để hiển thị 3 nút với nội dung và màu sắc khác nhau.
- Áp dụng CSS để nút có giao diện đẹp.

### Cách giải

1. **Tạo component Button**:
   - Tạo file `Button.jsx` trong thư mục `src`.
   - Dùng props `text` và `color`, áp dụng style inline hoặc CSS.
2. **Sử dụng trong App**:
   - Trong `App.jsx`, import và render 3 lần `Button` với props khác nhau.
3. **Thêm CSS**:
   - Tạo file `Button.css` hoặc dùng inline style để định dạng.

### Đáp án

Tạo file `src/Button.jsx`:

```jsx
import "./Button.css";

function Button({ text, color }) {
  return (
    <button style={{ backgroundColor: color }} className="custom-button">
      {text}
    </button>
  );
}
export default Button;
```

Tạo file `src/Button.css`:

```css
.custom-button {
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 16px;
  cursor: pointer;
}
```

Sửa file `src/App.jsx`:

```jsx
import Button from "./Button";

function App() {
  return (
    <div>
      <Button text="Nút Xanh" color="blue" />
      <Button text="Nút Đỏ" color="red" />
      <Button text="Nút Xám" color="gray" />
    </div>
  );
}
export default App;
```

Chạy `npm run dev` để xem 3 nút với màu sắc và nội dung khác nhau.

---

## 📝 Bài tập 4: Hiểu cấu trúc dự án React

### Đề bài

Phân tích cấu trúc thư mục của dự án React tạo bằng Vite và giải thích vai trò các file chính.

### Yêu cầu

- Liệt kê các file/thư mục chính.
- Giải thích chức năng của `package.json`, `index.html`, `main.jsx`, `App.jsx`.
- Ví dụ cách thêm file CSS vào dự án.

### Cách giải

1. **Cấu trúc thư mục**:
   - Dự án React với Vite có thư mục `src`, `public`, và các file như `package.json`, `vite.config.js`, `index.html`.
2. **Chức năng file**:
   - `package.json`: Quản lý dependencies và scripts.
   - `index.html`: File HTML gốc, chứa `<div id="root">`.
   - `main.jsx`: Khởi tạo ứng dụng, render `App` vào `#root`.
   - `App.jsx`: Component chính, chứa giao diện và logic.
3. **Thêm CSS**:
   - Tạo file CSS trong `src` và import vào component.

### Đáp án

- **Cấu trúc thư mục**:
  ```
  my-react-app/
  ├── node_modules/
  ├── public/
  ├── src/
  │   ├── App.jsx
  │   ├── main.jsx
  │   ├── index.css
  ├── index.html
  ├── package.json
  ├── vite.config.js
  ```
- **Chức năng file**:
  - `package.json`: Chứa thông tin dự án, dependencies, scripts như `npm run dev`.
  - `index.html`: File HTML chính, chứa `<div id="root">`.
  - `main.jsx`: Khởi tạo ứng dụng, render `App` vào `#root`.
  - `App.jsx`: Component chính, chứa giao diện và logic.
- **Ví dụ thêm CSS**:
  Tạo file `src/styles.css`:

  ```css
  body {
    background-color: #f0f0f0;
  }
  ```

  Import vào `main.jsx`:

  ```jsx
  import "./index.css";
  import "./styles.css";
  import { createRoot } from "react-dom/client";
  import App from "./App";

  const root = createRoot(document.getElementById("root"));
  root.render(<App />);
  ```

---

## 📝 Bài tập 5: Tạo danh sách động với React

### Đề bài

Tạo một ứng dụng React hiển thị danh sách các mục (items) từ một mảng dữ liệu.

### Yêu cầu

- Tạo component `ItemList` hiển thị danh sách các mục từ mảng.
- Mỗi mục hiển thị tên và một nút xóa.
- Khi nhấn nút xóa, mục đó bị xóa khỏi danh sách.
- Sử dụng state để quản lý danh sách.

### Cách giải

1. **Tạo component ItemList**:
   - Tạo file `ItemList.jsx` trong thư mục `src`.
   - Sử dụng hook `useState` để quản lý mảng dữ liệu.
   - Dùng hàm `map` để render danh sách, mỗi mục có nút xóa.
2. **Xử lý xóa mục**:
   - Thêm hàm xóa sử dụng `filter` để loại bỏ mục dựa trên index hoặc id.
3. **Sử dụng trong App**:
   - Import và render `ItemList` trong `App.jsx`.

### Đáp án

Tạo file `src/ItemList.jsx`:

```jsx
import { useState } from "react";

function ItemList() {
  const [items, setItems] = useState(["Mục 1", "Mục 2", "Mục 3"]);

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2>Danh sách mục</h2>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item}
            <button onClick={() => removeItem(index)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ItemList;
```

Sửa file `src/App.jsx`:

```jsx
import ItemList from "./ItemList";

function App() {
  return (
    <div>
      <ItemList />
    </div>
  );
}
export default App;
```

Chạy `npm run dev` để xem danh sách, nhấn nút "Xóa" để xóa từng mục.

---
