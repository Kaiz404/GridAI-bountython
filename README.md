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


**Below shows a illustration of how the grid trading algorithm executes buy and sells:**
![Grid Trading Strategy](https://elitecurrensea.com/wp-content/uploads/2021/09/Frame-1-1024x538.png)

## 🧠 AI Integration

Our AI assistant helps you:
- Summarise trading performances and suggest modifications
- Recommend tokens to trade on based on semantic analysis
- Analyze market conditions and suggest optimal grid parameters
- Monitor performance and recommend adjustments
- Provide explanations about trading concepts
- Execute trades and manage your grid configurations

## 🔄 Trading Algorithm Deployment

GridBot AI's core trading engine operates independently as a cloud-based service, ensuring 24/7 reliable operation and real-time execution of trades according to your grid parameters.

### 🖥️ Trading Algorithm Repository

The grid trading algorithm that powers our platform is maintained in a separate repository and deployed as a cloud service:

👉 [**GridAi Trading Algorithm Repository**](https://github.com/Kaiz404/GridAi-trading-algorithm)

### ⚙️ Algorithm Features

- **Automated Grid Trading**: Executes trades automatically when prices cross predefined grid levels
- **24/7 Continuous Operation**: Deployed on Google App Engine for uninterrupted trading
- **Jupiter DEX Integration**: Leverages Jupiter's API for optimal token swaps with best execution prices
- **Comprehensive Trade Tracking**: Records all transactions in MongoDB for analysis and audit
- **Customizable Grid Configurations**: Supports flexible grid setups with variable price ranges and densities
- **Multi-Token Support**: Works with a wide range of Solana-based tokens and trading pairs

### 🏗️ Architecture

Our trading algorithm implements a sophisticated architecture to ensure reliability and performance:

1. **Core Trading Engine**:
   - Constantly monitors token prices across the Solana ecosystem
   - Evaluates price movements against configured grid levels
   - Triggers buy/sell operations when price crosses grid thresholds

2. **Database Integration**:
   - MongoDB backend stores all grid configurations and parameters
   - Records complete trade history with timestamps and execution details
   - Maintains state for analytics and reporting

3. **Jupiter API Integration**:
   - Sources real-time price data from multiple liquidity pools
   - Routes trades through optimal paths for best execution
   - Minimizes slippage and transaction costs

4. **Cloud Deployment**:
   - Hosted on Google App Engine for enterprise-grade reliability
   - Auto-scaling capabilities to handle peak trading volumes
   - Designed for minimal downtime with redundant systems

This decoupled architecture allows us to maintain a responsive frontend experience while ensuring trades are executed promptly and reliably, regardless of client-side connectivity.

## 🛡️ Security

- All trading operations happen on-chain with full transparency
- Your funds remain in your control at all times
- Private keys are never shared with third parties

## 📚 Learn More

- [Solana Agent Kit Documentation](https://github.com/sendaifun/solana-agent-kit)
- [Google App Engine Documentation](https://cloud.google.com/appengine/docs)

## 🙏 Acknowledgments

Built with Solana Agent Kit, LangChain.js, and Next.js.

Special thanks to the Solana Foundation and the Solana Bountython community.