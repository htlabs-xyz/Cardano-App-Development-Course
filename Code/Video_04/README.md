
This is a Next.js 15 application for Cardano blockchain development, part of a course series (Video_04). It demonstrates Cardano wallet integration, transaction building, and blockchain interactions using Mesh SDK and Blockfrost API.

## Development Commands

```bash
# Start development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture

### Route Groups and Server/Client Separation

The application uses Next.js route groups to explicitly separate client and server code:

- `src/app/(client)/` - Client-side pages and components using "use client" directive
- `src/app/(server)/api/` - API routes that run server-side only
- This separation is critical for Mesh SDK which requires specific webpack configuration for WebAssembly support

### Key Components and Patterns

**Wallet Integration** (`src/components/wallet-connect/`)
- `use-wallet.ts` - Zustand store managing wallet connection state
  - Handles wallet connection/disconnection via Mesh SDK's `BrowserWallet.enable()`
  - Stores: `walletName`, `address`, `browserWallet` instance
  - Provides: `connect()`, `disconnect()`, `signTx()`, `submitTx()` methods
- `index.tsx` - Main `CardanoWallet` component with dropdown menu
- `wallet-balance.tsx` - Displays wallet connection status and name
- Wallet state is managed client-side and persists throughout the session

**Transaction Building** (`src/app/(client)/page.tsx`)
- Uses `MeshTxBuilder` for constructing Cardano transactions
- Pattern: Get UTXOs → Get change address → Build tx → Sign tx → Submit tx
- Example implementation in `sendAda()` function

### Next.js Configuration

The `next.config.ts` includes critical Mesh SDK requirements:
- `serverExternalPackages: ["@meshsdk/core", "@meshsdk/core-cst"]` - Prevents bundling these packages
- `webpack.experiments.asyncWebAssembly: true` - Enables WASM support for Mesh SDK
- These settings are required for Mesh SDK to function properly

### Import Aliases

- `@/*` maps to `./src/*` (configured in tsconfig.json)

## Technology Stack

- **Next.js 15** with App Router (React 19)
- **Mesh SDK** (`@meshsdk/core`) - Cardano blockchain interactions
- **Zustand** - State management for wallet connection
- **Blockfrost API** - Blockchain data provider (preprod network)
- **Axios** - HTTP requests to Blockfrost
- **Tailwind CSS 4** - Styling
- **TypeScript 5** - Type safety
