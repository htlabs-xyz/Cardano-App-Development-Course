
This is a Next.js 15 application demonstrating Cardano blockchain integration using the MeshSDK. It's part of a Cardano App Development Course (Video_05) and showcases wallet connection, transaction building, and API route integration with the Cardano blockchain.

## Key Technologies

- **Next.js 15** (App Router with Route Groups)
- **React 19** with TypeScript
- **MeshSDK** (@meshsdk/core) - Cardano blockchain interaction library
- **Zustand** - State management for wallet connection
- **Blockfrost API** - Cardano blockchain data provider
- **Tailwind CSS** - Styling

## Development Commands

```bash
# Install dependencies (first time setup)
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm build

# Start production server
npm start

# Lint code
npm run lint
```

## Architecture

### Route Groups Structure

The application uses Next.js 15 route groups to separate client and server concerns:

- `src/app/(client)/` - Client-side rendered pages and layouts
  - `page.tsx` - Main task list page with wallet integration
  - `view/[id]/` - Dynamic task detail pages
  - `dynamic/[name]/` - Dynamic routing example
  - `layout.tsx` - Root layout with fonts and global styles

- `src/app/(server)/api/` - API routes (server-side only)
  - `cardano/[address]/route.ts` - Fetch Cardano address transactions via Blockfrost
  - `tasks/route.ts` - Mock task API
  - `tasks/[id]/route.ts` - Individual task API
  - `tasks/data.ts` - Static task data

### State Management

Wallet state is managed using **Zustand** in `src/components/wallet-connect/use-wallet.ts`:

```typescript
interface WalletStoreType {
  walletName: string | null;
  address: string | null;
  browserWallet: BrowserWallet | null;
  connect: (walletName: string) => Promise<void>;
  disconnect: () => Promise<void>;
}
```

Key methods:
- `connect(walletName)` - Connects to a Cardano wallet (Nami, Eternl, etc.)
- `disconnect()` - Disconnects the wallet
- `signTx(unsignedTx)` - Signs a transaction
- `submitTx(signedTx)` - Submits a signed transaction

### Wallet Integration

The `CardanoWallet` component (`src/components/wallet-connect/index.tsx`) provides:
- Multi-wallet support (detects available browser wallets)
- Dropdown menu for wallet selection
- Connection status display
- Wallet balance display
- Disconnect functionality


## Important Configuration

### Next.js Config (`next.config.ts`)

Critical configuration for MeshSDK compatibility:

```typescript
{
  serverExternalPackages: ["@meshsdk/core", "@meshsdk/core-cst"],
  webpack: {
    experiments: {
      asyncWebAssembly: true,
      layers: true,
    }
  }
}
```

**Do not remove these settings** - they are required for MeshSDK to work properly.

### TypeScript Config

- Path alias: `@/*` maps to `./src/*`
- Target: ES2017 (required for Cardano serialization libraries)
- Strict mode enabled

## Cardano-Specific Notes

### Network Configuration

The application uses **Cardano Preprod testnet**. The Blockfrost API endpoint is configured in `src/app/(server)/api/cardano/[address]/route.ts:8`:

```typescript
url: `https://cardano-preprod.blockfrost.io/api/v0/addresses/${address}/transactions`
```

### Blockfrost API Key

The Blockfrost project ID is currently hardcoded in `route.ts:9`. In production, this should be moved to environment variables:

```typescript
headers: { Project_id: '' }
```
