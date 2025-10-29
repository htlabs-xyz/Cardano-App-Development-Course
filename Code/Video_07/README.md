This is a Cardano blockchain dApp built with Next.js 15, React 19, and the Mesh SDK. It's part of a Cardano App Development Course (Video 07) demonstrating how to build blockchain applications for minting NFTs and sending ADA transactions on the Cardano preprod testnet.

## Commands

### Development
```bash
npm run dev    # Start development server on http://localhost:3000
bun dev        # Alternative using Bun runtime
```

### Build & Deploy
```bash
npm run build  # Build production bundle
npm start      # Start production server
npm run lint   # Run ESLint checks
```

## Architecture

### Directory Structure

The application uses Next.js App Router with route groups for separation of concerns:

- `src/app/(client)/` - Client-side rendered pages with wallet interactions
  - `/mint` - NFT minting interface
  - `/send` - ADA transaction interface
  - `/view/[id]` - Dynamic NFT viewer
  - `/dynamic/[name]` - Dynamic routing example

- `src/app/(server)/api/` - Server-side API routes
  - `/cardano/mint` - Server-side NFT minting transaction builder
  - `/cardano/send` - Server-side ADA transaction builder
  - `/cardano/[address]` - Fetch wallet UTXOs via Blockfrost
  - `/tasks/*` - Demo API endpoints

- `src/components/` - Reusable components
  - `wallet-connect/` - Wallet connection UI and state management

### Key Architectural Patterns

**Client-Server Split Architecture**: The app implements a hybrid transaction building approach:
- Client-side pages handle user input and wallet signing
- Server-side API routes build unsigned transactions using Blockfrost API
- This pattern can be adapted to either full client-side or full server-side depending on use case

**Wallet Management**: Centralized using Zustand store (`use-wallet.ts`) with the following capabilities:
- Connect/disconnect wallet
- Sign transactions (`signTx`)
- Submit transactions (`submitTx`)
- Access to `BrowserWallet` instance from Mesh SDK

**Transaction Building**: Uses `MeshTxBuilder` for constructing Cardano transactions:
- NFT minting uses `ForgeScript.withOneSignature()` for simple minting policies
- Metadata follows CIP-25 standard (721 label)
- UTXO selection and change address handling automated via `.selectUtxosFrom()` and `.changeAddress()`

### Cardano-Specific Patterns

**NFT Minting Flow**:
1. Create forging script with wallet address
2. Generate policy ID from script hash
3. Convert token name to hex
4. Build metadata following CIP-25 structure: `{ [policyId]: { [tokenName]: metadata } }`
5. Construct transaction with `.mint()`, `.mintingScript()`, `.metadataValue(721, ...)`, and `.txOut()`

**ADA Transfer Flow**:
1. Fetch sender's UTXOs from Blockfrost API
2. Build transaction with recipient address and lovelace amount (1 ADA = 1,000,000 lovelace)
3. Use `.selectUtxosFrom()` to automatically select sufficient UTXOs
4. Sign and submit transaction through wallet

**UTXO Mapping**: When fetching from Blockfrost, UTXOs must be transformed:
```typescript
{
  input: { txHash: utxo.tx_hash, outputIndex: utxo.output_index },
  output: { address: utxo.address, amount: utxo.amount }
}
```

### Configuration

**Next.js Config** (`next.config.ts`):
- `serverExternalPackages: ["@meshsdk/core", "@meshsdk/core-cst"]` - Required for Mesh SDK server-side usage
- `experiments: { asyncWebAssembly: true }` - Required for Cardano cryptography libraries

**Blockfrost Integration**:
- Currently hardcoded API key: ``
- Endpoint: `https://cardano-preprod.blockfrost.io/api/v0/`
- Used for fetching UTXOs in server-side transaction building

## Development Notes

- The application targets Cardano preprod testnet
- Wallet integration supports any CIP-30 compatible wallet (Nami, Eternl, Flint, etc.)
- State management uses Zustand for wallet state (`useWallet` store)
- UI uses Tailwind CSS v4 with PostCSS
- All client-side components that use wallet must be marked with `"use client"` directive

## Common Issues

**Mesh SDK Server-Side**: If encountering issues with Mesh SDK on server routes, ensure `serverExternalPackages` is properly configured in `next.config.ts`.

**WASM Loading**: The `asyncWebAssembly` experiment in webpack config is required for Cardano cryptography libraries. Without it, you'll encounter module loading errors.

**Transaction Signing**: The wallet's `signTx()` and `submitTx()` methods are asynchronous and should always be awaited. Handle errors gracefully as users may reject signing.

**UTXO Format**: When working with Blockfrost UTXOs, always transform them to Mesh SDK's expected format with `input` and `output` objects.