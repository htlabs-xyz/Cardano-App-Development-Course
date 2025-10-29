# 🧠 Video 11: Aiken Smart Contract

## 📝 Bài tập 1: Khởi tạo dự án Aiken mới

### Đề bài

Khởi tạo dự án Aiken mới và cấu hình cơ bản cho Marketplace.

### Yêu cầu

- Cài đặt Aiken bằng lệnh:
  ```bash
  npm install -g aiken@latest
  ```
- Kiểm tra phiên bản:
  ```bash
  aiken -V
  ```
  (phiên bản nên ≥ `1.1.19`)
- Tạo dự án mới:
  ```bash
  aiken new ft_marketplace
  ```
- Đổi tên thư mục chính thành `smart_contract` và mở bằng VSCode.

<details>
<summary>Cách giải</summary>

1. Chạy các lệnh trên để khởi tạo.
2. Xóa module mẫu không cần thiết, chỉ giữ `spend`.
3. Cấu hình lại file `aiken.toml` nếu cần.

### Đáp án

Sau khi hoàn thành, thư mục sẽ có cấu trúc:

```
ft_marketplace/
 ├── validators/
 │   └── marketplace.ak
 ├── aiken.toml
 └── lib/
```

</details>

---

## 📝 Bài tập 2: Khai báo Datum và Redeemer

### Đề bài

Tạo kiểu dữ liệu `MarketplaceDatum` và `MarketplaceRedeemer` để mô tả thông tin NFT niêm yết và hành động của người dùng.

### Yêu cầu

- `Datum` chứa các trường:
  - `seller: Address`
  - `price: Int`
  - `policy_id: PolicyId`
  - `asset_name: ByteArray`
- `Redeemer` có 2 lựa chọn:
  - `Buy`
  - `WithdrawOrUpdate`

<details>
<summary>Cách giải</summary>

Thêm vào file `marketplace.ak` đoạn code sau:

```aiken
type MarketplaceDatum {
  seller: Address,
  price: Int,
  policy_id: PolicyId,
  asset_name: ByteArray
}

type MarketplaceRedeemer {
  Buy,
  WithdrawOrUpdate
}
```

### Đáp án

Hai kiểu dữ liệu này sẽ được dùng trong validator để phân biệt loại giao dịch và xác định điều kiện hợp lệ.

</details>

---

## 📝 Bài tập 3: Viết điều kiện giao dịch “Buy”

### Đề bài

Viết logic kiểm tra tính hợp lệ khi người mua thực hiện lệnh **Buy**.

### Yêu cầu

- Chỉ có **1 input** đến từ script (đảm bảo không double-spend).
- Giá trị ADA trả cho `seller` ≥ `datum.price + minAda`.

<details>
<summary>Cách giải</summary>

1. Lấy địa chỉ script từ input hiện tại.
2. Kiểm tra input duy nhất.
3. Xác minh tổng ADA gửi cho người bán.

### Đáp án

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

</details>

---

## 📝 Bài tập 4: Viết điều kiện “WithdrawOrUpdate”

### Đề bài

Xác thực khi người bán muốn rút NFT hoặc cập nhật giá bán.

### Yêu cầu

- Chỉ người bán (`datum.seller`) có thể thực hiện hành động này.
- Xác minh rằng địa chỉ của người ký (`tx.signatories`) trùng với `datum.seller`.

<details>
<summary>Cách giải</summary>

Dùng hàm `has_key()` để kiểm tra xem seller có trong danh sách người ký không.

### Đáp án

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

Nếu điều kiện không đúng, giao dịch bị từ chối.

</details>

---

## 📝 Bài tập 5: Hoàn thiện Validator Logic

### Đề bài

Kết hợp cả hai điều kiện “Buy” và “WithdrawOrUpdate” để hoàn thiện validator `marketplace`.

### Yêu cầu

- Lấy `datum`, `redeemer`, và `tx` từ context.
- Gọi hàm kiểm tra tương ứng.
- Nếu điều kiện sai, trả lỗi qua `fail_if_false`.

<details>
<summary>Cách giải</summary>

Viết logic phân nhánh dựa vào loại redeemer.

### Đáp án

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

Validator này xử lý được cả 2 loại giao dịch chính, đảm bảo:

- Người mua trả đủ ADA.
- Người bán duy nhất được quyền rút hoặc cập nhật NFT.

</details>

---
