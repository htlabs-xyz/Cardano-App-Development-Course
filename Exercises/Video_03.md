# 📘 Video 3: Fullstacks framework

## 📝 Bài tập 1: Tạo dự án Next.js cơ bản

### Đề bài

Tạo một ứng dụng Next.js cơ bản hiển thị trang chủ với tiêu đề "Chào mừng đến với Next.js".

### Yêu cầu

- Sử dụng lệnh tạo dự án Next.js.
- Tạo trang chủ (`page.tsx`) hiển thị tiêu đề.
- Chạy ứng dụng và kiểm tra trên trình duyệt.
- Đảm bảo sử dụng TypeScript.

<details>
<summary>Cách giải</summary>

1. **Khởi tạo dự án**:
   - Cài Node.js (phiên bản 18 trở lên) và npm.
   - Chạy lệnh: `npx create-next-app@latest my-next-app`.
   - Chọn các tùy chọn: TypeScript, App Router, và các cấu hình mặc định khác.
   - Di chuyển vào thư mục: `cd my-next-app` và chạy: `npm install`.
2. **Tạo trang chủ**:
   - Sửa file `app/page.tsx` để hiển thị tiêu đề.
3. **Chạy ứng dụng**:
   - Chạy: `npm run dev` và kiểm tra tại `http://localhost:3000`.

### Đáp án

Tạo dự án:

```bash
npx create-next-app@latest my-next-app
```

Sửa file `app/page.tsx`:

```tsx
export default function Home() {
  return (
    <div>
      <h1>Chào mừng đến với Next.js</h1>
    </div>
  );
}
```

Chạy `npm run dev`, truy cập `http://localhost:3000` để thấy tiêu đề "Chào mừng đến với Next.js".

</details>

---

## 📝 Bài tập 2: Tạo layout chung cho ứng dụng

### Đề bài

Tạo một layout chung cho ứng dụng Next.js, bao gồm header và footer áp dụng cho tất cả các trang.

### Yêu cầu

- Tạo file `layout.tsx` trong thư mục `app`.
- Thêm header với tiêu đề "My App" và footer với nội dung "© 2025 My App".
- Đảm bảo các trang con kế thừa layout này.
- Áp dụng CSS cơ bản để định dạng.

<details>
<summary>Cách giải</summary>

1. **Tạo layout**:
   - Sửa file `app/layout.tsx` để định nghĩa layout chung.
   - Thêm thẻ `<header>` và `<footer>`, sử dụng `{children}` để render các trang con.
2. **Thêm CSS**:
   - Sử dụng file `app/globals.css` để định dạng header và footer.
3. **Kiểm tra**:
   - Đảm bảo trang chủ (`page.tsx`) hiển thị trong layout.

### Đáp án

Sửa file `app/layout.tsx`:

```tsx
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <header>
          <h1>My App</h1>
        </header>
        <main>{children}</main>
        <footer>© 2025 My App</footer>
      </body>
    </html>
  );
}
```

Sửa file `app/globals.css`:

```css
header {
  background-color: #333;
  color: white;
  padding: 10px;
  text-align: center;
}

footer {
  background-color: #333;
  color: white;
  padding: 10px;
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 100%;
}

main {
  padding: 20px;
}
```

Chạy `npm run dev`, truy cập `http://localhost:3000` để thấy layout với header và footer bao quanh nội dung trang chủ.

</details>

---

## 📝 Bài tập 3: Tạo trang About với Dynamic Routing

### Đề bài

Tạo một trang "About" với dynamic routing để hiển thị thông tin chi tiết dựa trên ID.

### Yêu cầu

- Tạo một trang `/about/[id]` hiển thị thông tin dựa trên ID từ URL.
- Sử dụng `useParams` để lấy ID.
- Hiển thị thông báo lỗi nếu ID không hợp lệ.
- Áp dụng CSS để trang trông đẹp mắt.

<details>
<summary>Cách giải</summary>

1. **Tạo dynamic route**:
   - Tạo thư mục `app/about/[id]` và file `page.tsx` trong đó.
   - Sử dụng `useParams` để lấy ID từ URL.
2. **Xử lý logic**:
   - Dùng mảng dữ liệu giả lập để tìm thông tin theo ID.
   - Nếu không tìm thấy ID, hiển thị thông báo lỗi.
3. **Thêm CSS**:
   - Sử dụng inline CSS hoặc file CSS riêng để định dạng.

### Đáp án

Tạo file `app/about/[id]/page.tsx`:

```tsx
"use client";
import { useParams } from "next/navigation";

export default function AboutPage() {
  const params = useParams();
  const id = params.id;

  const data = [
    { id: "1", content: "Thông tin về mục 1" },
    { id: "2", content: "Thông tin về mục 2" },
  ];

  const item = data.find((item) => item.id === id);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {item ? (
        <div>
          <h2>Chi tiết About</h2>
          <p>ID: {id}</p>
          <p>{item.content}</p>
        </div>
      ) : (
        <p style={{ color: "red" }}>Không tìm thấy thông tin cho ID: {id}</p>
      )}
    </div>
  );
}
```

Chạy `npm run dev`, truy cập `http://localhost:3000/about/1` để thấy thông tin chi tiết, hoặc `http://localhost:3000/about/999` để thấy thông báo lỗi.

</details>

---

## 📝 Bài tập 4: Tạo API Route trong Next.js

### Đề bài

Tạo một API route để trả về danh sách tasks từ server.

### Yêu cầu

- Tạo API route tại `/api/tasks` trả về danh sách tasks ở định dạng JSON.
- Tạo trang hiển thị danh sách tasks bằng cách fetch dữ liệu từ API route.
- Sử dụng `useEffect` và `useState` để quản lý dữ liệu ở client-side.
- Định dạng danh sách bằng CSS.

<details>
<summary>Cách giải</summary>

1. **Tạo API route**:
   - Tạo file `app/api/tasks/route.ts` để định nghĩa API trả về danh sách tasks.
2. **Tạo trang hiển thị**:
   - Sửa file `app/page.tsx` để fetch dữ liệu từ `/api/tasks` và hiển thị danh sách.
   - Sử dụng `useEffect` để gọi API khi trang được tải.
3. **Thêm CSS**:
   - Dùng `globals.css` để định dạng danh sách.

### Đáp án

Tạo file `app/api/tasks/route.ts`:

```ts
import { NextResponse } from "next/server";

const tasks = [
  { id: 1, title: "Task 1", description: "Mô tả task 1" },
  { id: 2, title: "Task 2", description: "Mô tả task 2" },
];

export async function GET() {
  return NextResponse.json(tasks);
}
```

Sửa file `app/page.tsx`:

```tsx
"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      const response = await fetch("/api/tasks");
      const data = await response.json();
      setTasks(data);
    }
    fetchTasks();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Danh sách Tasks</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task: any) => (
          <li
            key={task.id}
            style={{
              margin: "10px 0",
              padding: "10px",
              border: "1px solid #ccc",
            }}
          >
            <h3>{task.title}</h3>
            <p>{task.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

Chạy `npm run dev`, truy cập `http://localhost:3000` để thấy danh sách tasks, và `http://localhost:3000/api/tasks` để kiểm tra API trả về JSON.

</details>

---

## 📝 Bài tập 5: Phân biệt Server-side và Client-side trong Next.js

### Đề bài

Tạo một trang hiển thị thông tin task chi tiết, với logic xử lý ở cả server-side và client-side, và so sánh sự khác biệt.

### Yêu cầu

- Tạo trang `/tasks/[id]` hiển thị chi tiết task theo ID.
- Triển khai logic server-side (dùng `getServerSideProps` hoặc API route) và client-side (dùng `useEffect`).
- Hiển thị console log để kiểm tra logic chạy ở server hay client.
- Đưa ra ưu/nhược điểm của mỗi cách.

<details>
<summary>Cách giải</summary>

1. **Server-side**:
   - Tạo API route `/api/tasks/[id]` để trả về chi tiết task.
   - Tạo trang `/tasks/[id]` dùng server-side để fetch dữ liệu từ API.
2. **Client-side**:
   - Tạo trang `/tasks/[id]` dùng `useEffect` để fetch dữ liệu từ API.
3. **Console log**:
   - Thêm `console.log` trong API route (server) và `useEffect` (client).
4. **So sánh**:
   - Server-side: Bảo mật hơn, tốt cho SEO, nhưng tải chậm hơn.
   - Client-side: Nhanh hơn khi chuyển trang, nhưng logic lộ trên trình duyệt.

### Đáp án

Tạo file `app/api/tasks/[id]/route.ts`:

```ts
import { NextResponse } from "next/server";

const tasks = [
  { id: "1", title: "Task 1", description: "Mô tả task 1" },
  { id: "2", title: "Task 2", description: "Mô tả task 2" },
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log("Server-side: Fetching task with ID:", params.id);
  const task = tasks.find((t) => t.id === params.id);
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }
  return NextResponse.json(task);
}
```

**Client-side**: Tạo file `app/tasks/[id]/page.tsx`:

```tsx
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function TaskDetail() {
  const params = useParams();
  const id = params.id;
  const [task, setTask] = useState(null);

  useEffect(() => {
    console.log("Client-side: Fetching task with ID:", id);
    async function fetchTask() {
      const response = await fetch(`/api/tasks/${id}`);
      const data = await response.json();
      setTask(data);
    }
    fetchTask();
  }, [id]);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {task && !task.error ? (
        <div>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
        </div>
      ) : (
        <p style={{ color: "red" }}>Không tìm thấy task với ID: {id}</p>
      )}
    </div>
  );
}
```

**Server-side**: Tạo file `app/tasks/[id]/server/page.tsx`:

```tsx
import { notFound } from "next/navigation";

async function fetchTask(id: string) {
  console.log("Server-side: Fetching task with ID:", id);
  const response = await fetch(`http://localhost:3000/api/tasks/${id}`);
  const data = await response.json();
  return data;
}

export default async function TaskDetail({
  params,
}: {
  params: { id: string };
}) {
  const task = await fetchTask(params.id);

  if (task.error) {
    notFound();
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
    </div>
  );
}
```

**So sánh**:

- **Server-side**: Logic chạy trên server, console log xuất hiện trong terminal dự án. Ưu điểm: Bảo mật, tốt cho SEO. Nhược điểm: Tải chậm hơn do request server.
- **Client-side**: Logic chạy trên trình duyệt, console log xuất hiện trong tab Console của trình duyệt. Ưu điểm: Nhanh khi chuyển trang. Nhược điểm: Logic lộ, không tốt cho SEO nếu không tối ưu.

Chạy `npm run dev`, truy cập `http://localhost:3000/tasks/1` (client-side) và `http://localhost:3000/tasks/1/server` (server-side) để kiểm tra.

</details>

---
