# Developing the Frontend Marketplace with Corresponding Functions

## Tổng Quan Dự Án

Dự án marketplace bao gồm các trang chính:
- **Trang chính (Listed Orders)**: Hiển thị danh sách NFT đang được bán trên marketplace (từ smart contract).
- **Trang Profile**: Hiển thị NFT trong ví người dùng và NFT đang bán trên sàn.
- **Trang Chi Tiết NFT (Asset)**: Hiển thị metadata, giá, và các action như mua, bán, update giá hoặc withdraw.

Trong hướng dẫn này, chúng ta sẽ:
1. Query dữ liệu trực tiếp từ blockchain và hiển thị lên giao diện.
2. Tích hợp logic off-chain để build và thực hiện giao dịch (sử dụng ví trình duyệt).

Lý do sử dụng backend cho query và build giao dịch:
- Bảo mật API key (ví dụ: Blockfrost Project ID) và tránh lộ thông tin.
- Tối ưu hiệu suất bằng caching (sử dụng Next.js cache hoặc database) để giảm thời gian query blockchain.
- Ngăn chặn người dùng can thiệp vào dữ liệu (ví dụ: thay đổi tham số giao dịch).

## Yêu Cầu Chuẩn Bị

- Dự án Next.js đã có giao diện cơ bản (frontend với các trang listed, profile, asset).
- Thư viện cần cài: Axios (cho API calls), SWR (cho data fetching), Shadcn/UI (cho components như dialog, input, button).
- File off-chain logic từ script trước (ví dụ: mesh.js, index.js, protocol.json) – copy vào folder `contracts`.
- Biến môi trường: `PROJECT_ID` (Blockfrost), `NEXT_PUBLIC_APP_NETWORK` (mainnet/testnet).

Cài đặt thư viện:
```bash
npm install axios swr @shadcn/ui
```

## Cấu Hình Thư Viện Và Provider

### 1. Cấu Hình Blockfrost Provider
Tạo folder `lib` và file `blockfrost.js`:
- Sử dụng singleton để tránh khởi tạo lặp lại:
```javascript
import { Blockfrost } from '@meshsdk/core'; // Import từ contracts

let blockfrostInstance = null;

export const getBlockfrost = () => {
  if (!blockfrostInstance) {
    blockfrostInstance = new Blockfrost({
      projectId: process.env.PROJECT_ID,
      network: process.env.NEXT_PUBLIC_APP_NETWORK,
    });
  }
  return blockfrostInstance;
};
```

### 2. Cấu Hình Axios Cho API Calls
Trong `lib/axios.js`:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const get = (url, params) => api.get(url, { params });
export const post = (url, data) => api.post(url, data);
```

### 3. Cấu Hình SWR Trong Layout
Thêm SWR provider vào `layout.js` để quản lý data fetching:
```javascript
import { SWRConfig } from 'swr';

export default function RootLayout({ children }) {
  return (
    <SWRConfig value={{ fetcher: (url) => get(url).then(res => res.data) }}>
      {children}
    </SWRConfig>
  );
}
```

## Xây Dựng API Endpoints

Tạo folder `app/api` với các endpoints sử dụng route handlers của Next.js.

### 1. API Listed Orders (`api/listed/route.js`)
Query danh sách NFT đang bán từ smart contract:
```javascript
import { getBlockfrost } from '@/lib/blockfrost';
import { Marketplace } from '@/contracts'; // Từ contracts

export async function GET() {
  const bf = getBlockfrost();
  const marketplace = Marketplace.fromAddress(process.env.MARKETPLACE_ADDRESS);
  const utxos = await bf.utxosAt(marketplace.address);

  const nfts = utxos
    .map(utxo => {
      const datum = marketplace.redeemDatum(utxo.output().datum());
      if (!datum) return null;
      return {
        unit: datum.unit,
        seller: datum.seller,
        price: datum.price,
      };
    })
    .filter(Boolean);

  return Response.json(nfts);
}
```

### 2. API Profile (`api/profile/route.js`)
Query NFT trong ví và NFT đang bán:
```javascript
import { getBlockfrost } from '@/lib/blockfrost';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');
  if (!address) return Response.json([]);

  const bf = getBlockfrost();
  const [assets, utxos] = await Promise.all([
    bf.assetsByAddress(address),
    bf.utxosAt(process.env.MARKETPLACE_ADDRESS),
  ]);

  const ownedNfts = assets.filter(asset => asset.unit !== 'lovelace').map(asset => ({ unit: asset.unit }));
  const listedNfts = utxos
    .map(utxo => {
      const datum = Marketplace.redeemDatum(utxo.output().datum());
      if (datum && datum.seller === address) return { unit: datum.unit, seller: datum.seller, price: datum.price };
      return null;
    })
    .filter(Boolean);

  return Response.json({ owned: ownedNfts, listed: listedNfts });
}
```

### 3. API Asset Details (`api/asset/route.js`)
Query metadata và datum của NFT:
```javascript
import { getBlockfrost } from '@/lib/blockfrost';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const unit = searchParams.get('unit');
  if (!unit) return Response.json(null);

  const bf = getBlockfrost();
  const metadata = await bf.assetsMetadata(unit);
  const utxos = await bf.utxosAt(process.env.MARKETPLACE_ADDRESS);
  const utxo = utxos.find(u => u.output().amount().has(unit)); // Lấy UTXO chứa unit

  const datum = utxo ? Marketplace.redeemDatum(utxo.output().datum()) : null;

  return Response.json({
    metadata,
    datum: datum ? { seller: datum.seller, price: datum.price / 1000000 } : null, // Chia giá cho 1e6 nếu cần
  });
}
```

### 4. API Submit Transaction (`api/submit/route.js`)
Để submit transaction đã ký:
```javascript
import { getBlockfrost } from '@/lib/blockfrost';

export async function POST(req) {
  const { signedTx } = await req.json();
  const bf = getBlockfrost();
  const txHash = await bf.submitTx(signedTx);
  return Response.json({ txHash });
}
```

## Tích Hợp Frontend Với Data Fetching

Sử dụng SWR để fetch dữ liệu trong components.

### 1. Trang Listed
```javascript
import useSWR from 'swr';

export default function ListedPage() {
  const { data: nfts } = useSWR('/api/listed');

  return (
    <div>
      {nfts?.map(nft => (
        <div key={nft.unit}>{nft.unit} - Price: {nft.price / 1000000} ADA</div>
      ))}
    </div>
  );
}
```

### 2. Trang Profile
Tương tự, fetch với params address từ ví người dùng (sử dụng useWallet để lấy address).

### 3. Trang Asset
Fetch metadata và datum, hiển thị button action dựa trên seller (update/withdraw nếu là owner, buy nếu không).

## Xử Lý Giao Dịch (Transaction Actions)

Tạo component `TxButton` để xử lý sale, buy, update, withdraw:
- Sử dụng dialog để nhập giá (nếu cần).
- Build transaction ở backend (post đến `/api/sale`, `/api/buy`, v.v.).
- Ký transaction với browser wallet (useWallet).
- Submit signedTx đến `/api/submit`.

Ví dụ config:
```javascript
const config = {
  sale: { endpoint: '/sale', requirePrice: true },
  buy: { endpoint: '/buy', requirePrice: false },
  // ...
};
```

## Lưu Ý Kiến Trúc DApp

- **Frontend**: Chỉ xử lý ký transaction và ký message (signData). Không build hoặc submit giao dịch để tránh can thiệp.
- **Backend**: Build giao dịch, query dữ liệu, caching để tối ưu (sử dụng Next.js revalidate hoặc database).
- Bảo mật: Không lộ private key; sử dụng backend để quản lý datum và UTXO.

## Kết Luận

Bằng cách theo các bước trên, bạn có thể hoàn thiện frontend marketplace với đầy đủ chức năng tương tác blockchain. Trong video tiếp theo, chúng ta sẽ deploy lên production. Nếu có vấn đề, kiểm tra lỗi và debug từng bước.
