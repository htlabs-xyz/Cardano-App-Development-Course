# Video 5: Query Data Onchain

Bài viết này hướng dẫn cách truy vấn dữ liệu on-chain từ blockchain Cardano bằng cách sử dụng dịch vụ Blockfrost, một nhà cung cấp API phổ biến để tương tác với blockchain. Nội dung được thiết kế cho các nhà phát triển xây dựng ứng dụng phi tập trung (dApps) trên Cardano, đặc biệt là trong môi trường backend sử dụng Node.js. Bằng cách làm theo hướng dẫn này, bạn sẽ hiểu cách thiết lập Blockfrost, truy vấn dữ liệu từ blockchain, và tối ưu hóa hiệu suất ứng dụng.

## Yêu Cầu Chuẩn Bị

Trước khi bắt đầu, hãy đảm bảo bạn có:

- **Node.js và npm**: Cài đặt Node.js (khuyến nghị phiên bản 16 trở lên) và npm để quản lý phụ thuộc JavaScript.
- **Trình Soạn Thảo Mã**: Sử dụng trình soạn thảo như Visual Studio Code.
- **Tài Khoản Blockfrost**: Đăng ký tài khoản tại [Blockfrost Dashboard](https://blockfrost.io/) để nhận Project ID.
- **Ví Cardano**: Thiết lập ví Cardano (như Eternl) với một lượng test ADA (tADA) trên mạng thử nghiệm Cardano testnet để kiểm tra các giao dịch.
- **Kiến Thức Cơ Bản**: Hiểu biết về JavaScript, API REST, và các khái niệm blockchain.

## Tổng Quan Về Truy Vấn Dữ Liệu On-Chain

Truy vấn dữ liệu on-chain là quá trình lấy thông tin từ sổ cái blockchain Cardano (như số dư ví, giao dịch, hoặc tài sản) để phục vụ các mục đích ứng dụng, chẳng hạn như hiển thị số dư, theo dõi lịch sử giao dịch, hoặc phân tích hiệu suất staking.

Cardano cung cấp nhiều công cụ để truy vấn dữ liệu, bao gồm:

- **Blockfrost**: Một dịch vụ API bên thứ ba cung cấp các endpoint để truy vấn dữ liệu blockchain và gửi giao dịch.
- **Koios**: Một giải pháp tương tự Blockfrost, cung cấp các endpoint để truy vấn trực tiếp từ blockchain.
- **MeshJS Provider**: Một phần của thư viện MeshJS, tích hợp với các nhà cung cấp như Blockfrost hoặc Koios để truy vấn dữ liệu.

Trong bài viết này, chúng ta sẽ tập trung vào Blockfrost vì tính dễ sử dụng và tài liệu chi tiết.

## Tại Sao Nên Sử Dụng Blockfrost?

Sử dụng dịch vụ bên thứ ba như Blockfrost có những lợi ích sau:

1. **Dễ Tích Hợp**: Blockfrost cung cấp API REST với các endpoint dễ sử dụng, cho phép lập trình viên gửi yêu cầu HTTP để lấy dữ liệu hoặc gửi giao dịch mà không cần chạy node Cardano.
2. **Hiệu Suất Cao**: Không cần đồng bộ hóa toàn bộ blockchain, giúp tiết kiệm tài nguyên máy tính.
3. **Gói Miễn Phí**: Blockfrost cung cấp gói Starter miễn phí với 15 triệu request mỗi tháng, đủ cho các dự án thử nghiệm.

**Nhược điểm**:
- **Chi Phí**: Nếu vượt quá giới hạn request miễn phí, bạn cần nâng cấp lên gói trả phí.
- **Phụ Thuộc Bên Thứ Ba**: Dựa vào Blockfrost thay vì tự chạy node có thể giới hạn tính linh hoạt.

So sánh với việc tự chạy node Cardano:
- **Ưu điểm của chạy node**: Kiểm soát hoàn toàn dữ liệu và không phụ thuộc vào bên thứ ba.
- **Nhược điểm**: Yêu cầu máy tính mạnh để đồng bộ blockchain và cần xây dựng công cụ truy vấn riêng.

## Thiết Lập Blockfrost

### Bước 1: Tạo Tài Khoản và Project ID
1. Truy cập [Blockfrost Dashboard](https://blockfrost.io/) và đăng ký tài khoản.
2. Tạo một dự án mới:
   - Chọn mạng **Preprod** (mạng thử nghiệm Cardano).
   - Đặt tên dự án, ví dụ: `PreprodTest`.
   - Sau khi tạo, bạn sẽ nhận được **Project ID** (bắt đầu bằng `preprod` và kèm theo một chuỗi ký tự). Lưu lại Project ID này để sử dụng trong các yêu cầu API.

### Bước 2: Khám Phá Các Endpoint của Blockfrost
Blockfrost cung cấp nhiều endpoint để truy vấn dữ liệu. Xem tài liệu chi tiết tại [Blockfrost API Documentation](https://docs.blockfrost.io/). Một số module chính bao gồm:

1. **Accounts**: Truy vấn thông tin liên quan đến tài khoản staking, như số dư, phần thưởng staking, hoặc lịch sử giao dịch staking. Ví dụ:
   - `/accounts/{stake_address}/rewards`: Lấy lịch sử phần thưởng staking.
   - Ứng dụng: Theo dõi hiệu suất staking hoặc phân tích tài khoản.

2. **Addresses**: Truy vấn chi tiết về địa chỉ ví, như danh sách UTXO (unspent transaction outputs) hoặc lịch sử giao dịch. Ví dụ:
   - `/addresses/{address}/transactions`: Lấy danh sách giao dịch của một địa chỉ.
   - Ứng dụng: Hiển thị lịch sử giao dịch hoặc kiểm tra số dư.

3. **Assets**: Truy vấn thông tin về tài sản (token, NFT) trên Cardano. Ví dụ:
   - `/assets/{asset}/transactions`: Lấy giao dịch liên quan đến một tài sản.
   - `/assets/{asset}/addresses`: Lấy danh sách địa chỉ sở hữu tài sản.

4. **Transactions**: Truy vấn chi tiết giao dịch hoặc gửi giao dịch mới. Ví dụ:
   - `/txs/{hash}`: Lấy thông tin giao dịch theo hash.
   - `/tx/submit`: Gửi giao dịch mới lên blockchain (phương thức POST).

5. **Khác**: Các module như `blocks`, `pools`, `metadata`, và `scripts` cung cấp thông tin về block, stake pool, metadata, hoặc hợp đồng thông minh.

### Bước 3: Tích Hợp Blockfrost Vào Backend

Để đảm bảo bảo mật và hiệu suất, nên thực hiện các yêu cầu API từ backend thay vì frontend. Lý do:

- **Bảo mật**: Project ID cần được giữ bí mật. Nếu gọi API từ frontend, người dùng có thể truy cập Project ID và sử dụng trái phép, đặc biệt với gói trả phí.
- **Kiểm Soát Request**: Backend cho phép giới hạn và quản lý số lượng request, tránh vượt quá giới hạn miễn phí (15 triệu request/tháng với gói Starter).
- **Tối Ưu Hiệu Suất**: Backend có thể lưu trữ dữ liệu vào cơ sở dữ liệu (database) để giảm số lần gọi API trực tiếp đến Blockfrost, cải thiện tốc độ phản hồi.

**Nhược điểm khi lưu trữ dữ liệu**:
- Dữ liệu trong database có thể bị trễ (delay) so với blockchain nếu không được đồng bộ thường xuyên.

#### Ví Dụ: Truy Vấn Lịch Sử Giao Dịch Của Một Địa Chỉ

Dưới đây là cách tích hợp Blockfrost vào một dự án Node.js với backend sử dụng Next.js API Routes.

1. **Tạo API Route**:
   - Trong thư mục `app/api/cardano/[address]/route.js`, tạo một dynamic route để truy vấn lịch sử giao dịch của một địa chỉ ví:

```javascript
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { address } = params;
  const projectId = 'preprodYourProjectIdHere'; // Thay bằng Project ID của bạn
  const url = `https://cardano-preprod.blockfrost.io/api/v0/addresses/${address}/transactions`;

  try {
    const response = await fetch(url, {
      headers: {
        project_id: projectId,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
```

2. **Giải Thích Mã**:
   - **Dynamic Route**: `[address]` cho phép truyền địa chỉ ví qua URL (ví dụ: `/api/cardano/addr_test1...`).
   - **Project ID**: Đặt trong headers của yêu cầu HTTP để xác thực với Blockfrost.
   - **Endpoint**: `/addresses/{address}/transactions` trả về danh sách hash giao dịch liên quan đến địa chỉ ví.
   - **Xử Lý Lỗi**: Kiểm tra trạng thái phản hồi để xử lý lỗi từ API.

3. **Chạy Dự Án**:
   - Chạy dự án Next.js bằng lệnh:
     ```bash
     npm run dev
     ```
   - Truy cập URL, ví dụ:
     ```
     http://localhost:3000/api/cardano/addr_test1...
     ```
     Thay `addr_test1...` bằng địa chỉ ví thực tế của bạn (có thể lấy từ ví Eternl).
   - Kết quả trả về sẽ là danh sách hash giao dịch, ví dụ:
     ```json
     [
       { "tx_hash": "hash1" },
       { "tx_hash": "hash2" }
     ]
     ```

4. **Kiểm Tra Giao Dịch**:
   - Sao chép hash giao dịch và kiểm tra trên [Cardano Testnet Explorer](https://testnet.cardanoscan.io/) để xác minh.

### Bước 4: Tối Ưu Hóa Với Database

Để giảm số lần gọi API và tăng tốc độ, bạn có thể lưu trữ dữ liệu từ Blockfrost vào một database (như MongoDB hoặc PostgreSQL) và chỉ đồng bộ định kỳ.

1. **Lưu Dữ Liệu Vào Database**:
   - Khi nhận dữ liệu từ Blockfrost, lưu vào database với thời gian cập nhật.
   - Ví dụ (sử dụng MongoDB):

```javascript
import { MongoClient } from 'mongodb';

async function saveToDatabase(address, transactions) {
  const client = new MongoClient('mongodb://localhost:27017');
  try {
    await client.connect();
    const db = client.db('cardano');
    const collection = db.collection('transactions');
    await collection.updateOne(
      { address },
      { $set: { transactions, updatedAt: new Date() } },
      { upsert: true }
    );
  } finally {
    await client.close();
  }
}
```

2. **Truy Vấn Từ Database**:
   - Khi frontend gửi yêu cầu, kiểm tra database trước:
     - Nếu dữ liệu còn mới (ví dụ: dưới 5 phút), trả về từ database.
     - Nếu dữ liệu cũ, gọi lại Blockfrost và cập nhật database.

```javascript
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(request, { params }) {
  const { address } = params;
  const projectId = 'preprodYourProjectIdHere';
  const url = `https://cardano-preprod.blockfrost.io/api/v0/addresses/${address}/transactions`;

  // Kiểm tra database trước
  const client = new MongoClient('mongodb://localhost:27017');
  try {
    await client.connect();
    const db = client.db('cardano');
    const collection = db.collection('transactions');
    const cached = await collection.findOne({ address });

    // Nếu dữ liệu còn mới (dưới 5 phút)
    if (cached && new Date() - new Date(cached.updatedAt) < 5 * 60 * 1000) {
      return NextResponse.json(cached.transactions);
    }

    // Gọi Blockfrost nếu dữ liệu cũ hoặc không có
    const response = await fetch(url, {
      headers: { project_id: projectId },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // Lưu vào database
    await collection.updateOne(
      { address },
      { $set: { transactions: data, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  } finally {
    await client.close();
  }
}
```

**Lợi ích**:
- Giảm số lần gọi API đến Blockfrost, tiết kiệm request.
- Tăng tốc độ phản hồi vì truy vấn database thường nhanh hơn gọi API.
- Cải thiện trải nghiệm người dùng.

**Nhược điểm**:
- Dữ liệu có thể bị trễ nếu không đồng bộ thường xuyên. Để khắc phục, cài đặt cron job để định kỳ cập nhật dữ liệu (ví dụ: mỗi 5 phút).

## Tài Liệu Tham Khảo

- [Blockfrost API Documentation](https://docs.blockfrost.io/): Danh sách endpoint và hướng dẫn sử dụng.
- [Cardano Developer Portal](https://devs.cardano.org/): Công cụ và tài liệu phát triển Cardano.
- [Cardano Testnet Explorer](https://testnet.cardanoscan.io/): Kiểm tra giao dịch và dữ liệu blockchain.
- [MeshJS Documentation](https://meshjs.dev/): Hỗ trợ tích hợp Blockfrost vào dự án JavaScript.

## Kết Luận

Sử dụng Blockfrost để truy vấn dữ liệu on-chain từ Cardano là một cách hiệu quả và dễ dàng để tích hợp blockchain vào ứng dụng của bạn. Bằng cách gọi API từ backend và tối ưu hóa với database, bạn có thể giảm chi phí, tăng tốc độ và đảm bảo bảo mật. Hướng dẫn này đã cung cấp các bước cụ thể để thiết lập Blockfrost, truy vấn lịch sử giao dịch, và lưu trữ dữ liệu. Để mở rộng, bạn có thể khám phá các endpoint khác của Blockfrost để hỗ trợ các chức năng như truy vấn tài sản, staking, hoặc gửi giao dịch.
