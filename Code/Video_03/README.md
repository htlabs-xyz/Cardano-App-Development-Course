
This is a Cardano blockchain application built with Next.js 15 and Mesh SDK. It's part of a Cardano App Development Course (Video 03) focusing on wallet integration and blockchain interaction. The application enables users to connect Cardano wallets (Nami, Eternl, Flint, etc.) and interact with their UTXOs and assets.

## Development Commands

```bash
# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Tech Stack

- **Framework**: Next.js 15 (App Router with React Server Components)
- **React**: v19.1.0 with TypeScript
- **Blockchain SDK**: @meshsdk/core v1.8.14 (Cardano blockchain interaction)
- **State Management**: Zustand v5.0.6
- **Styling**: Tailwind CSS v4

## Architecture

### Wallet Integration Pattern

The application uses a centralized Zustand store (`use-wallet.ts`) that manages:
- Wallet connection state (connected wallet name, address)
- Browser wallet instance (BrowserWallet from Mesh SDK)
- Transaction signing and submission
- Wallet connection/disconnection lifecycle

Key methods in the wallet store:
- `connect(walletName)`: Establishes connection with a Cardano wallet
- `disconnect()`: Clears wallet state
- `signTx(unsignedTx)`: Signs transactions with connected wallet
- `submitTx(signedTx)`: Submits signed transactions to the blockchain

### Component Structure

**src/components/wallet-connect/**
- `index.tsx`: Main CardanoWallet component that orchestrates wallet UI
- `use-wallet.ts`: Zustand store for global wallet state
- `button-dropdown.tsx`: Dropdown button wrapper for wallet selection
- `wallet-balance.tsx`: Displays connected wallet balance in ADA
- `menu-item.tsx`: Individual menu items in wallet dropdown

### Next.js Configuration

The `next.config.ts` includes critical Mesh SDK setup:
- `serverExternalPackages`: Excludes @meshsdk packages from server bundling (required for CIP-30 wallet adapters)
- `webpack.experiments.asyncWebAssembly`: Enables WASM support (Cardano serialization libraries use WASM)

### TypeScript Configuration

Path alias `@/*` maps to `./src/*` for cleaner imports.

## Working with Mesh SDK

### UTxO Retrieval
```typescript
const utxos = await browserWallet.getUtxos();
```

### Getting Wallet Balance
```typescript
const lovelace = await browserWallet.getLovelace();
const ada = parseInt(lovelace) / 1_000_000;
```

