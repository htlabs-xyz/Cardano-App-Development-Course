# Video 03: Fullstacks framework

---

**1. Giới thiệu Next.js**

- **Next.js là gì?**
    - Next.js là một framework dựa trên React, hỗ trợ phát triển web với nhiều tính năng mạnh mẽ.
    - Cung cấp các cơ chế SSR (Server-Side Rendering), SSG (Static Site Generation), ISR (Incremental Static Regeneration), API Routes.
- **Ưu điểm của Next.js so với React.js thuần**
    - **Hiệu suất cao**: Kết hợp SSR, SSG giúp giảm tải cho client, tối ưu SEO.
    - **Tích hợp routing dễ dàng**: Không cần thư viện bổ sung như React Router.
    - **Hỗ trợ tốt cho Fullstack**: Có API Routes, Middleware, Server Actions.
    - **Hỗ trợ caching và revalidation**: Giúp tăng tốc độ phản hồi dữ liệu.
    - **Tích hợp Edge Functions**: Giúp xử lý request nhanh hơn ở nhiều khu vực địa lý.
- **Demo ứng dụng Next.js**
    - Chạy một ứng dụng Next.js mẫu, so sánh với một ứng dụng React thuần.
    - Giải thích quá trình SSR và CSR bằng DevTools.

---

### **2. Khởi tạo và Chạy Ứng Dụng Next.js**

- **Cài đặt Next.js**
    - `npx create-next-app@latest my-app`
    - Giải thích từng tham số như `-ts` (TypeScript), `-tailwind`, `-eslint`.
    - Cấu hình dự án ban đầu: TypeScript, Tailwind CSS, ShadCN UI, ESLint.
- **Chạy ứng dụng Next.js**
    - `npm run dev` hoặc `yarn dev` (mặc định chạy trên port 3000).
    - Cách đổi port (`next.config.js` hoặc dùng `PORT=4000 npm run dev`).
- **Cấu trúc thư mục trong Next.js**
    - **`app/` (Next.js 13+ sử dụng App Router)**
    - **Các thư mục quan trọng**: `components/`, `styles/`, `lib/`, `public/`, `api/`
    - **Giới thiệu các file chính**:
        - `layout.tsx`: Định nghĩa bố cục chung.
        - `global.css`: File CSS toàn cục.
        - `next.config.js`: Cấu hình dự án.

---

### **3. Hệ Thống Routing Trong Next.js**

- Cấu trúc thư mục `app/` và cách tạo route từ folder.
- `page.tsx`: Định nghĩa component tương ứng với route.
- `layout.tsx`: Định nghĩa layout chung cho từng nhóm route.
- **Dynamic Routing** (`[id]/page.tsx`, `[...slug]/page.tsx`).
- **Middleware**: Xử lý request trước khi đến page.

---

### **4. Client Component vs Server Component**

### **Client Component**

- **Rendering ở môi trường Client (`"use client"`)**
    - Chạy trên trình duyệt, sử dụng React hooks (`useState`, `useEffect`, ...).
    - Cần thiết khi sử dụng các API trình duyệt như `window`, `localStorage`, `navigator`.
- **Cách hoạt động**
    - React truyền tải component lên browser dưới dạng JavaScript.
    - Browser parse và thực thi để render UI.
- **Nhược điểm**
    - Tăng kích thước JavaScript bundle.
    - Ảnh hưởng đến hiệu suất và SEO.
- **Demo**
    - Viết một Client Component hiển thị danh sách dữ liệu từ API.

### **Server Component**

- **Rendering ở môi trường Server (`"use server"`)**
    - Được xử lý hoàn toàn trên server, không gửi JavaScript đến client.
    - Tương thích với React Suspense.
    - Hỗ trợ `async/await` trong component.
- **Ưu điểm**
    - Giảm bundle size của client.
    - Cải thiện hiệu suất và SEO.
    - Fetch data từ server mà không ảnh hưởng đến hiệu suất client.
- **Demo**
    - Xây dựng một Server Component fetch dữ liệu từ API và truyền xuống Client Component.

---

### **5. Data Fetching Trong Next.js**

- **`fetch()` trong Server Component**: Fetch dữ liệu ngay trên server trước khi trả về UI.
- **`useSWR` trong Client Component**: Kỹ thuật revalidation dữ liệu trên client.

---

### **6. API Routes Trong Next.js**

- **Cách tạo API route (`app/api/` hoặc `pages/api/`)**
- **Viết API đơn giản để lấy dữ liệu**
- **Middleware xử lý request**
- **Bảo mật API bằng NextAuth hoặc Middleware**

---

### **7. Triển Khai Ứng Dụng Next.js**

- **Build dự án (`npm run build`)**
- **Triển khai trên Vercel, Netlify, hoặc Cloudflare Pages**
- **Cấu hình Next.js để chạy trên server riêng (`next start`)**
