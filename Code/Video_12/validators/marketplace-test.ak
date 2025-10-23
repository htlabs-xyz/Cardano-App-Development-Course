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
