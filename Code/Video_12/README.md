## Project Overview

This is a full-stack Cardano NFT marketplace consisting of:
1. **Smart contracts** written in Aiken (Plutus V3) for on-chain validation
2. **Off-chain code** written in TypeScript using MeshSDK for transaction building

The marketplace allows sellers to list NFTs for sale, buyers to purchase them, and sellers to withdraw or update their listings.

## Build and Development Commands

### Smart Contract (Aiken)

**Build contracts:**
```sh
aiken build
```

**Run all tests:**
```sh
aiken check
```

**Run specific tests (e.g., matching "buy"):**
```sh
aiken check -m buy
```

**Run tests with detailed output:**
```sh
aiken check -D
```

**Check formatting:**
```sh
aiken fmt --check
```

**Auto-format:**
```sh
aiken fmt
```

**Generate documentation:**
```sh
aiken docs
```

### Off-chain (TypeScript)

**Install dependencies:**
```sh
bun install
```

**Run integration tests:**
```sh
bun test
```

## Architecture

### On-chain: Aiken Validator (`validators/marketplace.ak`)

The marketplace validator implements a Plutus V3 spend validator with two redeemers:

**1. Buy (mConStr0)** - Allows anyone to purchase an NFT by:
- Ensuring only one script input is consumed in the transaction (prevents batch purchases that could fail)
- Verifying the seller receives payment equal to listing price + the ADA that was locked with the NFT
- Payment validation uses `get_all_value_to()` to sum all outputs to seller address

**2. WithdrawOrUpdate (mConStr1)** - Allows only the seller to:
- Withdraw their NFT listing from the marketplace
- Update the listing (e.g., change price) by creating a new output with updated datum
- Requires seller's signature verification via `extra_signatories`

**Datum Structure (MarketplaceDatum):**
```aiken
pub type MarketplaceDatum {
  seller: Address,           // Seller's address for payment/signature
  price: Int,                // Listing price in lovelace
  policy_id: PolicyId,       // NFT policy ID
  asset_name: AssetName,     // NFT asset name
}
```

**Key validation patterns:**
- `inputs_at(tx.inputs, script_address)` - Filter inputs by address
- `value_geq(actual, expected)` - Compare values (≥ check)
- `address_pub_key(address)` - Extract public key hash for signature verification

### On-chain Testing: `validators/marketplace-test.ak`

Uses the **vodka/mocktail** library to construct mock transactions without blockchain interaction:

- `mocktail_tx()` - Create mock transaction builder
- `mock_pub_key_address(n, stake)` - Generate test addresses
- `mock_policy_id(n)` / `mock_pub_key_hash(n)` - Generate test identifiers
- `tx_in()`, `tx_out()`, `tx_in_inline_datum()` - Build transaction components
- `required_signer_hash()` - Add signatures
- `complete()` - Finalize mock transaction

Test coverage:
- ✓ `success_buy` - Valid purchase
- ✗ `fail_buy_with_mutiple_script_input` - Prevents batch exploits
- ✗ `fail_buy_without_proceed_paid` - Prevents underpayment
- ✓ `success_withdraw` - Valid seller withdrawal
- ✗ `fail_withdraw_without_signature` - Prevents unauthorized withdrawals
- ✓ `success_update` - Valid listing update
- ✗ `fail_update_without_signature` - Prevents unauthorized updates

### Off-chain: TypeScript Integration (`script/`)

**MeshAdapter (`script/mesh.ts`):**
Base class providing:
- Wallet and UTxO management (`getWalletForTx`, `getUtxoForTx`)
- Script compilation and address derivation from `plutus.json`
- Plutus data deserialization (`readPlutusData`)
- Network detection from `BLOCKFROST_PROJECT_ID` env var

**MarketplaceContract (`script/index.ts`):**
Extends MeshAdapter with transaction builders for each operation:

1. **sell()** - List NFT for sale
   - Creates output to marketplace script address with NFT + inline datum
   - Datum includes seller address, price, policy ID, asset name

2. **buy()** - Purchase NFT
   - Spends script UTXO with `mConStr0([])` redeemer (Buy)
   - Sends payment (price + locked ADA) to seller
   - Sends NFT to buyer

3. **withdraw()** - Remove listing
   - Spends script UTXO with `mConStr1([])` redeemer (WithdrawOrUpdate)
   - Returns NFT to seller wallet
   - Requires seller signature

4. **update()** - Change listing price
   - Spends script UTXO with `mConStr1([])` redeemer (WithdrawOrUpdate)
   - Creates new output to marketplace with updated datum
   - Requires seller signature

**Key Mesh patterns:**
- All transactions use `.spendingPlutusScriptV3()`
- Inline datums via `.txOutInlineDatumValue()` and `.txInInlineDatumPresent()`
- Script spending requires `.txInScript(cbor)` and `.txInRedeemerValue()`
- Signatures via `.requiredSignerHash(pubKeyHash)`

### Integration Tests (`tests/marketplace.test.ts`)

Bun tests that execute real transactions on Cardano preprod network:
- Uses two test wallets (WALLET1=seller, WALLET2=buyer)
- Connects to Blockfrost for chain interaction
- Tests: sell, buy, delist (withdraw), update
- Currently disabled with `return;` statements - remove to run on testnet

## Dependencies

**Aiken:**
- `aiken-lang/stdlib` (v2.2.0) - Standard library
- `sidan-lab/vodka` (0.1.16) - Validation utils (cocktail) and test utils (mocktail)

**TypeScript:**
- `@meshsdk/core` (1.8.14) - Transaction building and wallet management
- Bun runtime for testing

## Configuration

**aiken.toml:**
- Compiler: v1.1.19
- Plutus version: v3
- Network: preview/preprod (detected from Blockfrost API key)

**.env:**
Required environment variables:
- `BLOCKFROST_PROJECT_ID` - Blockfrost API key (network prefix determines testnet/mainnet)
- `WALLET1` - Seller wallet mnemonic (24 words)
- `WALLET2` - Buyer wallet mnemonic (24 words)

**plutus.json:**
Auto-generated by `aiken build` containing:
- Compiled validator code (CBOR)
- Type schemas for datum/redeemer
- Validator hash

## File Organization

```
validators/          Aiken smart contracts
  marketplace.ak       Main validator
  marketplace-test.ak  On-chain unit tests
script/              Off-chain transaction builders
  mesh.ts              Base adapter class
  index.ts             MarketplaceContract implementation
tests/               Integration tests (Bun)
  marketplace.test.ts  End-to-end testnet tests
lib/                 Shared Aiken functions (currently empty)
build/               Build artifacts (auto-generated)
plutus.json          Compiled validator output (auto-generated)
```

## Development Workflow

1. **Modify validator** in `validators/marketplace.ak`
2. **Run Aiken tests:** `aiken check` to verify on-chain logic
3. **Build contracts:** `aiken build` to regenerate `plutus.json`
4. **Update off-chain code** in `script/` if datum/redeemer changed
5. **Run integration tests:** `bun test` (requires testnet funds)

## CI Pipeline

GitHub Actions (`.github/workflows/continuous-integration.yml`):
1. Format check: `aiken fmt --check`
2. Run tests: `aiken check -D`
3. Build: `aiken build`

## Important Notes

- The validator enforces **single script input per transaction** during Buy to prevent complex multi-purchase exploits
- Payment validation includes both the listing price AND the original ADA locked with the NFT
- Update operation uses the same redeemer as Withdraw (both are `WithdrawOrUpdate`)
- Integration tests are currently disabled - enable by removing `return;` statements and funding test wallets
