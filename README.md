# Cardano App Development Course

A comprehensive 14-video course teaching full-stack Cardano decentralized application (dApp) development. Build a complete NFT marketplace from blockchain fundamentals through smart contract integration.

## Course Overview

**Level:** Beginner to Advanced
**Duration:** 14 videos (estimated 25-30 hours of learning)
**Final Project:** Full-stack NFT marketplace on Cardano Preprod testnet

This course progresses from web fundamentals through blockchain basics to production-ready smart contracts, teaching real Cardano development practices with modern technologies.

## Prerequisites

- **Node.js 18+** (npm or yarn)
- **Git**
- **Code Editor** (VSCode recommended)
- **Web Browser** with Eternl or other CIP-30 wallet extension
- **Cardano Testnet ADA** (free from faucets during videos)
- **Basic JavaScript/TypeScript knowledge**

## Repository Structure

```
├── Outline/           # Video learning objectives & keypoints
├── Content/           # Video scripts & detailed teaching material
├── Code/              # Complete source code per video
│   ├── Video_02/      # Next.js basics
│   ├── Video_03/      # Wallet connection
│   ├── Video_04-07/   # Frontend & transactions
│   ├── Video_08/      # Aiken Hello World
│   ├── Video_10-13/   # Marketplace UI & full-stack
│   └── Video_11-12/   # Smart contracts
├── Exercises/         # 70+ hands-on coding exercises
├── docs/              # Development documentation
└── README.md          # This file
```

## Quick Start

### Option 1: Follow from Beginning
```bash
# 1. Watch Video_01: Web3 & Web Dev Basics (conceptual)
# 2. Clone repo and explore Outline/Video_02.md

cd Code/Video_02
npm install
npm run dev
# Open http://localhost:3000
```

### Option 2: Jump to Full dApp
```bash
# Start with complete marketplace (requires blockchain knowledge)
cd Code/Video_13
npm install

# Create .env.local with your Blockfrost API key
echo "NEXT_PUBLIC_BLOCKFROST_KEY=your_key_here" > .env.local

npm run dev
```

## Course Curriculum

| Part | Videos | Focus | Tech |
|------|--------|-------|------|
| **Foundations** | 01-03 | Web3 basics, React, Next.js | HTML/CSS/JS/React |
| **Frontend** | 04-07 | Wallet integration, transactions | MeshSDK, Blockfrost |
| **Smart Contracts** | 08-12 | Aiken validators, testing | Aiken, Plutus V3 |
| **Full dApp** | 13-14 | Marketplace integration, deployment | Full-stack integration |

### Detailed Video Breakdown

**Video 01: Web3 & Web Dev Basics** (Conceptual)
- Web2 vs Web3 architecture
- Blockchain fundamentals
- Cardano positioning

**Video 02: Frontend Framework - React**
- React fundamentals & hooks
- Component composition
- State management basics

**Video 03: Full-Stack - Next.js**
- Next.js 15 App Router
- Server vs client components
- API routes

**Video 04: Cardano Wallet Connection**
- MeshSDK wallet integration
- Multi-wallet support (Eternl, Nami, Flint)
- Zustand state management
- Balance display

**Video 05: Query On-Chain Data**
- Blockfrost API integration
- Transaction history queries
- UTXO fetching
- Address validation

**Video 06: Making Transactions**
- Client-side transaction building
- Server-side UTXO management
- ADA transfers (lovelace conversion)
- Transaction signing & submission

**Video 07: Minting Assets**
- NFT creation with ForgeScript
- CIP-25 metadata standards
- Minting policy creation
- One-signature validation

**Video 08: eUTxO Model & Aiken**
- Extended UTxO model explanation
- Aiken syntax introduction
- Plutus V3 validators
- Datum & redeemer concepts

**Video 09: NFT Marketplace Analysis**
- Marketplace requirements specification
- Smart contract design patterns
- Architecture decisions
- User flows (list, buy, withdraw, update)

**Video 10: Marketplace UI Design**
- Shadcn/ui component library
- Zustand state management
- NFT grid layout
- Detail page design
- Responsive design patterns

**Video 11: Aiken Marketplace Validator**
- Full marketplace smart contract
- Buy operation logic
- WithdrawOrUpdate operations
- Mocktail testing framework
- Vodka library utilities

**Video 12: Test Cases & Off-Chain**
- Aiken inline tests
- MeshAdapter bridge class
- TypeScript-Aiken integration
- Test coverage patterns

**Video 13: Full Integration**
- Complete marketplace implementation
- MeshAdapter usage
- API route patterns
- SWR data fetching
- Wallet interaction flows

**Video 14: Deployment**
- Environment configuration
- Vercel deployment setup
- Production hardening
- Mainnet vs testnet

## Technology Stack

### Frontend
- **Next.js 15.x** - React framework with SSR
- **React 19** - UI library with hooks
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **Shadcn/ui** - Component library
- **Zustand** - Lightweight state management
- **SWR 2.3.x** - Data fetching with caching

### Blockchain
- **Cardano** - Blockchain (Preprod testnet)
- **MeshSDK 1.8.14** - Wallet integration & transactions
- **Blockfrost API** - On-chain data queries
- **Plutus V3** - Smart contract language
- **Aiken 1.1.19** - Plutus smart contract framework

### Testing & Tools
- **Vitest** - Unit testing
- **Aiken built-in tests** - Smart contract testing
- **Mocktail** - Mock transaction builder
- **ESLint** - Code linting
- **Vercel** - Deployment platform

## How to Use This Course

### For Learners
1. **Read Outline** (`Outline/Video_X.md`) - Get learning objectives
2. **Watch Video** - Follow along with teaching content
3. **Read Content** (`Content/Video_X.md`) - Detailed explanations & code examples
4. **Explore Code** (`Code/Video_X/`) - Run and modify example projects
5. **Complete Exercises** (`Exercises/Video_X.md`) - Practice & solidify concepts
6. **Build Projects** - Combine multiple videos into larger projects

### For Instructors
- Share Outline files for pre-session review
- Reference Content files for detailed explanations
- Point students to Code directories for hands-on practice
- Use Exercises to assess understanding

### For Developers
- Jump to specific videos based on topics needed
- Reference Quick Tech Stack documentation
- Use Code projects as templates
- Follow established patterns in production code

## Exercise Structure

**70 total exercises** across all 14 videos:
- **46% Coding** - Implement features, modify code
- **28% Conceptual** - Explain concepts, answer questions
- **26% Hands-on** - Set up environments, debug issues

**Difficulty Progression:** Each video builds on previous knowledge. Start at Video_02 for foundational concepts.

## Key Patterns Used

### Zustand Wallet Store
State management pattern used across all videos starting with Video 03:
```typescript
const useWallet = create<WalletStore>((set) => ({
  walletName, address, browserWallet,
  connect, disconnect, signTx, submitTx
}));
```

### Server-Side Transaction Building
Pattern introduced in Video 06, used throughout:
- Server fetches UTXOs from Blockfrost
- Server builds unsigned transaction
- Client signs with browser wallet
- Client submits to blockchain

### Plutus V3 Script Interaction
Modern smart contract pattern in Video 13:
- Inline datums stored on-chain
- Redeemers passed as constructor values
- MeshAdapter abstraction layer
- Proper collateral management

## Configuration

All Next.js projects require this `next.config.ts`:
```typescript
export default {
  serverExternalPackages: ["@meshsdk/core", "@meshsdk/core-cst"],
  webpack: {
    experiments: { asyncWebAssembly: true, layers: true }
  }
};
```

## Network Details

**Testnet:** Cardano Preprod
**Network ID:** 0
**Blockfrost URL:** `https://cardano-preprod.blockfrost.io/api/v0/`

All projects use Preprod. Switch to mainnet by updating network ID to 1 and endpoint.

## Getting Help

1. **Check Code Examples** - See working implementations in `/Code/Video_X/`
2. **Review Exercise Solutions** - Step-by-step guides in `/Exercises/`
3. **Read Content Material** - Detailed explanations in `/Content/`
4. **Reference Documentation** - See `/docs/` for architecture & patterns

## Project Progression

```
Week 1-2: Foundations (V01-V03)
└─ Goal: Connect wallet, understand architecture

Week 3-4: On-Chain Data (V04-V05)
└─ Goal: Read blockchain state, understand UTXOs

Week 5-6: Transactions (V06-V07)
└─ Goal: Send ADA, mint NFTs

Week 7-9: Smart Contracts (V08-V12)
└─ Goal: Write validators, test contracts

Week 10: Full dApp (V13-V14)
└─ Goal: Complete marketplace, deploy to production
```

## Success Metrics

By completing this course, you'll be able to:
- Design Cardano dApp architectures
- Integrate wallet connections in dApps
- Query on-chain data via Blockfrost
- Build and submit blockchain transactions
- Write production-grade smart contracts in Aiken
- Test smart contracts with Mocktail
- Deploy full-stack dApps to production
- Understand eUTxO model and Plutus validation

## Next Steps After Course

- Extend marketplace with more NFT features
- Deploy to Cardano mainnet
- Add advanced features (staking, DAOs, custom validators)
- Contribute to Cardano ecosystem projects
- Explore advanced Plutus patterns

## Credits & License

Created for Cardano developers learning path.

**Technologies:**
- Cardano Foundation - Cardano blockchain
- MeshJS - Developer SDK
- Blockfrost - Data indexing
- Aiken Foundation - Smart contract language
- Vercel - Deployment platform

See individual projects for specific licenses.

---

**Start with Video 01 or jump to any video based on your current knowledge level.**

For documentation, architecture details, and code standards, see `/docs/` directory.
