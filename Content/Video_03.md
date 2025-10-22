# Video 03: Fullstacks framework Nextjs

## 1. Next.js Là Gì?

Next.js là một framework dựa trên React, cung cấp các tính năng mạnh mẽ để phát triển ứng dụng web hiệu suất cao, tối ưu SEO và dễ dàng mở rộng. Một số tính năng nổi bật bao gồm:

- **Server-Side Rendering (SSR)**: Render trang trên server, cải thiện SEO và tốc độ tải trang.
- **Static Site Generation (SSG)**: Tạo trang tĩnh tại thời điểm build, lý tưởng cho các trang nội dung cố định.
- **Incremental Static Regeneration (ISR)**: Cập nhật nội dung tĩnh mà không cần rebuild toàn bộ ứng dụng.
- **API Routes**: Cho phép tạo API endpoints ngay trong dự án.
- **Server Components**: Giảm tải JavaScript trên client, tăng hiệu suất.
- **Tối ưu hóa tài nguyên**: Hỗ trợ tối ưu hình ảnh, font, và script.
- **Middleware**: Xử lý request trước khi đến route.

### **Ưu điểm so với React thuần**

- **Routing tích hợp**: Không cần thư viện bổ sung như React Router.
- **Hiệu suất cao**: Kết hợp SSR và SSG giúp giảm tải cho trình duyệt.
- **Full-stack development**: Hỗ trợ xây dựng cả front-end và back-end trong cùng một dự án.
- **SEO thân thiện**: Nội dung được render trước khi gửi đến client.

## 2. Thiết Lập Môi Trường và Khởi Tạo Dự Án

### **Yêu cầu môi trường**

- **Node.js**: Phiên bản 18 hoặc cao hơn.
- **IDE**: VS Code hoặc bất kỳ IDE nào hỗ trợ JavaScript/TypeScript.
- **Tài khoản cloud**: Vercel, Netlify, hoặc Cloudflare Pages để triển khai.

### **Cài đặt Next.js**

Chạy lệnh sau để tạo dự án Next.js:

```bash
npx create-next-app@latest my-app
```

Lệnh này sẽ hỏi bạn một số tùy chọn:

- **TypeScript** (`-ts`): Sử dụng TypeScript để kiểm tra kiểu dữ liệu.
- **Tailwind CSS** (`-tailwind`): Tích hợp Tailwind CSS để tạo giao diện nhanh.
- **ESLint** (`-eslint`): Kiểm tra lỗi code trong quá trình phát triển.

Sau khi cài đặt, di chuyển vào thư mục dự án và chạy:

```bash
cd my-app
npm run dev
```

Ứng dụng sẽ chạy trên `http://localhost:3000`. Để đổi port, bạn có thể chỉnh trong `next.config.js`:

```javascript
module.exports = {
  port: 4000,
};
```

Hoặc chạy lệnh:

```bash
PORT=4000 npm run dev
```

### **Cấu trúc thư mục**

Cấu trúc thư mục cơ bản của một dự án Next.js (sử dụng App Router trong Next.js 13+):

- **`app/`**: Chứa các route và logic chính của ứng dụng.
- **`components/`**: Các component React tái sử dụng.
- **`public/`**: Tài nguyên tĩnh như hình ảnh, font.
- **`styles/`**: File CSS toàn cục (ví dụ: `global.css`).
- **`next.config.js`**: Cấu hình dự án.
- **`package.json`**: Quản lý dependencies và scripts.
- **`.env`**: Lưu biến môi trường.

Các file quan trọng trong thư mục `app/`:

- **`page.tsx`**: Định nghĩa nội dung của một route.
- **`layout.tsx`**: Định nghĩa bố cục chung cho các trang.
- **`not-found.tsx`**: Trang hiển thị khi route không tồn tại.

## 3. Hệ Thống Routing Trong Next.js

Next.js sử dụng **App Router** (từ Next.js 13) để quản lý routing dựa trên cấu trúc thư mục trong `app/`. Một số khái niệm cơ bản:

- **Page**: Mỗi file `page.tsx` trong thư mục `app/` tương ứng với một route. Ví dụ: `app/about/page.tsx` tạo route `/about`.
- **Layout**: File `layout.tsx` định nghĩa bố cục chung cho một nhóm route. Ví dụ:
  ```tsx
  export default function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div>
        <header>My Header</header>
        {children}
        <footer>My Footer</footer>
      </div>
    );
  }
  ```
- **Dynamic Routing**: Tạo route động bằng cách sử dụng thư mục với tên trong dấu ngoặc vuông, ví dụ: `app/post/[id]/page.tsx`. Để lấy tham số động:

  ```tsx
  import { useParams } from "next/navigation";

  export default function PostPage() {
    const params = useParams();
    const { id } = params;
    return <div>Post ID: {id}</div>;
  }
  ```

- **Group Routing**: Sử dụng dấu ngoặc tròn `(group)` để gộp các route mà không ảnh hưởng đến URL. Ví dụ: `app/(auth)/login/page.tsx` tạo route `/login`.
- **Private Folders**: Sử dụng dấu gạch dưới `_folder` để ẩn thư mục khỏi routing.

## 4. Client Component vs Server Component

### **Client Component**

- Được đánh dấu bằng directive `"use client"`.
- Chạy trên trình duyệt, sử dụng các React hooks như `useState`, `useEffect`.
- Phù hợp cho các tác vụ tương tác với trình duyệt (ví dụ: `window`, `localStorage`).
- **Nhược điểm**: Tăng kích thước JavaScript bundle, có thể ảnh hưởng đến SEO.
- **Ví dụ**:

  ```tsx
  "use client";
  import { useState, useEffect } from "react";

  export default function ClientComponent() {
    const [data, setData] = useState(null);

    useEffect(() => {
      fetch("/api/tasks")
        .then((res) => res.json())
        .then((data) => setData(data));
    }, []);

    return <div>{data ? JSON.stringify(data) : "Loading..."}</div>;
  }
  ```

### **Server Component**

- Mặc định trong Next.js (không cần directive).
- Render trên server, không gửi JavaScript đến client.
- Hỗ trợ `async/await` trực tiếp trong component.
- **Ưu điểm**: Giảm tải cho client, cải thiện SEO và hiệu suất.
- **Ví dụ**:

  ```tsx
  async function fetchTasks() {
    const res = await fetch("http://localhost:3000/api/tasks");
    return res.json();
  }

  export default async function ServerComponent() {
    const tasks = await fetchTasks();
    return <div>{JSON.stringify(tasks)}</div>;
  }
  ```

## 5. Data Fetching Trong Next.js

- **Server Component**: Sử dụng `fetch` để lấy dữ liệu trực tiếp trên server:

  ```tsx
  async function getData() {
    const res = await fetch("https://api.example.com/data", {
      cache: "force-cache",
    });
    return res.json();
  }

  export default async function Page() {
    const data = await getData();
    return <div>{data.name}</div>;
  }
  ```

- **Client Component**: Sử dụng thư viện như `useSWR` để fetch và revalidate dữ liệu:

  ```tsx
  "use client";
  import useSWR from "swr";

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  export default function ClientPage() {
    const { data, error } = useSWR("/api/tasks", fetcher);
    if (error) return <div>Error loading data</div>;
    if (!data) return <div>Loading...</div>;
    return <div>{JSON.stringify(data)}</div>;
  }
  ```

## 6. Tạo API Routes

Next.js cho phép tạo API endpoints trong thư mục `app/api/`. Ví dụ, tạo API để quản lý danh sách công việc (tasks):

```tsx
// app/api/tasks/route.ts
import { NextResponse } from "next/server";

const tasks = [
  { id: 1, title: "Task 1" },
  { id: 2, title: "Task 2" },
];

export async function GET() {
  return NextResponse.json(tasks);
}
```

- Truy cập API tại: `http://localhost:3000/api/tasks`.
- Hỗ trợ các phương thức HTTP: `GET`, `POST`, `PUT`, `DELETE`, v.v.
- **Bảo mật**: Sử dụng Middleware hoặc NextAuth để bảo vệ API.

## 7. Triển Khai Ứng Dụng Next.js

- **Build dự án**:
  ```bash
  npm run build
  ```
- **Chạy production**:
  ```bash
  npm run start
  ```
- **Triển khai lên Vercel**:
  1. Đăng ký tài khoản trên [Vercel](https://vercel.com).
  2. Liên kết dự án với repository Git (GitHub, GitLab, Bitbucket).
  3. Chạy lệnh:
     ```bash
     vercel
     ```
  4. Vercel tự động build và deploy ứng dụng.
- **Các nền tảng khác**: Netlify, Cloudflare Pages, hoặc server riêng (cần cấu hình `next start`).

## 8. Kết Luận

Next.js là một công cụ mạnh mẽ để xây dựng ứng dụng full-stack với hiệu suất cao, SEO tốt và khả năng mở rộng linh hoạt. Bằng cách tận dụng Server Components, API Routes, và các tính năng như SSR/SSG, bạn có thể tạo ra các ứng dụng hiện đại, tối ưu cho cả người dùng và nhà phát triển.

Hãy bắt đầu với Next.js bằng cách tạo một dự án mẫu, khám phá các tính năng routing, và thử triển khai lên Vercel để trải nghiệm quy trình phát triển full-stack hoàn chỉnh!
