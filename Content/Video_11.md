# Video 11: Aiken Smart Contract

Bài viết này hướng dẫn bạn cách tạo một hợp đồng thông minh cho một NFT Marketplace sử dụng ngôn ngữ lập trình Aiken. Chúng ta sẽ tập trung vào phần logic của hợp đồng thông minh, đặc biệt là các giao dịch liên quan đến việc mua, rút hoặc cập nhật NFT. Bài viết giả định bạn có kiến thức cơ bản về blockchain và Aiken, nhưng sẽ cung cấp hướng dẫn từng bước dựa trên nội dung của video.

## Điều Kiện Tiên Quyết

Trước khi bắt đầu, hãy đảm bảo bạn đã chuẩn bị:

- Aiken được cài đặt trên hệ thống (khuyến nghị phiên bản 1.1.19 trở lên).
- Một trình soạn thảo mã (ví dụ: VS Code) để viết script Aiken.
- Hiểu biết cơ bản về các khái niệm blockchain như UTXO, datum và redeemer.

## Bước 1: Thiết Lập Môi Trường Aiken

Để bắt đầu, bạn cần cài đặt Aiken và tạo một dự án mới.

1. **Cài Đặt Aiken**:

   - Sử dụng npm để cài đặt Aiken. Chạy lệnh sau trong terminal:
     ```bash
     npm install -g aiken@1.1.19
     ```
   - Kiểm tra cài đặt bằng cách xem phiên bản Aiken:
     ```bash
     aiken -V
     ```
     Nếu thành công, bạn sẽ thấy phiên bản `1.1.19`.

2. **Tạo Dự Án Aiken Mới**:

   - Chạy lệnh sau để tạo một dự án mới có tên `nft_marketplace`:
     ```bash
     aiken new nft_marketplace
     ```
   - Lệnh này sẽ tạo ra một cấu trúc dự án với các tệp mặc định, bao gồm một tệp `pr_holder`.

3. **Sửa Đổi Cấu Trúc Dự Án**:
   - Đổi tên tệp `pr_holder` thành `smart_contract` (hoặc một tên khác, ví dụ: `marketplace`).
   - Trong dự án, tập trung vào validator script `spend`, vì bài hướng dẫn này chỉ sử dụng validator `spend` cho các giao dịch NFT. Xóa hoặc vô hiệu hóa các validator script khác (như `mint`, `burn`) bằng cách đặt chúng thành `fail` trong cấu hình để ngăn chúng thực thi.

## Bước 2: Định Nghĩa Datum

Datum là dữ liệu được lưu trữ trên blockchain cho mỗi NFT được liệt kê trên marketplace. Nó chứa thông tin quan trọng về NFT và giao dịch bán.

Định nghĩa `MarketplaceDatum` với các trường sau:

- **seller**: Địa chỉ của người bán (public key hash của người liệt kê NFT).
- **price**: Giá của NFT tính bằng Lovelace (đơn vị tiền tệ của Cardano).
- **policy_id** (tùy chọn): ID chính sách của NFT, xác định loại token.
- **asset_name** (tùy chọn): Tên của NFT.

Ví dụ khai báo datum trong Aiken:

```aiken
type MarketplaceDatum {
  seller: Address,
  price: Int,
  policy_id: PolicyId,
  asset_name: AssetName
}
```

### Giải Thích:

- Dữ liệu trong datum sẽ được đính kèm vào UTXO khi NFT được liệt kê trên blockchain.
- Khi thực hiện giao dịch (mua hoặc rút NFT), thông tin trong datum sẽ được sử dụng để xác thực giao dịch.

## Bước 3: Định Nghĩa Redeemer

Redeemer xác định hành động mà người dùng muốn thực hiện với hợp đồng thông minh. Trong trường hợp này, hợp đồng hỗ trợ hai hành động chính:

- **Buy**: Dành cho người mua NFT.
- **WithdrawOrUpdate**: Dành cho người bán, để rút hoặc cập nhật danh sách NFT.

Khai báo redeemer trong Aiken:

```aiken
type MarketplaceRedeemer {
  Buy,
  WithdrawOrUpdate
}
```

## Bước 4: Xây Dựng Logic Validator

Validator là phần cốt lõi của hợp đồng thông minh, kiểm tra xem giao dịch có hợp lệ hay không. Chúng ta sẽ chỉ sử dụng validator `spend` và định nghĩa logic cho hai hành động: `Buy` và `WithdrawOrUpdate`.

### 4.1. Kiểm Tra Datum

Đầu tiên, validator cần kiểm tra xem giao dịch có chứa datum hợp lệ hay không:

- Sử dụng hàm `expect_some` để lấy datum từ giao dịch:

```aiken
let datum = expect_some(tx.datum, "No datum found")
```

### 4.2. Logic cho Redeemer `Buy`

Hành động `Buy` cho phép người dùng mua NFT từ marketplace. Có hai điều kiện cần kiểm tra:

#### Điều Kiện 1: Chỉ Có Một Input Từ Script

Giao dịch mua chỉ được phép sử dụng đúng một UTXO từ script (tức là chỉ mua một NFT tại một thời điểm). Để kiểm tra:

- Lấy địa chỉ của script từ input:

```aiken
let script_input = expect_some(tx.inputs.find(|input| input.is_script), "No script input")
let script_address = script_input.address
```

- Kiểm tra xem chỉ có một input từ script:

```aiken
let is_only_one_input = tx.inputs.filter(|input| input.address == script_address).length == 1
```

Nếu có nhiều hơn một input hoặc không có input nào từ script, giao dịch sẽ bị từ chối.

#### Điều Kiện 2: Thanh Toán Đúng Giá

Người mua phải chuyển đúng số tiền (bao gồm giá NFT và bất kỳ ADA tối thiểu nào đính kèm trong UTXO). Để kiểm tra:

- Lấy tổng giá trị được chuyển đến địa chỉ của người bán (`seller`):

```aiken
let total_value_to_seller = get_own_value_to(tx, datum.seller)
```

- So sánh giá trị này với giá trong datum cộng với giá trị ADA tối thiểu của UTXO:

```aiken
let required_value = datum.price + value_of(script_input.output, "ada")
let is_payment_valid = total_value_to_seller >= required_value
```

- Hàm `get_own_value_to` nằm trong thư viện `value` của Aiken, dùng để tính tổng giá trị được gửi đến một địa chỉ cụ thể.

Giao dịch `Buy` chỉ hợp lệ nếu cả hai điều kiện đều đúng:

```aiken
is_only_one_input && is_payment_valid
```

### 4.3. Logic cho Redeemer `WithdrawOrUpdate`

Hành động `WithdrawOrUpdate` cho phép người bán rút NFT hoặc cập nhật danh sách. Logic đơn giản hơn, chỉ cần kiểm tra xem người thực hiện giao dịch có phải là `seller` hay không:

- Lấy danh sách người ký giao dịch:

```aiken
let signers = tx.signers
```

- Kiểm tra xem `seller` có trong danh sách người ký không:

```aiken
let is_seller = signers.has(datum.seller)
```

Giao dịch `WithdrawOrUpdate` hợp lệ nếu `is_seller` là `true`.

### 4.4. Kết Hợp Logic Validator

Kết hợp logic cho cả hai redeemer:

```aiken
use aiken/collection/list
use cardano/address.{Address}
use cardano/assets.{AssetName, PolicyId, from_lovelace, lovelace_of}
use cardano/transaction.{OutputReference, Transaction, find_input}
use cocktail/vodka_address.{address_pub_key}
use cocktail/vodka_inputs.{inputs_at}
use cocktail/vodka_value.{get_all_value_to, value_geq}

pub type MarketplaceDatum {
  seller: Address,
  price: Int,
  policy_id: PolicyId,
  asset_name: AssetName,
}

pub type MarketplaceRedeemer {
  Buy
  WithdrawOrUpdate
}

validator marketplace {
  spend(
    datum: Option<MarketplaceDatum>,
    redeemer: MarketplaceRedeemer,
    utxo: OutputReference,
    tx: Transaction,
  ) {
    expect Some(datum) = datum
    when redeemer is {
      Buy -> {
        expect Some(script_input) = find_input(tx.inputs, utxo)
        let script_address = script_input.output.address
        let is_only_one_input_from_script =
          when inputs_at(tx.inputs, script_address) is {
            [_] -> True
            _ -> False
          }
        let is_process_paid =
          get_all_value_to(tx.outputs, datum.seller)
            |> value_geq(
                from_lovelace(
                  datum.price + lovelace_of(script_input.output.value),
                ),
              )
        is_only_one_input_from_script && is_process_paid
      }

      WithdrawOrUpdate -> {
        expect Some(pub_key) = address_pub_key(datum.seller)
        list.has(tx.extra_signatories, pub_key)
      }
    }
  }

  else(_) {
    fail @"unsupport this purpose"
  }
}
```

## Bước 5: Giải Thích Tổng Quan

- **Datum**: Lưu trữ thông tin về NFT (người bán, giá, policy ID, tên tài sản). Thông tin này được đính kèm vào UTXO khi NFT được liệt kê và dùng để xác thực giao dịch.
- **Redeemer**: Định nghĩa hai hành động:
  - `Buy`: Dành cho người mua, yêu cầu kiểm tra chỉ có một input từ script và thanh toán đúng giá.
  - `WithdrawOrUpdate`: Dành cho người bán, chỉ cần kiểm tra xem người ký giao dịch có phải là `seller` hay không.
- **Validator**: Sử dụng validator `spend` để xử lý các giao dịch lấy NFT từ marketplace (mua hoặc rút/cập nhật).

## Bước 6: Kiểm Tra và Test

Trong video, phần test case không được đề cập chi tiết, nhưng bạn nên viết các test case để kiểm tra các trường hợp sau:

- **Trường hợp `Buy`**:
  - Người mua không trả đủ tiền.
  - Giao dịch có nhiều hơn một input từ script.
  - Giao dịch không có input nào từ script.
- **Trường hợp `WithdrawOrUpdate`**:
  - Người thực hiện giao dịch không phải là `seller`.

Bạn có thể sử dụng công cụ test của Aiken để mô phỏng các giao dịch và kiểm tra logic.

## Kết Luận

Hợp đồng thông minh này cung cấp logic cơ bản cho một NFT Marketplace, cho phép mua và rút/cập nhật NFT một cách an toàn. Phần logic tập trung vào việc đảm bảo chỉ một NFT được mua tại một thời điểm và người bán nhận được đúng số tiền, trong khi hành động rút/cập nhật chỉ được thực hiện bởi người bán hợp lệ.

Trong các bước tiếp theo, bạn có thể:

- Viết test case chi tiết để kiểm tra mọi trường hợp có thể xảy ra.
- Tích hợp hợp đồng vào một ứng dụng thực tế hoặc triển khai trên blockchain Cardano.

Nếu bạn cần thêm thông tin hoặc hỗ trợ, hãy tham khảo tài liệu chính thức của Aiken tại [https://aiken-lang.org](https://aiken-lang.org).
