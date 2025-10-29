# 📘 Video 13: Developing the Frontend Marketplace with Corresponding Functions

## 📝 Bài tập 1: Hiển thị danh sách NFT trên Marketplace

### Đề bài

Tạo giao diện hiển thị danh sách NFT hiện có trong Marketplace.

### Yêu cầu

- Dữ liệu NFT gồm: hình ảnh, tên, mô tả, giá.
- Sử dụng React hoặc Next.js để hiển thị danh sách từ mảng JSON tạm thời.
- Giao diện chia thành các thẻ (card) cho từng NFT.

<details>
<summary>Cách giải</summary>

Dùng `map()` để lặp qua mảng NFT và hiển thị từng phần tử.

### Đáp án

```jsx
const nfts = [
  { id: 1, name: "NFT #1", image: "/nft1.png", price: "100 ADA" },
  { id: 2, name: "NFT #2", image: "/nft2.png", price: "150 ADA" },
];

export default function Marketplace() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {nfts.map((nft) => (
        <div key={nft.id} className="border p-4 rounded-xl text-center">
          <img src={nft.image} alt={nft.name} className="w-full rounded-lg" />
          <h2 className="font-bold">{nft.name}</h2>
          <p>{nft.price}</p>
        </div>
      ))}
    </div>
  );
}
```

</details>

---

## 📝 Bài tập 2: Thêm nút “Mua NFT”

### Đề bài

Tạo nút “Mua NFT” để người dùng có thể mua một NFT trong Marketplace.

### Yêu cầu

- Thêm nút `Mua ngay` dưới mỗi NFT.
- Khi nhấn, hiển thị thông báo “Đang xử lý giao dịch…” và sau 3 giây hiển thị “Mua thành công!”.

<details>
<summary>Cách giải</summary>

Dùng `useState` để quản lý trạng thái loading.

### Đáp án

```jsx
import { useState } from "react";

function NFTCard({ nft }) {
  const [status, setStatus] = useState("");

  const handleBuy = () => {
    setStatus("Đang xử lý giao dịch...");
    setTimeout(() => setStatus("Mua thành công!"), 3000);
  };

  return (
    <div className="border p-4 text-center rounded-xl">
      <img src={nft.image} alt={nft.name} />
      <h2>{nft.name}</h2>
      <p>{nft.price}</p>
      <button onClick={handleBuy}>Mua ngay</button>
      <p>{status}</p>
    </div>
  );
}
```

</details>

---

## 📝 Bài tập 3: Xử lý kết nối ví trước khi giao dịch

### Đề bài

Kiểm tra người dùng đã kết nối ví trước khi thực hiện giao dịch mua NFT.

### Yêu cầu

- Nếu ví chưa kết nối, hiển thị thông báo “Vui lòng kết nối ví trước khi mua”.
- Nếu đã kết nối, cho phép mua bình thường.
- Biến trạng thái ví: `isConnected` (true/false).

<details>
<summary>Cách giải</summary>

Sử dụng điều kiện `if (isConnected)` trước khi gọi hàm mua.

### Đáp án

```jsx
const isConnected = false;

function handleBuy() {
  if (!isConnected) {
    alert("Vui lòng kết nối ví trước khi mua.");
    return;
  }
  alert("Đang xử lý giao dịch...");
}
```

</details>

---

## 📝 Bài tập 4: Thêm trang chi tiết NFT

### Đề bài

Tạo trang hiển thị thông tin chi tiết khi người dùng nhấn vào một NFT.

### Yêu cầu

- Khi click vào NFT, chuyển đến trang `/nft/[id]`.
- Hiển thị chi tiết gồm: hình ảnh, mô tả, giá, nút “Mua”.

<details>
<summary>Cách giải</summary>

Dùng `useRouter()` trong Next.js để điều hướng đến trang chi tiết.

### Đáp án

```jsx
import { useRouter } from "next/router";

export default function NFTDetail({ nft }) {
  const router = useRouter();
  return (
    <div className="p-6">
      <img src={nft.image} alt={nft.name} />
      <h1>{nft.name}</h1>
      <p>{nft.description}</p>
      <p>Giá: {nft.price}</p>
      <button>Mua ngay</button>
      <button onClick={() => router.back()}>Quay lại</button>
    </div>
  );
}
```

</details>

---

## 📝 Bài tập 5: Cập nhật UI sau khi giao dịch

### Đề bài

Khi giao dịch mua NFT thành công, loại bỏ NFT khỏi danh sách hiển thị.

### Yêu cầu

- Khi mua xong, NFT biến mất khỏi danh sách.
- Dùng `useState` để cập nhật danh sách NFT.

<details>
<summary>Cách giải</summary>

Sử dụng `filter()` để loại NFT đã mua.

### Đáp án

```jsx
const [nfts, setNfts] = useState([
  { id: 1, name: "NFT #1" },
  { id: 2, name: "NFT #2" },
]);

function handleBuy(id) {
  alert("Mua thành công!");
  setNfts(nfts.filter((nft) => nft.id !== id));
}
```

</details>

---
