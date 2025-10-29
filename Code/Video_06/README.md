
This is a Cardano blockchain dApp built with Next.js 15, React 19, and Mesh SDK. The application provides wallet connectivity and transaction functionality for the Cardano preprod testnet.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Lint code
npm run lint
```

## Architecture

### Route Groups

The codebase uses Next.js App Router with route groups for separation of concerns:

- `src/app/(client)/` - Client-side routes with React components
- `src/app/(server)/` - Server-side API routes

This pattern allows different layouts and organizational structure without affecting URL paths.

### Key Dependencies

- **@meshsdk/core** - Cardano blockchain interaction library
- **zustand** - State management for wallet connection
- **axios** - HTTP client for Blockfrost API calls

### Wallet Integration

Wallet state is managed via Zustand store in `src/components/wallet-connect/use-wallet.ts`:

- `connect(walletName)` - Connect to browser wallet
- `disconnect()` - Disconnect wallet
- `signTx(unsignedTx)` - Sign transaction
- `submitTx(signedTx)` - Submit signed transaction

The store maintains:
- `walletName` - Connected wallet identifier
- `address` - User's Cardano address
- `browserWallet` - MeshSDK BrowserWallet instance

### Transaction Flow

1. **Client-side**: User initiates transaction
2. **Server-side**: API route (`/api/cardano/send`) fetches UTXOs from Blockfrost and builds unsigned transaction using MeshTxBuilder
3. **Client-side**: Wallet signs and submits transaction


### Next.js Configuration

Special webpack configuration in `next.config.ts`:
- `asyncWebAssembly: true` - Required for Mesh SDK WASM modules
- `serverExternalPackages: ["@meshsdk/core", "@meshsdk/core-cst"]` - Prevents bundling issues

## Important Patterns

### Server/Client Component Split

Transaction building follows a hybrid pattern:
- Server components/routes handle UTXO fetching and unsigned transaction creation
- Client components handle wallet interaction (signing, submission)

### Amount Handling

ADA amounts are converted between units:
- User input in ADA
- Blockchain uses lovelace (1 ADA = 1,000,000 lovelace)
- Conversion: `(Number(amount) * 1_000_000).toString()`

## Testing on Preprod

This application targets Cardano preprod testnet. Use preprod test wallets and faucet for testing.
