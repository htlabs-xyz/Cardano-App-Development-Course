# 📘 Video 16: Finalizing and Deploying the Marketplace to Vercel

## 📝 Bài tập 1: Tạo file cấu hình môi trường `.env.local`

### Đề bài

Thiết lập file môi trường cho dự án DApp Marketplace để chuẩn bị deploy.

### Yêu cầu

- Tạo file `.env.local` tại thư mục gốc.
- Thêm các biến môi trường cần thiết:
  - `NEXT_PUBLIC_PROJECT_ID`
  - `NEXT_PUBLIC_APP_NETWORK`
- Sử dụng giá trị thật từ Blockfrost hoặc testnet preview.

<details>
<summary>Cách giải</summary>

Tạo file `.env.local` và thêm biến như ví dụ dưới đây.

### Đáp án

```bash
NEXT_PUBLIC_PROJECT_ID="project_xxx"
NEXT_PUBLIC_APP_NETWORK="preview"
```

</details>

---

## 📝 Bài tập 2: Build dự án trên môi trường local

### Đề bài

Kiểm tra xem dự án có thể build thành công trước khi deploy.

### Yêu cầu

- Chạy lệnh `npm run build` trong terminal.
- Sửa các lỗi hoặc cảnh báo nếu có.
- Đảm bảo dự án chạy thành công với `npm start`.

<details>
<summary>Cách giải</summary>

Kiểm tra log trong terminal, sửa lỗi lint hoặc syntax nếu build thất bại.

### Đáp án

```bash
npm run build
npm start
```

</details>

---

## 📝 Bài tập 3: Deploy dự án lên Vercel

### Đề bài

Triển khai dự án lên nền tảng Vercel để tạo URL truy cập online.

### Yêu cầu

- Đẩy code lên GitHub.
- Truy cập [https://vercel.com](https://vercel.com) → Add New Project.
- Kết nối repo và deploy.
- Dán URL deploy thành công.

<details>
<summary>Cách giải</summary>

Vercel sẽ tự động build và hiển thị log. Sau khi hoàn tất, bạn sẽ có URL như sau:

### Đáp án

```
https://your-marketplace.vercel.app
```

</details>

---

## 📝 Bài tập 4: Kiểm tra và xử lý lỗi build

### Đề bài

Phân tích log build từ Vercel và xử lý các lỗi phổ biến.

### Yêu cầu

- Mở tab “Deployments” trong dự án Vercel.
- Kiểm tra log build (ví dụ: lỗi `Unused variable`, `Cannot find module`).
- Sửa code và redeploy.

<details>
<summary>Cách giải</summary>

Nếu gặp lỗi `eslint`, có thể tạm thời vô hiệu hóa bằng cấu hình `.eslintrc.json` hoặc sửa biến chưa dùng.

### Đáp án

```json
// .eslintrc.json
{
  "rules": {
    "no-unused-vars": "off"
  }
}
```

</details>

---

## 📝 Bài tập 5: Phân tích kiến trúc DApp khi triển khai

### Đề bài

Giải thích sự tách biệt giữa **Frontend** và **Backend** trong DApp khi deploy.

### Yêu cầu

- Viết đoạn mô tả ngắn (5–7 dòng).
- Trình bày vai trò của Frontend (ví trình duyệt) và Backend (xử lý logic, query, ký giao dịch).

<details>
<summary>Cách giải</summary>s

Frontend chịu trách nhiệm tương tác ví và hiển thị UI, Backend xử lý dữ liệu, query blockchain và bảo vệ API key.

### Đáp án

```
Frontend: giao tiếp với ví, hiển thị dữ liệu người dùng.
Backend: xử lý query blockchain, build và ký giao dịch, bảo mật private key.
```

</details>

---
