
This is Video_08 from a Cardano App Development Course. This directory contains a simple Aiken smart contract project demonstrating a "Hello World" validator on the Cardano blockchain. The repository is part of a larger course with multiple video lessons (Video_02 through Video_13), where earlier videos cover Next.js + MeshSDK integration, and later videos (like Video_12) cover full marketplace implementations.

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

## Development Workflow

1. **Write validators** in `validators/` with `.ak` extension
2. **Write shared functions** in `lib/` if needed across multiple validators
3. **Add tests** inline using `test` keyword or in separate test files
4. **Run tests** with `aiken check` to validate logic
5. **Build** with `aiken build` to generate `plutus.json` for off-chain integration
6. **Format** with `aiken fmt` before committing

## Integration with Off-chain Code

After building (`aiken build`), the generated `plutus.json` contains:
- Compiled validator CBOR (for submitting to blockchain)
- Type schemas for datum/redeemer
- Validator hash (for deriving script addresses)

This file is used by off-chain transaction builders (typically MeshSDK or Lucid in TypeScript/JavaScript) to interact with the smart contract on Cardano.
