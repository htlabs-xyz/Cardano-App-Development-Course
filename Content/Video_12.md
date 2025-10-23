# Video 12: Writing Test Cases and Offchain Code for Smart Contracts

Bài viết này hướng dẫn bạn cách viết test cases cho hợp đồng thông minh NFT Marketplace sử dụng ngôn ngữ Aiken, cũng như migrate logic sang offchain code bằng thư viện MeshJS (MJS) để tương tác thực tế trên blockchain Cardano. Nội dung dựa trên video hướng dẫn, tập trung vào các trường hợp test và xây dựng giao dịch (sale, buy, withdraw, update). Bài viết được thiết kế để bạn có thể thực hiện mà không cần xem video.

## Điều Kiện Tiên Quyết
- Aiken phiên bản 1.1.19 trở lên đã cài đặt.
- Node.js và npm để quản lý dự án TypeScript.
- Thư viện MeshJS phiên bản 1.8.14, Vitest cho testing, và dotenv cho biến môi trường.
- Ví Cardano (như Eternl) với địa chỉ testnet và một số ADA để test giao dịch.
- Project ID từ Blockfrost để kết nối blockchain testnet.

## Bước 1: Viết Test Cases Trong Aiken
Trong Aiken, chúng ta tập trung vào validator `spend` với hai redeemer: `Buy` và `WithdrawOrUpdate`. Test cases kiểm tra các trường hợp thành công và thất bại.

1. **Tạo File Test**:
   - Tạo file `marketplace_test.aiken` trong dự án Aiken.

2. **Định Nghĩa Datum Mẫu**:
   ```aiken
   fn mock_datum(id: Int) -> MarketplaceDatum {
     MarketplaceDatum {
       seller: mock_address(0),
       price: 200_000_000, // 200 ADA
       policy_id: mock_policy_id(id),
       asset_name: "test"
     }
   }
   ```

3. **Hàm Tạo Giao Dịch Test**:
   - Tạo các hàm như `get_buy_tx`, `get_withdraw_tx`, `get_update_tx` để mô phỏng giao dịch với các tham số (e.g., only_one_input_from_script, is_payment_valid, is_seller_signed).

4. **Các Test Cases**:
   - Test thành công cho `Buy` (chỉ một input, thanh toán đúng).
   - Test thất bại cho `Buy` (nhiều input, thanh toán không đủ).
   - Test thành công cho `Withdraw` và `Update` (người ký là seller).
   - Test thất bại cho `Withdraw` và `Update` (người ký không phải seller).
   
   Ví dụ test:
   ```aiken
   test success_buy() {
     let tx = get_buy_tx(true, true)
     marketplace.validator(mock_datum(0), Buy, tx.reference, tx)
   }

   test fail_buy_with_multiple_inputs() {
     let tx = get_buy_tx(false, true)
     !marketplace.validator(mock_datum(0), Buy, tx.reference, tx)
   }
   ```

5. **Chạy Test**:
   - Chạy lệnh `aiken check` để kiểm tra tất cả test cases pass.

## Bước 2: Migrate Sang Offchain Code Với MeshJS
Chuyển logic sang TypeScript sử dụng MeshJS để xây dựng giao dịch thực tế.

1. **Khởi Tạo Dự Án**:
   - Chạy `npm init -y` để tạo `package.json`.
   - Cài đặt thư viện: `npm install @meshsdk/core@1.8.14 vitest dotenv`.
   - Tạo file `.gitignore` (thêm `node_modules` và `.env`).
   - Tạo file `.env` với `BLOCKFROST_PROJECT_ID` và mnemonic cho ví test.

2. **Cấu Trúc Dự Án**:
   - Tạo folder `test` với `marketplace.test.ts`.
   - Tạo folder `src` với `mesh_adapter.ts` và `index.ts`.

3. **File `mesh_adapter.ts`** (Adapter cho MeshJS):
   ```typescript
   import { MeshTxBuilder, BrowserWallet } from '@meshsdk/core';
   import * as dotenv from 'dotenv';

   dotenv.config();

   export class MeshAdapter {
     wallet: BrowserWallet;
     provider: any; // BlockfrostProvider
     meshBuilder: MeshTxBuilder;

     constructor(wallet: BrowserWallet, provider: any) {
       this.wallet = wallet;
       this.provider = provider;
       this.meshBuilder = new MeshTxBuilder({ network: process.env.BLOCKFROST_PROJECT_ID.startsWith('preprod') ? 0 : 1 });
       // Load marketplace compiled code from Aiken build
       this.marketplaceCompiledCode = '/* Compiled code from Aiken */';
     }

     // Các hàm helper: getUtxosForTx, getUtxoByTxHash, readDatum, etc.
   }
   ```

4. **File `index.ts`** (Marketplace Contract):
   ```typescript
   import { MeshAdapter } from './mesh_adapter';

   export class MarketplaceContract extends MeshAdapter {
     async sale(unit: string, priceInLovelace: number): Promise<string> {
       // Build tx: add output to script address, attach datum
       // Return unsigned tx as hex
     }

     async buy(unit: string): Promise<string> {
       // Query UTXO from script, build tx with input from script, redeemer Buy
     }

     async withdraw(unit: string): Promise<string> {
       // Build tx to withdraw UTXO back to wallet
     }

     async update(unit: string, newPriceInLovelace: number): Promise<string> {
       // Build tx to update datum with new price
     }
   }
   ```

5. **File `marketplace.test.ts`** (Test Offchain):
   - Sử dụng Vitest để test các hàm sale, buy, withdraw, update.
   - Khởi tạo wallet và provider từ `.env`.
   - Test bằng cách build unsigned tx, sign, submit, và kiểm tra tx hash.

   Ví dụ:
   ```typescript
   import { describe, it, expect, beforeEach } from 'vitest';
   import { MarketplaceContract } from '../src/index';

   describe('Marketplace Tests', () => {
     let contract: MarketplaceContract;

     beforeEach(async () => {
       // Init wallet and provider
     });

     it('should sale NFT', async () => {
       const unsignedTx = await contract.sale('unit_here', 100_000_000);
       // Sign and submit, expect tx hash length 64
     });

     // Tương tự cho buy, withdraw, update
   });
   ```

6. **Chạy Test**:
   - Cập nhật `package.json` scripts: `"test": "vitest run"`.
   - Chạy `npm run test` để kiểm tra.

## Giải Thích Tổng Quan
- **Test Trong Aiken**: Kiểm tra logic validator với các trường hợp thành công/thất bại.
- **Offchain Với MeshJS**: Xây dựng giao dịch thực tế, sử dụng Blockfrost để query blockchain, và xử lý datum/redeemer.
- Các hàm chính: `sale` (liệt kê NFT), `buy` (mua), `withdraw` (rút/delisting), `update` (cập nhật giá).

## Bước 6: Kiểm Tra Và Debug
- Sử dụng console.log để xem unsigned tx.
- Kiểm tra giao dịch trên explorer như Preprod Cardano Scan.
- Xử lý lỗi: Đảm bảo UTXO tồn tại, datum đúng, và signer hợp lệ.

## Kết Luận
Bài viết cung cấp hướng dẫn hoàn chỉnh để test và triển khai offchain cho NFT Marketplace. Trong các bước tiếp theo, bạn có thể tích hợp vào ứng dụng Next.js với API để người dùng tương tác qua ví browser.

Nếu cần thêm chi tiết, tham khảo tài liệu MeshJS tại [https://meshjs.dev](https://meshjs.dev) hoặc Aiken tại [https://aiken-lang.org](https://aiken-lang.org).
