# Video 02: Frontend framework and library 

---

### **1. Khái niệm MPA (Multi-Page Application) là gì?**

- Giải thích khái niệm MPA (ứng dụng nhiều trang) và cách hoạt động của nó.
- Đặc điểm của MPA: mỗi lần chuyển trang, trình duyệt tải lại toàn bộ tài nguyên.
- **Demo:** Tạo một trang web MPA đơn giản với HTML, CSS, JS (sử dụng nhiều file HTML liên kết với nhau).
- Nhược điểm của MPA so với SPA: tốc độ tải chậm hơn do phải load lại trang.

---

### **2. Khái niệm SPA (Single Page Application) là gì?**

- Giải thích khái niệm SPA (ứng dụng một trang) và cách hoạt động.
- **Demo:** Hiển thị một trang web SPA và chỉ ra sự khác biệt so với MPA khi thao tác trên giao diện.
- So sánh hiệu năng và cấu trúc hoạt động:
    - MPA: chạy trên server, mỗi lần chuyển trang phải gửi request và nhận response mới.
    - SPA: tải một lần, sau đó cập nhật giao diện trên client mà không cần load lại trang.
- Các công nghệ phổ biến để xây dựng SPA: React, Vue, Angular.

---

### **3. Giới thiệu React và cách sử dụng cơ bản**

### **3.1 React là gì?**

- React là một thư viện JavaScript dùng để xây dựng giao diện người dùng, đặc biệt là ứng dụng SPA.
- Được phát triển bởi Facebook (Meta).
- Tư duy component-based giúp tổ chức mã dễ dàng, tái sử dụng tốt hơn.
- So sánh với các framework khác:
    - **React vs Vue.js:** Vue dễ học hơn, nhưng React có hệ sinh thái lớn hơn.
    
    - **React vs Angular:** Angular mạnh về enterprise-level, nhưng React linh hoạt hơn.

### **3.2 Import thư viện React vào HTML (Cách truyền thống)**

- Sử dụng `<script>` để nhúng React vào file HTML (React CDN).
- **Demo:**
    - Tạo một file HTML, nhúng React thông qua CDN.
    - Viết một component React đơn giản trong file JS và hiển thị nó trong HTML.
    - Giải thích cách React render vào `root` trong DOM.

### **3.3 Demo cơ bản về React Component**

- Giới thiệu khái niệm **Component** trong React.
- Viết một **Functional Component** đơn giản.
- Thực hiện thao tác thay đổi trạng thái (`useState`).
- Giải thích cách React cập nhật giao diện mà không reload trang.

---

### **4. Cài đặt và khởi tạo dự án React với Create React App**

### **4.1 Tạo ứng dụng React bằng `create-react-app`**

- Giải thích công cụ `npx` và `create-react-app`.
- Chạy lệnh:
    
    ```bash
    npx create-react-app my-app
    cd my-app
    npm start
    
    ```
    
- Các tham số quan trọng khi tạo dự án.

### **4.2 Cấu trúc thư mục của một dự án React**

- **Giới thiệu các file quan trọng:**
    - `public/index.html`: file gốc chứa `<div id="root"></div>`.
    - `src/index.js`: entry point, render ứng dụng vào `<div id="root">`.
    - `src/App.js`: component chính của ứng dụng.
- Cách tổ chức thư mục hợp lý trong dự án React.

### **4.3 Chạy và build dự án**

- `npm start`: chạy dự án ở chế độ development (mặc định trên cổng `localhost:3000`).
- `npm run build`: tạo bản build tối ưu cho production.
- Giải thích cách React tạo bundle và tối ưu hiệu năng khi build.

### **4.4 Demo các thành phần quan trọng của một ứng dụng React**

- **Component-based:** tạo nhiều component và truyền dữ liệu giữa chúng.
- **Props & State:** cách truyền dữ liệu trong React.
- **Event Handling:** xử lý sự kiện trong React.
- **Hooks cơ bản:** `useState`, `useEffect`.
