# GridBot AI 🤖 - AI-Powered Grid Trading Platform for Solana

[![Vercel Deployment](https://vercel.com/button)](https://gridai-4kwmssq3p-kais-projects-42abda1c.vercel.app)

## 🤖 GridBot AI - Smart Trading on Solana

GridBot AI is an advanced trading application that combines the power of artificial intelligence with grid trading strategies on the Solana blockchain.

![Dashboard Screenshot](/public/images/hero.png)

## ✨ Features

- **AI-Powered Grid Trading** - Let AI analyze market trends and create optimized grid strategies
- **Automated Trading** - Set up grid trading configurations that automatically execute buys and sells
- **Intuitive Interface** - User-friendly dashboard to monitor performance and manage trading grids
- **Real-time Analytics** - Track profits, transaction history, and performance statistics
- **Interactive AI Assistant** - Chat with your personal trading assistant to get insights or make adjustments

## 🚀 Getting Started

### Prerequisites

- Solana wallet with SOL for transactions and gas fees
- OpenAI API key for AI functionality

### Setup

1. Clone this repository and navigate to the project directory
2. Copy `.env.example` to `.env.local` and add your:
    - `OPENAI_API_KEY` - OpenAI API key
    - `RPC_URL` - Solana RPC endpoint
    - `SOLANA_PRIVATE_KEY` - Your wallet private key in base58 string format

3. Install dependencies:

```bash
pnpm install
```

4. Start the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) to see the application

## 💡 How Grid Trading Works

Grid trading is a strategy that places buy and sell orders at predetermined price intervals (the "grid"). When prices move up and down within this range:

- Buy orders are executed when price drops to a grid line
- Sell orders are executed when price rises to a grid line

This approach profits from market volatility without needing to predict market direction.

![Grid Trading Strategy](/public/images/grid-strategy.png)

## 🧠 AI Integration

Our AI assistant helps you:

- Analyze market conditions and suggest optimal grid parameters
- Monitor performance and recommend adjustments
- Provide explanations about trading concepts
- Execute trades and manage your grid configurations

## 📈 Performance

GridBot AI has been designed to capitalize on sideways markets while mitigating risks during strong trend movements.

## 🛡️ Security

- All trading operations happen on-chain with full transparency
- Your funds remain in your control at all times
- Private keys are never shared with third parties

## 📚 Learn More

- [Solana Agent Kit Documentation](https://github.com/solana-foundation/agent-kit)
- [Grid Trading Strategy Guide](https://learn.bybit.com/trading/grid-trading-explained/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

Built with Solana Agent Kit, LangChain.js, and Next.js.

Special thanks to the Solana Foundation and the Solana Bountython community.