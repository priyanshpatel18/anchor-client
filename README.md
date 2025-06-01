# Client Side Anchor Development

A modern decentralized counter application built on Solana blockchain using Anchor framework. This project demonstrates how to interact with Solana programs from the client side using TypeScript and React.

## Live Demo & Resources

- **Live Application**: [counter-dapp.vercel.app](https://counter-dapp.priyanshpatel.com)
- **Program on Devnet**: [View on Solana Explorer](https://explorer.solana.com/address/fJQXo3PFRjoBVKzLU5xsfU8wdJbHBkTkX8oWFbpvvGr?cluster=devnet)

## Features

- **Create Counters**: Initialize new counter accounts on the Solana blockchain
- **Real-time Updates**: Increment and decrement counters with instant feedback
- **Multi-cluster Support**: Works on localhost, devnet, and mainnet
- **Wallet Integration**: Seamless connection with Solana wallet adapters
- **Responsive Design**: Modern UI with smooth animations using Framer Motion

## Architecture Overview

This application demonstrates the core concepts of Anchor client-side development:

### Anchor Client-Side Structure

To create a `Program` instance, you need:
- **IDL** - Interface Description Language file representing the program structure
- **Connection** - The cluster connection (localhost/devnet/mainnet)
- **Wallet** - Default keypair for signing and paying for transactions
- **Provider** - Encapsulates the Connection and Wallet

### Interface Description Language (IDL)

When you build an Anchor program, it generates both JSON and TypeScript files representing your program's IDL. The IDL describes:

- Program structure and metadata
- Available instruction handlers
- Required accounts for each instruction
- Input parameters and validation rules

### Provider Setup

The Provider combines Connection and Wallet objects:

```typescript
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

const { connection } = useConnection();
const wallet = useAnchorWallet();
```

### Program Instantiation

Creating a Program instance requires the IDL and provider:

```typescript
import { Program, Idl } from "@coral-xyz/anchor";
import CounterIDL from '../target/idl/anchor_counter.json'
const program = new Program(CounterIDL as Idl, provider);
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/priyanshpatel18/counter-dapp.git
cd solana-counter-dapp
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## 🔧 Configuration

### Cluster Setup

The application supports multiple Solana clusters:

- **Localhost**: For local development with `solana-test-validator`
- **Devnet**: For testing with publicly available test tokens
- **Mainnet**: For production deployment

### Wallet Configuration

Supported wallets include:
- Phantom
- Solflare
- Backpack
- And other Solana-compatible wallets

### Prerequisites

- Node.js 18+ 
- Rust and Solana CLI (for local validator)
- Anchor CLI (for program deployment)

### Local Development

1. Start local Solana validator:
```bash
solana-test-validator
```

2. Deploy the counter program (if needed):
```bash
cd anchor
anchor deploy --cluster localnet
```

3. Update the program ID in your configuration

4. Start the development server:
```bash
npm run dev
```

##  Key Components

### Counter Program Integration

```typescript
const { connection } = useConnection()
const { cluster } = useCluster()
const transactionToast = useTransactionToast()

const initialize = useMutation({
  mutationKey: ['counter', 'initialize', { cluster }],
  mutationFn: (keypair: Keypair) => program.methods.initialize().accounts({ counter: keypair.publicKey }).signers([keypair]).rpc(),
  onSuccess: (signature) => transactionToast(signature),
  onError: () => toast.error(`Failed to account`),
})
```

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy


## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Links

- [Solana Documentation](https://docs.solana.com/)
- [Anchor Framework](https://anchor-lang.com/)

## Author

**Priyansh Patel**
- Website: [priyanshpatel.com](https://priyanshpatel.com)
- Twitter: [@priyanshpatel](https://twitter.com/priyanshpatel)
- GitHub: [@priyanshpatel](https://github.com/priyanshpatel)

---