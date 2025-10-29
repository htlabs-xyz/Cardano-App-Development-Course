# 🎨 Video 10: Designing the NFT Marketplace User Interface

## 📝 Bài tập 1: Khởi tạo dự án Next.js cho NFT Marketplace

### Đề bài

Khởi tạo dự án Next.js mới cho NFT Marketplace và cài đặt thư viện hỗ trợ giao diện.

### Yêu cầu

- Cài đặt dự án Next.js mới bằng `npx create-next-app` hoặc `pnpm create next-app`.
- Cài đặt thư viện **shadcn/ui** theo hướng dẫn.
- Tạo file `utils/cn.ts` chứa hàm tiện ích `cn()` để nối chuỗi class CSS.
- Kiểm tra chạy thành công bằng lệnh `npm run dev` hoặc `pnpm dev`.

<details>
<summary>Cách giải</summary>

1. Chạy lệnh khởi tạo project Next.js.
2. Cài đặt shadcn/ui:
   ```bash
   npx shadcn-ui@latest init
   ```
3. Thêm file `utils/cn.ts`:

   ```ts
   import { clsx } from "clsx";
   import { twMerge } from "tailwind-merge";

   export function cn(...inputs: any[]) {
     return twMerge(clsx(inputs));
   }
   ```

4. Khởi động server và kiểm tra giao diện mặc định.

### Đáp án

Sau khi hoàn thành, bạn có thể truy cập `http://localhost:3000` để thấy trang mặc định Next.js.  
Hệ thống sẵn sàng cho việc phát triển UI marketplace.

</details>

---

## 📝 Bài tập 2: Xây dựng hệ thống quản lý ví (Wallet Store)

### Đề bài

Tạo store quản lý trạng thái ví người dùng bằng **Zustand**.

### Yêu cầu

- Cài đặt Zustand bằng `npm install zustand`.
- Tạo file `hooks/useWallet.ts`.
- Lưu trữ các giá trị: `walletName`, `address`, `browserWallet`.
- Cung cấp hàm `connect()` và `disconnect()` để điều khiển trạng thái.

<details>
<summary>Cách giải</summary>

1. Import `create` từ Zustand.
2. Tạo store và định nghĩa các biến cần thiết.
3. Kết nối ví thông qua `window.cardano[walletName].enable()`.

### Đáp án

```ts
import { create } from "zustand";

interface WalletStore {
  walletName: string;
  address: string;
  browserWallet: any;
  connect: (name: string) => Promise<void>;
  disconnect: () => void;
}

export const useWallet = create<WalletStore>((set) => ({
  walletName: "",
  address: "",
  browserWallet: null,
  connect: async (name: string) => {
    try {
      const wallet = await window.cardano[name].enable();
      const addr = await wallet.getChangeAddress();
      set({ walletName: name, browserWallet: wallet, address: addr });
    } catch {
      alert("Không thể kết nối ví");
    }
  },
  disconnect: () => set({ walletName: "", address: "", browserWallet: null }),
}));
```

</details>

---

## 📝 Bài tập 3: Tạo nút Connect Wallet

### Đề bài

Tạo component `WalletConnectButton` để hiển thị trạng thái ví và tùy chọn kết nối.

### Yêu cầu

- Tạo file `components/connect/WalletConnectButton.tsx`.
- Nếu chưa kết nối → hiển thị nút “Connect Wallet”.
- Nếu đã kết nối → hiển thị địa chỉ ví và nút “Disconnect”.
- Sử dụng hook `useWallet()` từ bài tập trước.

<details>
<summary>Cách giải</summary>

1. Lấy dữ liệu ví từ store Zustand.
2. Hiển thị điều kiện theo trạng thái kết nối.
3. Thêm event `onClick` để gọi `connect()` hoặc `disconnect()`.

### Đáp án

```tsx
"use client";
import { useWallet } from "@/hooks/useWallet";

export default function WalletConnectButton() {
  const { walletName, address, connect, disconnect } = useWallet();

  return (
    <div className="text-center">
      {!walletName ? (
        <button
          onClick={() => connect("eternl")}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <p>Đã kết nối: {address.slice(0, 10)}...</p>
          <button
            onClick={disconnect}
            className="bg-red-500 text-white px-4 py-2 mt-2 rounded-md"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
```

</details>

---

## 📝 Bài tập 4: Tạo giao diện trang chủ Marketplace

### Đề bài

Xây dựng trang chủ `/` hiển thị danh sách NFT mẫu.

### Yêu cầu

- Tạo component `NFTCard.tsx` hiển thị hình ảnh, tên, giá, và nút “Buy Now”.
- Hiển thị danh sách NFT giả (3–5 NFT).
- Tạo layout với tiêu đề “Cardano NFT Marketplace” và nút `Connect Wallet`.

<details>
<summary>Cách giải</summary>

1. Tạo component `NFTCard` trong `components/nft/`.
2. Dữ liệu có thể là một mảng tĩnh trong `data/nfts.ts`.
3. Render danh sách NFT trên trang `app/page.tsx`.

### Đáp án

```tsx
import NFTCard from "@/components/nft/NFTCard";
import WalletConnectButton from "@/components/connect/WalletConnectButton";
import { nfts } from "@/data/nfts";

export default function Home() {
  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cardano NFT Marketplace</h1>
        <WalletConnectButton />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {nfts.map((nft) => (
          <NFTCard key={nft.id} nft={nft} />
        ))}
      </div>
    </div>
  );
}
```

</details>

---

## 📝 Bài tập 5: Tạo trang Profile và NFT Detail

### Đề bài

Xây dựng 2 trang bổ sung:

- `/nft/[unit].tsx` – Hiển thị chi tiết NFT.
- `/profile` – Hiển thị NFT của người dùng.

### Yêu cầu

- Trang chi tiết NFT có các nút “Buy Now”, “Update Price”, “Delist”.
- Nếu người dùng là chủ sở hữu → hiển thị các nút quản lý.
- Trang Profile hiển thị danh sách NFT người dùng đang sở hữu.

<details>
<summary>Cách giải</summary>

1. Sử dụng router động `[unit].tsx` để lấy dữ liệu NFT theo ID.
2. Lấy dữ liệu ví hiện tại từ store `useWallet`.
3. So sánh `owner` và `address` để xác định quyền hiển thị.

### Đáp án

```tsx
import { useWallet } from "@/hooks/useWallet";

export default function NFTDetail({ params }: { params: { unit: string } }) {
  const { address } = useWallet();
  const nft = { id: params.unit, name: "Sample NFT", owner: "addr_test1..." };

  const isOwner = nft.owner === address;

  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold mb-4">{nft.name}</h2>
      {isOwner ? (
        <div>
          <button className="bg-yellow-500 text-white px-4 py-2 m-2 rounded-md">
            Update Price
          </button>
          <button className="bg-red-500 text-white px-4 py-2 m-2 rounded-md">
            Delist
          </button>
        </div>
      ) : (
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
          Buy Now
        </button>
      )}
    </div>
  );
}
```

</details>

---
