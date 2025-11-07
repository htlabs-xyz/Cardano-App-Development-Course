This is a **Cardano NFT Marketplace** built with Next.js 15, React 19, and the Mesh SDK. It allows users to list, buy, withdraw, and update NFT listings on the Cardano blockchain using Aiken smart contracts.

## Essential Commands

```bash
# Development
npm run dev          # Start development server on http://localhost:3000
npm run build        # Build production bundle
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## Environment Configuration

Create a `.env.local` file with:
```
BLOCKFROST_PROJECT_ID=<network>1234567890abcdef  # e.g., preview1234... or mainnet1234...
```

The first 7 characters determine the network ("preview" or "mainnet"). This affects:
- Network selection in transactions
- NetworkId (0 for testnet, 1 for mainnet)
- Blockfrost API endpoints

## Technology Stack
- **Framework**: Next.js 15 (App Router)
- **Blockchain**: Cardano (Mesh SDK 1.8.14)
- **State**: Zustand
- **Data Fetching**: SWR + Axios
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Language**: TypeScript 5.9

## Architecture

### Smart Contract Integration Layer

**Core Classes** (`src/contract/`):
- `MeshAdapter` (mesh.ts:17-120): Base class providing Plutus interaction utilities
  - Manages Blockfrost provider, wallet, and MeshTxBuilder
  - Reads marketplace validator from `plutus.json` blueprint
  - Parses datum structure: `[seller_address, price, policyId, assetName]`
  - Provides UTXO fetching and Plutus data deserialization

- `MarketplaceContract` (index.ts:14-150): Extends MeshAdapter with marketplace operations
  - `sell()`: Lists NFT by sending to marketplace script address with inline datum
  - `buy()`: Purchases NFT using ConStr0 redeemer, pays seller + returns ada
  - `withdraw()`: Removes listing using ConStr1 redeemer (seller only)
  - `update()`: Changes price by withdrawing and re-listing in single tx

**Key Pattern**: All transactions use Plutus V3 scripts with inline datums. The datum format is critical:
```typescript
conStr0([
  toPubKeyAddress(pubKeyHash, stakeCredentialHash),  // Seller
  toInteger(priceInLovelace),                        // Price
  toPolicyId(policyId),                              // NFT policy
  toAssetName(assetName)                             // NFT asset name
])
```

### API Route Architecture

All routes in `src/app/api/` follow this pattern:
1. Accept wallet address + parameters from client
2. Create AppWallet (address-only, no keys) for unsigned tx building
3. Initialize MarketplaceContract with BlockfrostProvider
4. Return unsigned transaction CBOR for client-side signing

**Routes**:
- `/api/tx/sell` - Create listing transaction
- `/api/tx/buy` - Create purchase transaction
- `/api/tx/withdraw` - Create withdrawal transaction
- `/api/tx/update` - Create price update transaction
- `/api/tx/submit` - Submit signed transaction to blockchain
- `/api/asset?unit=<unit>` - Get NFT metadata + datum from marketplace
- `/api/listed` - Get all currently listed NFTs
- `/api/profile?address=<address>` - Get user's NFT holdings

### State Management

**Zustand Store** (`src/hooks/use-wallets.ts`):
- Manages Cardano wallet connection via MeshSDK BrowserWallet
- Stores: `walletName`, `address`, `browserWallet` instance
- `connect()`: Enables wallet and retrieves change address
- `disconnect()`: Clears wallet state

### Frontend Architecture

**Components Structure**:
- `src/components/common/cardano-wallet/`: Wallet connection UI (dropdown, balance display)
- `src/components/app/`: NFT marketplace-specific components (NFT cards, transaction buttons)
- `src/components/ui/`: Reusable shadcn/ui components (buttons, cards, dialogs, tabs)
- `src/components/layout/`: Layout components (header with wallet integration)

**Pages**:
- `/` (app/page.tsx): Browse all listed NFTs
- `/nft/[unit]` (app/nft/[unit]/page.tsx): Individual NFT detail with buy/withdraw/update actions
- `/profile` (app/profile/page.tsx): User's wallet assets

### Data Fetching Pattern

Uses SWR for client-side data fetching:
```typescript
const { data } = useSWR<NFT>(`/api/asset?unit=${unit}`, fetcher);
```

Axios instance configured in `src/lib/axios.ts` for API calls.

## Important Implementation Details

### Transaction Flow
1. Client requests unsigned tx from API route
2. API builds transaction using AppWallet (no private keys)
3. Client receives unsigned CBOR transaction
4. Client signs with browser wallet (`browserWallet.signTx()`)
5. Client submits signed tx via `/api/tx/submit`

### Blockfrost Provider Singleton
`src/lib/blockfrost.ts` implements singleton pattern to avoid multiple Blockfrost connections in development (hot reload). Uses `globalThis` caching in non-production.

### UTXO Management
When fetching marketplace UTXOs for a specific asset, the code takes the **last** UTXO (`utxos[utxos.length - 1]`). This assumes most recent listing is desired when multiple exist.

### Type Definitions
`src/types/index.d.ts` defines:
- `Datum`: On-chain data structure (unit, seller, price)
- `NFT`: Datum + metadata from Blockfrost
- `TransactionAction`: Type-safe action literals

## Common Development Patterns

### Adding a New Transaction Type
1. Add method to `MarketplaceContract` class in `src/contract/index.ts`
2. Create API route in `src/app/api/tx/<action>/route.ts`
3. Import and use in transaction button component
4. Update `TransactionAction` type if needed

### Working with Plutus Data
Always use MeshAdapter's `readPlutusData()` to safely deserialize datums. Returns null on error rather than throwing.
