# Video 09: Analyzing Ideas for an NFT Marketplace

Bài viết này dựa trên nội dung video hướng dẫn phân tích ý tưởng cho một ứng dụng NFT Marketplace trên blockchain Cardano. Nội dung được thiết kế để giúp người mới bắt đầu (beginner) hiểu rõ về các chức năng chính, logic hợp đồng thông minh, và cách thiết kế giao diện người dùng (UI). Chúng ta sẽ phân tích các marketplace thực tế như JPG.Store, thiết kế UI cơ bản, và demo các chức năng cốt lõi. Bài viết này là phần đầu tiên trong chuỗi 6 video về xây dựng dApp NFT Marketplace, tập trung vào phân tích ý tưởng và thiết kế UI. Các phần sau sẽ bao gồm viết smart contract, test, tích hợp frontend, và triển khai production.

## Giới Thiệu Về Dự Án NFT Marketplace

NFT Marketplace là một nền tảng phi tập trung (dApp) cho phép người dùng mua bán các NFT (Non-Fungible Tokens) trên Cardano. Chúng ta sẽ xây dựng một marketplace đơn giản với các chức năng cơ bản, sử dụng:
- **Frontend**: Next.js với MeshJS để kết nối ví và xử lý giao dịch.
- **Smart Contract**: Aiken hoặc Plutus để quản lý logic on-chain.
- **Backend**: Blockfrost để truy vấn dữ liệu NFT và UTXO.

**Mục tiêu khóa học**:
- Phân tích ý tưởng và thiết kế UI (video này).
- Viết smart contract và test (2 video tiếp theo).
- Tích hợp frontend và hoàn thiện (video 4).
- Triển khai production (video 5-6).

**Lợi ích**: Người dùng có thể list NFT để bán, mua NFT, cập nhật giá, và delist NFT mà không cần trung gian, với tính minh bạch của blockchain.

## Phân Tích Các Marketplace Thực Tế Trên Cardano

Cardano có một số marketplace NFT phổ biến:
- **JPG.Store**: Chiếm hơn 90% giao dịch NFT trên Cardano, với giao diện thân thiện và hỗ trợ nhiều ví.
- **CNFT.io**: Một trong những marketplace đầu tiên trên Cardano, tập trung vào cộng đồng nghệ sĩ.

### Demo JPG.Store
Truy cập [JPG.Store](https://jpg.store/) để xem demo:
1. **Kết nối ví**: Chọn ví như Eternl hoặc Nami, kết nối để hiển thị số dư và NFT sở hữu.
2. **Trang chủ**: Hiển thị các bộ sưu tập (collections) NFT đang bán, với bộ lọc theo giá, độ hiếm, và chủ đề.
3. **Xem chi tiết NFT**: Nhấp vào NFT để xem metadata (tên, mô tả, hình ảnh, thuộc tính), lịch sử giao dịch, và nút "Buy Now".
4. **Mua NFT**: Tạo giao dịch mua, ký bằng ví, và NFT chuyển vào ví người mua.
5. **Profile**: Hiển thị NFT sở hữu. Chọn NFT để "Sale" (list bán với giá), "Update Price" (cập nhật giá), hoặc "Delist" (rút NFT về ví).

**Chức năng nâng cao** (không tập trung trong khóa học beginner):
- Đấu giá (auction).
- Đưa offer (đề nghị giá).
- Tích hợp IPFS cho metadata.

### Các Chức Năng Chính Của NFT Marketplace
Một marketplace cơ bản cần 5 chức năng chính:
1. **Connect Wallet**: Kết nối ví Cardano (Eternl, Nami) để xác thực và ký giao dịch.
2. **Hiển thị danh sách NFT (List NFTs)**: Query on-chain để hiển thị NFT đang bán (sử dụng Blockfrost, không cần smart contract).
3. **List NFT (Bán NFT)**: Gửi NFT vào smart contract với giá bán.
4. **Update Price**: Cập nhật giá NFT đang list.
5. **Delist NFT**: Rút NFT về ví nếu không muốn bán nữa.
6. **Buy NFT**: Mua NFT từ người bán khác, chuyển ADA và nhận NFT.

**Logic Smart Contract**: 4 chức năng chính (list, update, delist, buy) cần smart contract để xử lý on-chain. Chức năng hiển thị chỉ cần query dữ liệu.

## Thiết Kế Giao Diện Người Dùng (UI)

Dựa trên demo, chúng ta thiết kế UI đơn giản với Next.js:
- **Layout chung**: Header với nút Connect Wallet, sidebar cho bộ lọc (giá, bộ sưu tập), main content cho danh sách NFT.
- **Trang chủ**: Grid hiển thị NFT (hình ảnh, tên, giá, nút Buy Now).
- **Trang chi tiết NFT**: Hiển thị metadata, nút Buy Now.
- **Profile**: Tab "Owned" (NFT sở hữu) và "Listing" (NFT đang bán). Nút Sale, Update Price, Delist.
- **Form Sale**: Input giá ADA, nút "List for Sale".

**Công cụ thiết kế**:
- Sử dụng Tailwind CSS cho styling.
- Tích hợp MeshJS cho ví và giao dịch.

**Mẫu UI cơ bản** (code sẵn trên GitHub hoặc preview link trong video):
- Trang `/marketplace`: Danh sách NFT.
- Trang `/profile`: Quản lý NFT sở hữu và listing.

## Demo Giao Diện Và Chức Năng

Giả sử bạn đã clone code từ GitHub và chạy `npm run dev`. Truy cập `http://localhost:3000` trên testnet.

### 1. Hiển Thị Danh Sách NFT Và Mua
- Trang chủ hiển thị NFT đang bán (query từ Blockfrost).
- Nhấp vào NFT (ví dụ: XMR08), nhập giá mua (3 ADA).
- Nhấn "Buy Now": Tạo giao dịch, ký bằng ví, chờ confirm.
- Kết quả: NFT xuất hiện trong ví (kiểm tra Eternl hoặc CardanoScan).

### 2. List NFT Để Bán
- Chuyển sang tab "Profile" > "Owned".
- Chọn NFT (ví dụ: BKI001), nhấn "Sale", nhập giá (1000 ADA).
- Nhấn "List": Tạo giao dịch gửi NFT vào smart contract.
- Kết quả: NFT di chuyển sang tab "Listing" với giá 1000 ADA + phí.

### 3. Update Giá
- Trong tab "Listing", chọn NFT, nhấn "Update Price", nhập giá mới (500 ADA).
- Nhấn "Update": Tạo giao dịch cập nhật giá.
- Kết quả: Giá cập nhật thành 500 ADA (chờ confirm).

### 4. Delist NFT
- Trong tab "Listing", chọn NFT, nhấn "Delist".
- Nhấn "Delete": Tạo giao dịch rút NFT về ví.
- Kết quả: NFT quay về tab "Owned" (chờ confirm).

**Lưu Ý Demo**:
- Sử dụng testnet với tADA và test NFT.
- Chờ 10-20 giây cho giao dịch confirm.
- Kiểm tra giao dịch trên [Cardano Testnet Explorer](https://testnet.cardanoscan.io/).

## Logic Smart Contract Cho Các Chức Năng

Smart contract (viết bằng Aiken) cần xử lý 4 chức năng chính:
1. **List NFT**: 
   - Input: NFT, giá ADA, địa chỉ người bán.
   - Logic: Khóa NFT trong contract với datum chứa giá và chủ sở hữu.
   - Output: NFT locked, emit event cho frontend query.

2. **Update Price**:
   - Input: NFT ID, giá mới (chỉ chủ sở hữu).
   - Logic: Kiểm tra chữ ký người bán, cập nhật datum giá.
   - Redeemer: "update_price".

3. **Delist NFT**:
   - Input: NFT ID (chỉ chủ sở hữu).
   - Logic: Rút NFT về ví người bán, xóa datum.
   - Redeemer: "delist".

4. **Buy NFT**:
   - Input: NFT ID, ADA từ người mua.
   - Logic: Kiểm tra ADA >= giá, chuyển NFT cho người mua, ADA cho người bán.
   - Redeemer: "buy".

**Datum Structure** (ví dụ):
```
{
  nft_id: String,
  price: Int,
  seller: Address,
  metadata: Map<String, String>
}
```

**Test Smart Contract**: Sử dụng Aiken test framework để kiểm tra các trường hợp (valid/invalid signer, insufficient funds).

## Kế Hoạch Triển Khai
- **Development**: Test trên testnet.
- **Production**: Deploy smart contract qua Cardano CLI, frontend lên Vercel/Netlify.
- **Tối Ưu**: Sử dụng IPFS cho metadata NFT, caching query với Redis.

## Tài Liệu Tham Khảo
- [JPG.Store Documentation](https://docs.jpg.store/): Hướng dẫn tích hợp.
- [Cardano Developer Portal](https://devs.cardano.org/): Hướng dẫn smart contract.
- [MeshJS](https://meshjs.dev/): Tích hợp ví và giao dịch.
- [Aiken Lang](https://aiken-lang.org/): Viết contract.

## Kết Luận
Phân tích này cung cấp nền tảng để xây dựng NFT Marketplace trên Cardano. Với UI đơn giản và logic contract cơ bản, bạn có thể bắt đầu code ngay. Các video tiếp theo sẽ hướng dẫn viết contract và tích hợp. Nếu bạn có ý tưởng khác (ví dụ: DeFi app), có thể áp dụng tương tự. Cảm ơn bạn đã theo dõi!
