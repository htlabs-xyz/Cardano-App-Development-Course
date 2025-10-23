## Project Overview

This is a Cardano smart contract project written in Aiken (v1.1.19) for an NFT marketplace. The project uses Plutus V3 and allows sellers to list NFTs for sale, buyers to purchase them, and sellers to withdraw or update their listings.

## Build and Development Commands

### Building
```sh
aiken build
```

### Testing
Run all tests:
```sh
aiken check
```

Run tests matching a specific string (e.g., "buy"):
```sh
aiken check -m buy
```

Run tests with detailed output:
```sh
aiken check -D
```

### Formatting
Check code formatting:
```sh
aiken fmt --check
```

Auto-format code:
```sh
aiken fmt
```

### Documentation
Generate HTML documentation:
```sh
aiken docs
```

## Architecture

### Core Validator: `validators/marketplace.ak`

The marketplace validator implements a spend validator with two redeemers:

1. **Buy** - Allows anyone to purchase an NFT by:
   - Ensuring only one script input is consumed in the transaction
   - Verifying the seller receives payment (listing price + original ADA locked with NFT)

2. **WithdrawOrUpdate** - Allows only the seller to:
   - Withdraw their NFT listing from the marketplace
   - Update the listing (price, etc.) by creating a new output with updated datum
   - Requires seller's signature verification via `extra_signatories`

**Datum Structure:**
- `seller`: Address of the NFT owner
- `price`: Listing price in lovelace
- `policy_id`: NFT policy ID
- `asset_name`: NFT asset name

### Testing: `validators/marketplace-test.ak`

Tests use the `mocktail` library (from vodka package) to construct mock transactions. Each test validates specific scenarios:
- `success_buy`: Valid purchase transaction
- `fail_buy_with_mutiple_script_input`: Rejects purchases consuming multiple listings
- `fail_buy_without_proceed_paid`: Rejects underpayment
- `success_withdraw`: Valid seller withdrawal
- `fail_withdraw_without_signature`: Rejects unauthorized withdrawals
- `success_update`: Valid listing update
- `fail_update_without_signature`: Rejects unauthorized updates

## Dependencies

- **aiken-lang/stdlib** (v2.2.0): Standard library for Aiken
- **sidan-lab/vodka** (0.1.16): Provides utility functions for validators and testing
  - `cocktail`: Validation utilities (prefixed with `vodka_*`)
  - `mocktail`: Unit test utilities for building mock transactions

## Key Vodka Utilities Used

- `vodka_address.address_pub_key`: Extract public key hash from address
- `vodka_inputs.inputs_at`: Filter inputs by address
- `vodka_value.get_all_value_to`: Sum all value sent to an address
- `vodka_value.value_geq`: Compare values (greater than or equal)
- `mocktail.*`: Mock transaction builders for testing

## File Organization

- `validators/`: Validator scripts (`.ak` files)
  - Main validators go here
  - Test files use `-test.ak` suffix
- `lib/`: Supporting library functions (currently empty)
- `build/`: Build artifacts and dependencies (auto-generated)

## CI Pipeline

GitHub Actions runs on push to main and on PRs:
1. Format check: `aiken fmt --check`
2. Run tests: `aiken check -D`
3. Build: `aiken build`
