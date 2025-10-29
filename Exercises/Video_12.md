# 📘 Video 12: Writing Test Cases and Offchain Code for Smart Contracts

## 📝 Bài tập 1: Tạo file test cho smart contract Marketplace

### Đề bài

Khởi tạo file test để kiểm thử logic của smart contract Marketplace viết bằng Aiken.

### Yêu cầu

- Tạo file `marketplace.test` trong thư mục `tests/`.
- Viết test đầu tiên kiểm tra khi người mua gửi đúng số ADA, giao dịch hợp lệ.
- Dùng lệnh `aiken test` để chạy.

<details>
<summary>Cách giải</summary>

Dùng lệnh tạo file test trong dự án Aiken và viết test cơ bản với `expect true`.

### Đáp án

```rust
use cardano/assets.{add, from_lovelace}
use cardano/transaction.{InlineDatum, Input, Transaction}
use marketplace.{Buy, MarketplaceDatum, WithdrawOrUpdate}
use mocktail.{
  add_input, complete, mock_script_address, mock_script_output, mock_tx_hash,
  mock_utxo_ref, mocktail_tx, required_signer_hash, tx_in, tx_in_inline_datum,
  tx_out, tx_out_inline_datum,
}
use mocktail/virgin_address.{mock_pub_key_address}
use mocktail/virgin_key_hash.{mock_policy_id, mock_pub_key_hash}

fn mock_datum() -> MarketplaceDatum {
  MarketplaceDatum {
    seller: mock_pub_key_address(0, None),
    price: 200_000_000,
    asset_name: "Test NFT",
    policy_id: mock_policy_id(0),
  }
}

fn get_buy_test_tx(
  is_only_one_input_from_script: Bool,
  is_process_paid: Bool,
) -> Transaction {
  let input_value =
    from_lovelace(2_000_000) |> add(mock_policy_id(0), "Test NFT", 1)

  mocktail_tx()
    |> tx_out(
        True,
        mock_pub_key_address(0, None),
        if is_process_paid {
          from_lovelace(202_000_000)
        } else {
          from_lovelace(100_000_000)
        },
      )
    |> complete()
    |> add_input(
        True,
        Input {
          output_reference: mock_utxo_ref(0, 1),
          output: mock_script_output(
            mock_script_address(0, None),
            input_value,
            InlineDatum(Some(mock_datum())),
          ),
        },
      )
    |> add_input(
        !is_only_one_input_from_script,
        Input {
          output_reference: mock_utxo_ref(0, 2),
          output: mock_script_output(
            mock_script_address(0, None),
            input_value,
            InlineDatum(Some(mock_datum())),
          ),
        },
      )
}

fn get_withdraw_test_tx(is_seller_signed: Bool) {
  mocktail_tx()
    |> tx_in(
        True,
        mock_tx_hash(0),
        1,
        from_lovelace(1_000_000),
        mock_script_address(0, None),
      )
    |> tx_in_inline_datum(True, mock_datum())
    |> required_signer_hash(
        True,
        if is_seller_signed {
          mock_pub_key_hash(0)
        } else {
          mock_pub_key_hash(5)
        },
      )
    |> complete()
}

fn get_update_test_tx(is_seller_signed: Bool) {
  let new_datum =
    MarketplaceDatum {
      seller: mock_pub_key_address(0, None),
      price: 500_000_000,
      asset_name: "Test NFT",
      policy_id: mock_policy_id(0),
    }

  mocktail_tx()
    |> tx_in(
        True,
        mock_tx_hash(0),
        1,
        from_lovelace(1_000_000),
        mock_script_address(0, None),
      )
    |> tx_in_inline_datum(True, mock_datum())
    |> tx_out_inline_datum(True, new_datum)
    |> required_signer_hash(
        True,
        if is_seller_signed {
          mock_pub_key_hash(0)
        } else {
          mock_pub_key_hash(5)
        },
      )
    |> complete()
}

test success_buy() {
  let output_reference = mock_utxo_ref(0, 1)
  let redeemer = Buy
  let is_only_one_input_from_script = True
  let is_process_paid = True

  let tx = get_buy_test_tx(is_only_one_input_from_script, is_process_paid)

  marketplace.marketplace.spend(
    Some(mock_datum()),
    redeemer,
    output_reference,
    tx,
  )
}

test fail_buy_with_mutiple_script_input() {
  let output_reference = mock_utxo_ref(0, 1)
  let redeemer = Buy
  let is_only_one_input_from_script = False
  let is_process_paid = True

  let tx = get_buy_test_tx(is_only_one_input_from_script, is_process_paid)

  !marketplace.marketplace.spend(
    Some(mock_datum()),
    redeemer,
    output_reference,
    tx,
  )
}

test fail_buy_without_proceed_paid() {
  let output_reference = mock_utxo_ref(0, 1)
  let redeemer = Buy
  let is_only_one_input_from_script = True
  let is_process_paid = False

  let tx = get_buy_test_tx(is_only_one_input_from_script, is_process_paid)

  !marketplace.marketplace.spend(
    Some(mock_datum()),
    redeemer,
    output_reference,
    tx,
  )
}

test success_withdraw() {
  let output_reference = mock_utxo_ref(0, 0)
  let redeemer = WithdrawOrUpdate
  let is_seller_signed = True

  let tx = get_withdraw_test_tx(is_seller_signed)

  marketplace.marketplace.spend(
    Some(mock_datum()),
    redeemer,
    output_reference,
    tx,
  )
}

test fail_withdraw_without_signature() {
  let output_reference = mock_utxo_ref(0, 0)
  let redeemer = WithdrawOrUpdate
  let is_seller_signed = False

  let tx = get_withdraw_test_tx(is_seller_signed)

  !marketplace.marketplace.spend(
    Some(mock_datum()),
    redeemer,
    output_reference,
    tx,
  )
}

test success_update() {
  let output_reference = mock_utxo_ref(0, 0)
  let redeemer = WithdrawOrUpdate
  let is_seller_signed = True

  let tx = get_update_test_tx(is_seller_signed)

  marketplace.marketplace.spend(
    Some(mock_datum()),
    redeemer,
    output_reference,
    tx,
  )
}

test fail_update_without_signature() {
  let output_reference = mock_utxo_ref(0, 0)
  let redeemer = WithdrawOrUpdate
  let is_seller_signed = False

  let tx = get_update_test_tx(is_seller_signed)

  !marketplace.marketplace.spend(
    Some(mock_datum()),
    redeemer,
    output_reference,
    tx,
  )
}
```

</details>

---

## 📝 Bài tập 2: Viết test case cho hàm `buy` khi người mua gửi sai số tiền

### Đề bài

Kiểm tra trường hợp giao dịch không hợp lệ khi người mua gửi sai số tiền.

### Yêu cầu

- Thêm test mới trong `marketplace.test`.
- Kiểm tra giá trị ADA nhỏ hơn giá NFT.
- Kết quả mong đợi: test phải **fail**.

<details>
<summary>Cách giải</summary>

So sánh giá trị `ada_sent` khác `nft_price` trong test.

### Đáp án

```rust
use cardano/assets.{add, from_lovelace}
use cardano/transaction.{InlineDatum, Input, Transaction}
use marketplace.{Buy, MarketplaceDatum, WithdrawOrUpdate}
use mocktail.{
  add_input, complete, mock_script_address, mock_script_output, mock_tx_hash,
  mock_utxo_ref, mocktail_tx, required_signer_hash, tx_in, tx_in_inline_datum,
  tx_out, tx_out_inline_datum,
}
use mocktail/virgin_address.{mock_pub_key_address}
use mocktail/virgin_key_hash.{mock_policy_id, mock_pub_key_hash}

fn mock_datum() -> MarketplaceDatum {
  MarketplaceDatum {
    seller: mock_pub_key_address(0, None),
    price: 200_000_000,
    asset_name: "Test NFT",
    policy_id: mock_policy_id(0),
  }
}

fn get_buy_test_tx(
  is_only_one_input_from_script: Bool,
  is_process_paid: Bool,
) -> Transaction {
  let input_value =
    from_lovelace(2_000_000) |> add(mock_policy_id(0), "Test NFT", 1)

  mocktail_tx()
    |> tx_out(
        True,
        mock_pub_key_address(0, None),
        if is_process_paid {
          from_lovelace(202_000_000)
        } else {
          from_lovelace(100_000_000)
        },
      )
    |> complete()
    |> add_input(
        True,
        Input {
          output_reference: mock_utxo_ref(0, 1),
          output: mock_script_output(
            mock_script_address(0, None),
            input_value,
            InlineDatum(Some(mock_datum())),
          ),
        },
      )
    |> add_input(
        !is_only_one_input_from_script,
        Input {
          output_reference: mock_utxo_ref(0, 2),
          output: mock_script_output(
            mock_script_address(0, None),
            input_value,
            InlineDatum(Some(mock_datum())),
          ),
        },
      )
}

fn get_withdraw_test_tx(is_seller_signed: Bool) {
  mocktail_tx()
    |> tx_in(
        True,
        mock_tx_hash(0),
        1,
        from_lovelace(1_000_000),
        mock_script_address(0, None),
      )
    |> tx_in_inline_datum(True, mock_datum())
    |> required_signer_hash(
        True,
        if is_seller_signed {
          mock_pub_key_hash(0)
        } else {
          mock_pub_key_hash(5)
        },
      )
    |> complete()
}

fn get_update_test_tx(is_seller_signed: Bool) {
  let new_datum =
    MarketplaceDatum {
      seller: mock_pub_key_address(0, None),
      price: 500_000_000,
      asset_name: "Test NFT",
      policy_id: mock_policy_id(0),
    }

  mocktail_tx()
    |> tx_in(
        True,
        mock_tx_hash(0),
        1,
        from_lovelace(1_000_000),
        mock_script_address(0, None),
      )
    |> tx_in_inline_datum(True, mock_datum())
    |> tx_out_inline_datum(True, new_datum)
    |> required_signer_hash(
        True,
        if is_seller_signed {
          mock_pub_key_hash(0)
        } else {
          mock_pub_key_hash(5)
        },
      )
    |> complete()
}

test success_buy() {
  let output_reference = mock_utxo_ref(0, 1)
  let redeemer = Buy
  let is_only_one_input_from_script = True
  let is_process_paid = True

  let tx = get_buy_test_tx(is_only_one_input_from_script, is_process_paid)

  marketplace.marketplace.spend(
    Some(mock_datum()),
    redeemer,
    output_reference,
    tx,
  )
}

test fail_buy_with_mutiple_script_input() {
  let output_reference = mock_utxo_ref(0, 1)
  let redeemer = Buy
  let is_only_one_input_from_script = False
  let is_process_paid = True

  let tx = get_buy_test_tx(is_only_one_input_from_script, is_process_paid)

  !marketplace.marketplace.spend(
    Some(mock_datum()),
    redeemer,
    output_reference,
    tx,
  )
}

test fail_buy_without_proceed_paid() {
  let output_reference = mock_utxo_ref(0, 1)
  let redeemer = Buy
  let is_only_one_input_from_script = True
  let is_process_paid = False

  let tx = get_buy_test_tx(is_only_one_input_from_script, is_process_paid)

  !marketplace.marketplace.spend(
    Some(mock_datum()),
    redeemer,
    output_reference,
    tx,
  )
}

test success_withdraw() {
  let output_reference = mock_utxo_ref(0, 0)
  let redeemer = WithdrawOrUpdate
  let is_seller_signed = True

  let tx = get_withdraw_test_tx(is_seller_signed)

  marketplace.marketplace.spend(
    Some(mock_datum()),
    redeemer,
    output_reference,
    tx,
  )
}

test fail_withdraw_without_signature() {
  let output_reference = mock_utxo_ref(0, 0)
  let redeemer = WithdrawOrUpdate
  let is_seller_signed = False

  let tx = get_withdraw_test_tx(is_seller_signed)

  !marketplace.marketplace.spend(
    Some(mock_datum()),
    redeemer,
    output_reference,
    tx,
  )
}

test success_update() {
  let output_reference = mock_utxo_ref(0, 0)
  let redeemer = WithdrawOrUpdate
  let is_seller_signed = True

  let tx = get_update_test_tx(is_seller_signed)

  marketplace.marketplace.spend(
    Some(mock_datum()),
    redeemer,
    output_reference,
    tx,
  )
}

test fail_update_without_signature() {
  let output_reference = mock_utxo_ref(0, 0)
  let redeemer = WithdrawOrUpdate
  let is_seller_signed = False

  let tx = get_update_test_tx(is_seller_signed)

  !marketplace.marketplace.spend(
    Some(mock_datum()),
    redeemer,
    output_reference,
    tx,
  )
}
```

</details>

---

## 📝 Bài tập 3: Cấu hình Mesh SDK và Blockfrost Provider

### Đề bài

Cài đặt và cấu hình môi trường offchain với Mesh SDK.

### Yêu cầu

- Cài Mesh SDK bằng npm.
- Tạo file `.env` lưu Project ID của Blockfrost.
- Cấu hình provider trong code.

### Cách giải

Cài Mesh và tạo provider với Project ID từ Blockfrost.

<details>
<summary>Cách giải</summary>

```bash
npm install @meshsdk/core @meshsdk/common
```

```ts
import { BlockfrostProvider } from "@meshsdk/core";

const provider = new BlockfrostProvider("mainnet", process.env.BLOCKFROST_ID);
```

</details>

---

## 📝 Bài tập 4: Viết hàm `sell()` trong offchain code

### Đề bài

Tạo hàm TypeScript `sale()` để đăng bán NFT trên marketplace.

### Yêu cầu

- Truyền vào tham số: `asset`, `price`, `sellerAddress`.
- Dùng Mesh SDK để tạo giao dịch có metadata và output kèm datum.
- Trả về hash giao dịch sau khi submit.

<details>
<summary>Cách giải</summary>

Dùng Mesh SDK với `Transaction().sendAssets().attachMetadata()` và `submit()`.

### Đáp án

```ts
import { Transaction } from "@meshsdk/core";

async function sale(asset, price, sellerAddress) {
  const tx = new Transaction({ initiator: sellerAddress })
    .sendAssets({ address: MARKETPLACE_ADDR, assets: { [asset]: 1 } })
    .attachMetadata(721, { price })
    .build();

  const txHash = await tx.submit();
  return txHash;
}
```

</details>

---

## 📝 Bài tập 5: Kiểm thử giao dịch offchain bằng Vitest

### Đề bài

Viết test kiểm thử giao dịch `sale()` bằng Vitest.

### Yêu cầu

- Cài Vitest và viết test đơn giản gọi `sale()`.
- In ra `txHash` nếu giao dịch thành công.
- Sử dụng mô phỏng (mock) provider khi test.

<details>
<summary>Cách giải</summary>

Sử dụng `vi.fn()` để tạo mock provider và xác minh hàm được gọi.

### Đáp án

```ts
import { describe, it, expect, vi } from "vitest";
import { sale } from "./marketplace";

describe("Marketplace sale", () => {
  it("should return tx hash", async () => {
    const mockProvider = vi.fn().mockResolvedValue("mockTxHash123");
    const result = await sale("asset1", 100, "addr_test1...");
    expect(result).toBeDefined();
  });
});
```

</details>

---
