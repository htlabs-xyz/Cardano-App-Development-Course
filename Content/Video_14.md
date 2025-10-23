# Video 14:  Finalizing and Deploying the Marketplace to Vercel

## Tổng Quan Các Phương Pháp Triển Khai

Next.js cung cấp một số phương pháp triển khai khác nhau, phù hợp với các trường hợp sử dụng khác nhau. Dưới đây là tóm tắt bốn phương pháp được đề cập trong video:

1. **Node.js Server**  
   - Phương pháp này tương tự như cách bạn chạy ứng dụng Next.js trên môi trường local trong quá trình phát triển.  
   - Sau khi chạy lệnh `npm run build`, một thư mục `.next` sẽ được tạo ra, chứa các tệp được tối ưu hóa cho production. Sau đó, bạn có thể chạy `npm start` để khởi động ứng dụng.  
   - Phương pháp này cho phép ứng dụng hoạt động như một máy chủ, có thể truy cập thông qua địa chỉ IP hoặc tên miền nếu được triển khai trên một máy chủ.  
   - Phù hợp khi bạn kiểm soát hoàn toàn môi trường máy chủ và muốn hỗ trợ đầy đủ các tính năng của Next.js như server-side rendering (SSR) và API routes.

2. **Docker**  
   - Docker giúp giải quyết vấn đề về sự không đồng nhất của các phiên bản Node.js hoặc môi trường giữa các máy khác nhau.  
   - Bạn cần tạo một tệp `Dockerfile` để định nghĩa môi trường, cài đặt các phụ thuộc, xây dựng dự án và sao chép thư mục `.next` vào một container image.  
   - Ngoài ra, bạn có thể sử dụng tệp `docker-compose.yml` để quản lý các dịch vụ. Image sau khi được xây dựng có thể được triển khai trên các nền tảng như DigitalOcean hoặc Google Cloud Run.  
   - Phương pháp này lý tưởng để đảm bảo môi trường nhất quán và mở rộng ứng dụng.

3. **Static Export**  
   - Phương pháp này xuất ứng dụng Next.js dưới dạng các tệp HTML tĩnh bằng lệnh `next export`.  
   - Nó chỉ hỗ trợ các trang được render phía client và không hỗ trợ các tính năng phía server như API routes hoặc server-side rendering.  
   - Phù hợp cho các trang web tĩnh đơn giản hoặc khi phần backend được tách riêng. Các nền tảng như GitHub Pages hỗ trợ triển khai static export.  
   - Nếu dự án của bạn phụ thuộc nhiều vào logic backend, bạn cần một dịch vụ backend riêng.

4. **Vercel (Adapter)**  
   - Vercel là nền tảng được tối ưu hóa cho Next.js, cung cấp quy trình triển khai liền mạch với hỗ trợ cho cả các tính năng tĩnh và phía server, bao gồm API routes và server actions.  
   - Không giống như static export, Vercel hỗ trợ các tính năng động, mặc dù một số tính năng nâng cao như middleware có thể bị giới hạn tùy thuộc vào nền tảng.  
   - Các nền tảng tương tự khác bao gồm Amplify và Netlify, nhưng Vercel được ưu tiên nhờ tích hợp chặt chẽ với Next.js và dễ sử dụng.  
   - Hướng dẫn này tập trung vào triển khai trên Vercel do tính đơn giản và hỗ trợ mạnh mẽ cho các ứng dụng Next.js.

## Yêu Cầu Chuẩn Bị

Trước khi triển khai lên Vercel, hãy đảm bảo các điều kiện sau:
- Bạn đã có một dự án Next.js (ví dụ: ứng dụng marketplace) chạy thành công trên local bằng lệnh `npm run dev`.
- Dự án đã được đẩy lên một kho Git (ví dụ: GitHub).
- Bạn có tài khoản Vercel. Lưu ý rằng Vercel có thể yêu cầu tài khoản GitHub có hoạt động đủ để tạo tài khoản mới.
- Các biến môi trường (ví dụ: `PROJECT_ID` và `NEXT_PUBLIC_APP_NETWORK`) đã được cấu hình trong tệp `.env` của dự án.

## Hướng Dẫn Triển Khai Lên Vercel Từng Bước

### 1. Chuẩn Bị Dự Án
Đảm bảo dự án Next.js của bạn sẵn sàng để triển khai:
- **Kiểm Tra Build Trên Local**: Chạy lệnh `npm run build` trong thư mục dự án để tạo thư mục `.next`. Đảm bảo quá trình build hoàn tất mà không có lỗi.  
  - Các vấn đề phổ biến như biến không sử dụng hoặc lỗi linting cần được xử lý trước khi triển khai. Ví dụ, nếu bạn sử dụng ESLint, hãy sửa các cảnh báo như biến không sử dụng để tối ưu hiệu suất.  
  - Lệnh mẫu:
    ```bash
    npm run build
    ```
  - Nếu quá trình build thất bại, hãy xem lại log lỗi và khắc phục (ví dụ: thiếu phụ thuộc, cấu hình sai, hoặc link bị hỏng).
- **Khởi Động Ứng Dụng Trên Local**: Sau khi build thành công, chạy `npm start` để kiểm tra ứng dụng ở chế độ production trên local.  
  - Lệnh mẫu:
    ```bash
    npm start
    ```
  - Đảm bảo ứng dụng hoạt động bình thường trước khi triển khai.

### 2. Thiết Lập Kho Git
Để triển khai lên Vercel, dự án cần được đẩy lên một kho GitHub:
- **Khởi Tạo Kho Git**: Nếu dự án chưa có kho Git, chạy lệnh sau trong thư mục dự án:
  ```bash
  git init
  ```
- **Thêm Tệp Vào Kho**: Thêm tất cả các tệp vào kho Git:
  ```bash
  git add .
  ```
- **Commit Các Thay Đổi**:
  ```bash
  git commit -m "Initial commit for deployment"
  ```
- **Tạo Kho GitHub**: Truy cập GitHub, tạo một kho mới (ví dụ: `marketplace-app`). Sao chép URL của kho (ví dụ: `https://github.com/username/marketplace-app.git`).
- **Đẩy Dự Án Lên GitHub**:
  ```bash
  git remote add origin https://github.com/username/marketplace-app.git
  git push -u origin main
  ```

### 3. Tạo Tài Khoản Vercel
- Truy cập [Vercel](https://vercel.com) và đăng ký/đăng nhập bằng tài khoản GitHub.
- Lưu ý: Nếu tài khoản GitHub mới tạo không đủ hoạt động, Vercel có thể từ chối. Hãy sử dụng tài khoản GitHub đã có lịch sử hoạt động.

### 4. Triển Khai Dự Án Lên Vercel
- **Tạo Dự Án Mới**: Trên bảng điều khiển Vercel, nhấp vào **Add New Project**.
- **Chọn Kho GitHub**: Chọn kho GitHub chứa dự án của bạn (ví dụ: `marketplace-app`).
- **Cấu Hình Dự Án**:
  - Vercel sẽ tự động phát hiện dự án là Next.js và sử dụng các cài đặt mặc định.
  - Thêm các biến môi trường cần thiết (từ tệp `.env`):
    - `PROJECT_ID`: ID của dự án.
    - `NEXT_PUBLIC_APP_NETWORK`: Mạng ứng dụng (ví dụ: `mainnet` hoặc `preview`).
  - Để thêm biến môi trường, vào phần **Environment Variables** trong giao diện Vercel và nhập các giá trị tương ứng.
- **Triển Khai**: Nhấp vào **Deploy** để bắt đầu quá trình triển khai. Vercel sẽ:
  1. Import mã nguồn từ GitHub.
  2. Chạy lệnh `npm run build` để xây dựng dự án.
  3. Triển khai ứng dụng lên một URL do Vercel cung cấp (ví dụ: `https://marketplace-app.vercel.app`).
- **Kiểm Tra Log**: Theo dõi log triển khai trên Vercel để phát hiện lỗi (nếu có). Đảm bảo quá trình build trên local đã thành công trước để giảm thiểu lỗi.

### 5. Xử Lý Lỗi Triển Khai
- Nếu Vercel báo lỗi trong quá trình build, kiểm tra log để xác định nguyên nhân (ví dụ: thiếu biến môi trường, lỗi cú pháp, hoặc phụ thuộc không tương thích).
- Một số lỗi phổ biến:
  - **Lỗi ESLint**: Xóa hoặc sửa các biến không sử dụng, hoặc điều chỉnh quy tắc linting trong tệp `.eslintrc`.
  - **Lỗi Biến Môi Trường**: Đảm bảo tất cả các biến cần thiết đã được thêm vào Vercel.
- Sau khi sửa lỗi, đẩy lại mã lên GitHub và Vercel sẽ tự động rebuild.

### 6. Kiểm Tra Ứng Dụng Sau Triển Khai
- Truy cập URL do Vercel cung cấp để kiểm tra ứng dụng.
- Đảm bảo các chức năng chính (ví dụ: kết nối ví, giao dịch, truy vấn dữ liệu) hoạt động đúng.  
  - Nếu ứng dụng sử dụng mạng blockchain (ví dụ: mainnet hoặc testnet), kiểm tra cấu hình biến môi trường như `NEXT_PUBLIC_APP_NETWORK` để đảm bảo kết nối đúng mạng.
- Nếu bạn có tên miền riêng, bạn có thể trỏ tên miền đến URL của Vercel trong phần **Domains** trên bảng điều khiển Vercel.

### 7. Cấu Hình Mạng Blockchain
Nếu ứng dụng marketplace của bạn tích hợp blockchain, hãy chú ý:
- **Network ID**: Đảm bảo biến `NEXT_PUBLIC_APP_NETWORK` được cấu hình đúng (ví dụ: `mainnet` hoặc `testnet`).  
  - Địa chỉ blockchain trên testnet thường bắt đầu bằng `test1`, trong khi mainnet bắt đầu bằng `addr1`.
- **API và Giao Dịch**:
  - Truy vấn dữ liệu blockchain (query): Sử dụng backend để xử lý truy vấn nhằm tăng tốc độ và bảo mật API key.
  - Xây dựng giao dịch: Xử lý ở backend để ngăn chặn người dùng chèn tham số không mong muốn.
- **Ký Giao Dịch**:
  - Nếu giao dịch cần chữ ký từ cả người dùng và hệ thống, bạn có thể thêm private key vào biến môi trường trên server để ký giao dịch. Điều này đảm bảo chỉ server thực hiện việc ký, không để lộ thông tin ví.

## Lưu Ý Về Kiến Trúc Ứng Dụng DApp
Dựa trên video, dưới đây là các điểm quan trọng về kiến trúc của một ứng dụng phi tập trung (DApp) như marketplace:
1. **Phân Chia Frontend và Backend**:
   - **Frontend**: Chỉ xử lý giao diện người dùng và tương tác với ví trình duyệt (browser wallet). Các hook hoặc dữ liệu tương tác với ví chỉ hoạt động trên phía client.
   - **Backend**: Xử lý truy vấn blockchain, xây dựng giao dịch, và lưu trữ dữ liệu để tăng tốc độ và bảo mật. API key (ví dụ: Blockfrost) nên được lưu trữ an toàn trên backend.
2. **Bảo Mật Giao Dịch**:
   - Không cho phép người dùng trực tiếp ký giao dịch mà không thông qua server, trừ khi sử dụng ví chỉ đọc.
   - Sử dụng private key trong biến môi trường trên server để ký giao dịch tự động nếu cần.
3. **Tối Ưu Hiệu Suất**:
   - Sử dụng backend để cache dữ liệu blockchain, giảm thời gian truy vấn.
   - Đảm bảo mã sạch, loại bỏ biến không sử dụng hoặc lỗi linting để tối ưu hiệu suất.

## Mẹo và Đề Xuất
- **Ưu Tiên Node.js Server hoặc Docker cho Production**: Nếu ứng dụng của bạn phức tạp hoặc cần đầy đủ tính năng, hãy cân nhắc triển khai trên Node.js server hoặc Docker thay vì Vercel để có kiểm soát tốt hơn.
- **Giới Hạn của Vercel**: Vercel phù hợp cho triển khai nhanh, nhưng có giới hạn về số lượng dự án hoặc băng thông tùy theo gói sử dụng. Kiểm tra [trang giá của Vercel](https://vercel.com/pricing) để biết thêm chi tiết.
- **Kiểm Tra Định Kỳ**: Sau khi triển khai, thường xuyên kiểm tra log trên Vercel và cập nhật mã nguồn để đảm bảo ứng dụng ổn định.

## Kết Luận
Triển khai ứng dụng Next.js lên Vercel là một quy trình đơn giản và hiệu quả, đặc biệt phù hợp với các dự án marketplace tích hợp blockchain. Bằng cách làm theo các bước trên, bạn có thể đưa ứng dụng từ môi trường local lên production, đảm bảo các tính năng như giao diện, API, và kết nối blockchain hoạt động trơn tru. Nếu bạn có câu hỏi, hãy để lại bình luận hoặc liên hệ để được hỗ trợ thêm.
