
This is Video_08 from a Cardano App Development Course. This directory contains a simple Aiken smart contract project demonstrating a "Hello World" validator on the Cardano blockchain. Videos cover Next.js + MeshSDK integration.
## Build Commands

### Compile contracts
```sh
aiken build
```
This generates compiled Plutus code in `build/` and `plutus.json`.

### Run all tests
```sh
aiken check
```

### Run specific tests matching a pattern
```sh
aiken check -m <pattern>
# Example: aiken check -m hello_world
```

### Run tests with detailed output
```sh
aiken check -D
```

### Format code
```sh
aiken fmt
```

### Check formatting without modifying files
```sh
aiken fmt --check
```

### Generate HTML documentation
```sh
aiken docs
```

## Architecture

### Project Structure
```
validators/     Smart contract validators (.ak files)
lib/           Shared Aiken library functions (currently empty)
env/           Conditional environment modules (currently empty)
build/         Compiled artifacts (auto-generated, gitignored)
aiken.toml     Project configuration
plutus.json    Compiled validator output (auto-generated)
```

### Current Validator: Hello World (`validators/contract.ak`)

A spend validator demonstrating basic Cardano smart contract patterns:

**Datum:** Contains `owner` (VerificationKeyHash)
**Redeemer:** Contains `msg` (ByteArray)

**Validation Logic:**
1. Extracts owner from datum
2. Checks redeemer message equals "Hello, World!"
3. Verifies transaction is signed by owner (via `extra_signatories`)

**Test Pattern:**
Tests are written inline using the `test` keyword with mock data:
- Uses `transaction.placeholder` with overridden fields
- Creates placeholder UTxO references for testing

### Aiken Configuration (`aiken.toml`)

- **Compiler:** v1.1.19
- **Plutus version:** v3
- **Dependencies:** `aiken-lang/stdlib` v3.0.0
- Network configuration can be set in `[config.default]` section or via environment modules in `env/`

## Integration with Off-chain Code

After building (`aiken build`), the generated `plutus.json` contains:
- Compiled validator CBOR (for submitting to blockchain)
- Type schemas for datum/redeemer
- Validator hash (for deriving script addresses)

This file is used by off-chain transaction builders (typically MeshSDK or Lucid in TypeScript/JavaScript) to interact with the smart contract on Cardano.
