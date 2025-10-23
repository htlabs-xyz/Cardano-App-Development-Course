## Project Overview

This is a Next.js 15 NFT marketplace built for the Cardano blockchain. It uses MeshSDK for Cardano wallet integration and currently displays placeholder NFT data. The app supports connecting Cardano wallets (preprod network), viewing NFT collections, individual NFT details, and user profiles.

## Common Commands

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Blockchain Integration**: MeshSDK (@meshsdk/core v1.8.14)
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives (tabs, slots)
- **Network**: Cardano Preprod (configured via NEXT_PUBLIC_APP_NETWORK env var)

### Wallet Integration (Critical)

The codebase uses MeshSDK for Cardano wallet connectivity. This requires specific Next.js configuration:

**next.config.ts** includes required webpack settings:
```typescript
serverExternalPackages: ["@meshsdk/core", "@meshsdk/core-cst"]
webpack: {
  experiments: {
    asyncWebAssembly: true,
    layers: true
  }
}
```

**DO NOT remove or modify these webpack settings** - they are required for MeshSDK to function properly.

### State Management

**Wallet State** (`src/hooks/use-wallets.ts`):
- Zustand store managing wallet connection state
- Stores: `walletName`, `address`, `browserWallet` (MeshSDK BrowserWallet instance)
- `connect(walletName)`: Connects to Cardano wallet, gets change address
- `disconnect()`: Clears wallet state
- This is the single source of truth for wallet connection status

### Project Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout with Header
│   ├── page.tsx             # Home page (NFT marketplace grid)
│   ├── nft/[unit]/page.tsx  # NFT detail page (dynamic route by unit)
│   └── profile/page.tsx     # User profile with wallet/listed NFTs
├── components/
│   ├── common/
│   │   └── cardano-wallet/  # Cardano wallet connection component
│   ├── layout/
│   │   └── header.tsx       # Navigation header with wallet button
│   └── ui/                  # Reusable UI components (button, tabs)
├── hooks/
│   └── use-wallets.ts       # Zustand store for wallet state
├── styles/
│   └── globals.css          # Global Tailwind styles
└── utils/
    └── cn.ts                # Tailwind class merging utility
```

### Path Aliases
TypeScript is configured with `@/*` mapped to `./src/*`. Always use absolute imports:
```typescript
import { useWallet } from "@/hooks/use-wallets"  // Good
import { useWallet } from "../hooks/use-wallets" // Avoid
```

### Key Components

**CardanoWallet** (`src/components/common/cardano-wallet/index.tsx`):
- Dropdown component showing available Cardano wallets
- Uses `BrowserWallet.getAvailableWallets()` to detect installed wallets
- Displays wallet balance when connected
- Shows "Go Profile" and "disconnect" options when wallet is connected
- Used in Header component

**Header** (`src/components/layout/header.tsx`):
- Navigation bar with CardanoWallet component
- Appears on all pages via root layout

### Current Data Flow

All NFT data is currently **placeholder/mock data**:
- Home page (`app/page.tsx`): `placeholderNFTs` array
- NFT detail page (`app/nft/[unit]/page.tsx`): `getNFTData()` function returns hardcoded object
- Profile page (`app/profile/page.tsx`): `walletNFTs` and `listedNFTs` arrays

**When implementing real data fetching**:
- Replace placeholder data with Blockfrost API calls or other Cardano indexer
- Use `BLOCKFROST_PROJECT_ID` from `.env`
- Fetch actual NFT metadata, ownership, and transaction history
- Wire up wallet address from `useWallet` hook to fetch user's NFTs

### Environment Variables

Required in `.env`:
- `BLOCKFROST_PROJECT_ID`: Blockfrost API key for Cardano data
- `NEXT_PUBLIC_APP_NETWORK`: Network identifier ("preprod" or "mainnet")

### Styling Conventions

- Uses Tailwind CSS v4 with utility classes
- Component variants use `class-variance-authority`
- Class merging utility: `cn()` from `src/utils/cn.ts`
- Color scheme: Purple theme (`purple-600`, `purple-700`) for primary actions
- Responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`

### Important Notes

1. **Client Components**: Most components use `"use client"` directive due to wallet interaction and state management
2. **Dynamic Routes**: NFT detail page uses `[unit]` dynamic segment (unit = NFT identifier)
3. **Network**: Currently configured for Cardano **preprod** testnet
4. **ESLint**: Disables `@next/next/no-img-element` in some files (uses `<img>` for external URLs)
