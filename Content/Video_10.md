# Video 10: Designing the NFT Marketplace User Interface

Bài viết này dựa trên nội dung video hướng dẫn thiết kế giao diện người dùng (UI) cho một ứng dụng NFT Marketplace trên blockchain Cardano, sử dụng framework Next.js. Nội dung được thiết kế để giúp người mới bắt đầu (beginner) xây dựng UI với các chức năng cơ bản như kết nối ví, hiển thị danh sách NFT, xem chi tiết NFT, mua bán, cập nhật giá, và quản lý profile. Chúng ta sẽ sử dụng Shadcn UI để tạo các component, MeshJS để kết nối ví, và công cụ như Prettier, ESLint để quản lý code. Bài viết này là phần thứ hai trong chuỗi 6 video về xây dựng dApp NFT Marketplace, tập trung vào thiết kế UI. Các phần sau sẽ bao gồm viết smart contract, test, tích hợp, và triển khai production.

## Yêu Cầu Chuẩn Bị

Trước khi bắt đầu, hãy đảm bảo bạn có:

- **Node.js và npm**: Cài đặt Node.js (khuyến nghị phiên bản 16 trở lên) và npm (hoặc Bun nếu bạn sử dụng Bun để cài đặt nhanh hơn).
- **Trình Soạn Thảo Mã**: Sử dụng Visual Studio Code hoặc tương tự.
- **Ví Cardano**: Thiết lập ví Cardano (như Eternl) với test ADA (tADA) trên mạng thử nghiệm Cardano testnet.
- **Kiến Thức Cơ Bản**: Hiểu biết về JavaScript, React, và các khái niệm blockchain như NFT, giao dịch on-chain.

## Tổng Quan Về UI NFT Marketplace

Dựa trên phân tích ý tưởng từ video trước, UI sẽ hỗ trợ các chức năng cơ bản:
- **Kết nối ví**: Sử dụng MeshJS để kết nối ví Cardano.
- **Trang chủ**: Hiển thị danh sách NFT đang bán.
- **Trang chi tiết NFT**: Xem thông tin NFT (hình ảnh, tên, giá, metadata, seller), nút mua (Buy Now), cập nhật giá (Update Price), hoặc hủy bán (Delist).
- **Trang Profile**: Hiển thị NFT sở hữu (Owned) và NFT đang bán (Listing), với nút bán (Sale), cập nhật giá, hoặc hủy bán.

UI sẽ gồm 3 trang chính:
1. Trang chủ (/marketplace): Grid NFT.
2. Trang chi tiết (/nft/[unit]): Chi tiết NFT với tùy chọn mua/bán.
3. Trang profile (/profile): Quản lý NFT cá nhân.

Sử dụng Shadcn UI để tạo component nhanh (button, form, etc.), và tùy chỉnh để phù hợp với NFT Marketplace.

## Các Bước Thiết Kế UI Với Next.js

### Bước 1: Thiết Lập Dự Án Next.js
1. Truy cập [Next.js Documentation](https://nextjs.org/docs/getting-started) và copy lệnh tạo dự án:
   ```bash
   npx create-next-app@latest nft-marketplace
   ```
   - Nếu dùng Bun: `bunx create-next-app@latest nft-marketplace`.
   - Làm theo hướng dẫn: Chọn tên dự án, sử dụng TypeScript (nếu muốn), App Router.

2. Chạy dự án:
   ```bash
   cd nft-marketplace
   npm run dev
   ```
   - Truy cập `http://localhost:3000` để thấy trang mặc định.

### Bước 2: Cài Đặt Shadcn UI
Shadcn UI là thư viện component đẹp, dễ tùy chỉnh cho Next.js.

1. Cài đặt:
   ```bash
   npm install @radix-ui/react-slot class-variance-authority
   npx shadcn-ui@latest init
   ```
   - Nếu dùng Bun: `bun add @radix-ui/react-slot class-variance-authority` và `bunx shadcn-ui@latest init`.
   - Cấu hình: Chọn Tailwind CSS, và các tùy chọn mặc định.

2. Cài thêm component ví dụ như Button:
   ```bash
   npx shadcn-ui@latest add button
   ```
   - Tạo file `components/ui/button.tsx` với component Button tùy chỉnh.

3. Cập nhật `app/page.tsx` để test:
   ```tsx
   import { Button } from '@/components/ui/button';

   export default function Home() {
     return (
       <main>
         <h1>NFT Marketplace</h1>
         <Button>Connect Wallet</Button>
       </main>
     );
   }
   ```

### Bước 3: Cài Đặt MeshJS Và Kết Nối Ví
MeshJS dùng để kết nối ví Cardano và xử lý giao dịch.

1. Cài đặt phiên bản ổn định (1.8.14):
   ```bash
   npm install @meshsdk/core@1.8.14
   ```

2. Cập nhật `next.config.js` để hỗ trợ Webpack (vì MeshJS cần tùy chỉnh):
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     reactStrictMode: true,
     transpilePackages: ['@meshsdk/core'],
     webpack: (config, { isServer }) => {
       if (!isServer) {
         config.resolve.fallback = {
           ...config.resolve.fallback,
           fs: false,
           net: false,
           tls: false,
           crypto: false,
         };
       }
       return config;
     },
   };

   module.exports = nextConfig;
   ```

3. Tạo component Connect Wallet (`components/WalletConnect.tsx`):
   ```tsx
   'use client';
   import { useState } from 'react';
   import { BrowserWallet } from '@meshsdk/core';
   import { Button } from '@/components/ui/button';

   export default function WalletConnect({ setWallet }: { setWallet: (wallet: BrowserWallet | null) => void }) {
     const [address, setAddress] = useState('');

     const connect = async () => {
       try {
         const wallet = await BrowserWallet.enable('eternl');
         setWallet(wallet);
         const addresses = await wallet.getUsedAddresses();
         setAddress(addresses[0]);
       } catch (error) {
         console.error('Error connecting wallet:', error);
       }
     };

     return (
       <div>
         {address ? (
           <p>Connected: {address.slice(0, 6)}...{address.slice(-4)}</p>
         ) : (
           <Button onClick={connect}>Connect Wallet</Button>
         )}
       </div>
     );
   }
   ```

4. Sử dụng trong `app/page.tsx` để test kết nối.

### Bước 4: Cài Đặt Prettier Và ESLint Để Quản Lý Code
1. Cài Prettier và ESLint:
   ```bash
   npm install --save-dev prettier eslint eslint-config-next
   ```

2. Tạo file `.prettierrc`:
   ```json
   {
     "singleQuote": true,
     "semi": false,
     "trailingComma": "es5"
   }
   ```

3. Tạo file `.prettierignore`:
   ```
   node_modules
   .next
   build
   ```

4. Cập nhật `package.json` với script:
   ```json
   "scripts": {
     "format": "prettier --write ."
   }
   ```

5. Chạy `npm run format` để tự động format code (thay dấu nháy đơn bằng kép, loại bỏ dấu chấm phẩy thừa, etc.).

6. Cài ESLint: Chạy `npx eslint --init` và chọn cấu hình cho Next.js.

### Bước 5: Thiết Kế Trang Chủ (Marketplace)
Trang chủ hiển thị grid NFT đang bán.

1. Cập nhật `app/page.tsx`:
   ```tsx
   'use client';
   import { useState } from 'react';
   import WalletConnect from '@/components/WalletConnect';
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

   export default function Marketplace() {
     const [wallet, setWallet] = useState(null);
     // Giả sử dữ liệu NFT từ query on-chain (sẽ tích hợp sau)
     const nfts = [
       { unit: 'nft1', name: 'NFT 1', price: 100, image: 'https://example.com/nft1.jpg' },
       // Thêm NFT khác
     ];

     return (
       <main>
         <WalletConnect setWallet={setWallet} />
         <h1>NFT Marketplace</h1>
         <div className="grid grid-cols-3 gap-4">
           {nfts.map((nft) => (
             <Card key={nft.unit}>
               <CardHeader>
                 <CardTitle>{nft.name}</CardTitle>
               </CardHeader>
               <CardContent>
                 <img src={nft.image} alt={nft.name} />
                 <p>Price: {nft.price} ADA</p>
               </CardContent>
             </Card>
           ))}
         </div>
       </main>
     );
   }
   ```

### Bước 6: Thiết Kế Trang Chi Tiết NFT (/nft/[unit])
Sử dụng dynamic route để xem chi tiết NFT.

1. Tạo thư mục `app/nft/[unit]` và file `page.tsx`:
   ```tsx
   'use client';
   import { useParams } from 'next/navigation';
   import { Button } from '@/components/ui/button';
   import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

   export default function NftDetail() {
     const { unit } = useParams();
     // Giả sử dữ liệu NFT từ query (sẽ tích hợp sau)
     const nft = {
       policyId: 'policy123',
       name: 'NFT Name',
       seller: 'addr_test1...',
       price: 500,
       metadata: { trait1: 'Value1', trait2: 'Value2' },
       image: 'https://example.com/nft.jpg',
     };

     return (
       <main>
         <h1>{nft.name}</h1>
         <img src={nft.image} alt={nft.name} />
         <p>Policy ID: {nft.policyId}</p>
         <p>Seller: {nft.seller.slice(0, 6)}...{nft.seller.slice(-4)}</p>
         <p>Price: {nft.price} ADA</p>
         <Tabs defaultValue="properties">
           <TabsList>
             <TabsTrigger value="properties">Properties</TabsTrigger>
           </TabsList>
           <TabsContent value="properties">
             {Object.entries(nft.metadata).map(([key, value]) => (
               <p key={key}>{key}: {value}</p>
             ))}
           </TabsContent>
         </Tabs>
         {/* Nếu là người mua: */}
         <Button>Buy Now</Button>
         {/* Nếu là người bán: */}
         <Button>Update Price</Button>
         <Button>Delist</Button>
       </main>
     );
   }
   ```

### Bước 7: Thiết Kế Trang Profile (/profile)
Trang quản lý NFT sở hữu và đang bán.

1. Tạo file `app/profile/page.tsx`:
   ```tsx
   'use client';
   import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
   import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
   import { Button } from '@/components/ui/button';

   export default function Profile() {
     // Giả sử dữ liệu từ ví (sẽ tích hợp sau)
     const ownedNfts = [
       { name: 'Owned NFT 1', image: 'https://example.com/owned1.jpg' },
     ];
     const listedNfts = [
       { name: 'Listed NFT 1', price: 1000, image: 'https://example.com/listed1.jpg' },
     ];

     return (
       <main>
         <h1>Profile</h1>
         <Tabs defaultValue="owned">
           <TabsList>
             <TabsTrigger value="owned">Owned</TabsTrigger>
             <TabsTrigger value="listing">Listing</TabsTrigger>
           </TabsList>
           <TabsContent value="owned">
             <div className="grid grid-cols-3 gap-4">
               {ownedNfts.map((nft) => (
                 <Card key={nft.name}>
                   <CardHeader>
                     <CardTitle>{nft.name}</CardTitle>
                   </CardHeader>
                   <CardContent>
                     <img src={nft.image} alt={nft.name} />
                     <Button>Sale</Button>
                   </CardContent>
                 </Card>
               ))}
             </div>
           </TabsContent>
           <TabsContent value="listing">
             <div className="grid grid-cols-3 gap-4">
               {listedNfts.map((nft) => (
                 <Card key={nft.name}>
                   <CardHeader>
                     <CardTitle>{nft.name}</CardTitle>
                   </CardHeader>
                   <CardContent>
                     <img src={nft.image} alt={nft.name} />
                     <p>Price: {nft.price} ADA</p>
                     <Button>Update Price</Button>
                     <Button>Delist</Button>
                   </CardContent>
                 </Card>
               ))}
             </div>
           </TabsContent>
         </Tabs>
       </main>
     );
   }
   ```

### Bước 8: Tùy Chỉnh Và Test UI
- Sử dụng AI (như ChatGPT) để generate thêm component nếu cần (ví dụ: form nhập giá cho Sale/Update).
- Test: Chạy `npm run dev`, kiểm tra các trang, đảm bảo responsive và không lỗi.
- Dữ liệu tạm thời: Sử dụng dữ liệu giả; phần sau sẽ query từ blockchain.

## Tài Liệu Tham Khảo
- [Next.js Documentation](https://nextjs.org/docs): Hướng dẫn thiết lập dự án.
- [Shadcn UI](https://ui.shadcn.com/): Thư viện component.
- [MeshJS Documentation](https://meshjs.dev/): Kết nối ví và giao dịch.
- [Prettier](https://prettier.io/): Format code.
- [ESLint](https://eslint.org/): Lint code.

## Kết Luận
Bài viết đã hướng dẫn thiết kế UI cho NFT Marketplace trên Cardano với Next.js, Shadcn UI, và MeshJS. Bạn đã có cấu trúc cơ bản với 3 trang chính và các component cần thiết. Các video tiếp theo sẽ viết smart contract để xử lý mua/bán on-chain và tích hợp dữ liệu thực tế từ blockchain. Bạn có thể mở rộng bằng cách thêm bộ lọc, tìm kiếm, hoặc tích hợp IPFS cho hình ảnh NFT.
