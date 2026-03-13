# BagsLaunch 🚀

> AI Agent Token Launch Platform — Built for the agent economy.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Maliot100X/BagsLaunch)
[![GitHub Stars](https://img.shields.io/github/stars/Maliot100X/BagsLaunch)](https://github.com/Maliot100X/BagsLaunch)

## Overview

BagsLaunch enables AI agents to launch Solana tokens via **Bags.fm API** and earn **65% of trading fees forever**.

## Features

- 💰 **65% Fee Share** — Earn from every trade
- ⚡ **Fast Launches** — Metadata created in seconds
- 🤖 **AI Agent Ready** — Skills for OpenClaw agents
- 🔗 **Wallet Connect** — Phantom, Backpack, etc.
- 📊 **Real-time Stats** — Track earnings
- 🛡️ **Secure** — Your keys, your tokens

## Quick Start

### Web Interface

1. Deploy to Vercel:
```bash
git clone https://github.com/Maliot100X/BagsLaunch.git
cd BagsLaunch
vercel deploy
```

2. Open your deployed site

3. Enter token details and wallet address

4. Connect wallet and sign to launch

### OpenClaw Agent

Give this skill to your OpenClaw agent:

```
Read https://raw.githubusercontent.com/Maliot100X/BagsLaunch/main/SKILL.md
```

## User Flow

```
1. User provides: name, symbol, wallet address
2. Agent creates token metadata via Bags.fm API
3. Agent creates fee share config (65% to user)
4. Agent prepares launch transaction
5. User signs with wallet → Token launches
6. User earns 65% of all trading fees forever
```

## Directory Structure

```
BagsLaunch/
├── SKILL.md              # OpenClaw agent skill
├── skills/
│   └── bags-launch.md   # Standalone skill
├── web/
│   ├── index.html       # Main web interface
│   ├── styles.css       # Dark theme styles
│   └── app.js          # Frontend logic
├── api/
│   └── launch.js       # Server-side API (optional)
├── package.json
├── vercel.json
└── README.md
```

## API Reference

### Create Token Metadata

```bash
POST https://public-api-v2.bags.fm/api/v1/token-launch/create-token-info
x-api-key: asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN

{
  "name": "TokenName",
  "symbol": "SYMBOL",
  "description": "Description",
  "imageUrl": "https://...",
  "twitter": "@handle",
  "telegram": "@handle"
}
```

### Create Fee Share

```bash
POST https://public-api-v2.bags.fm/api/v1/fee-share/create-config
x-api-key: asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN

{
  "feeClaimer": "SolanaWalletAddress",
  "feeBasisPoints": 6500
}
```

### Create Launch Transaction

```bash
POST https://public-api-v2.bags.fm/api/v1/token-launch/create-launch-transaction
x-api-key: asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN

{
  "ipfs": "ipfs-url",
  "tokenMint": "token-mint-address",
  "wallet": "user-wallet",
  "initialBuyLamports": 1000000,
  "configKey": "config-key"
}
```

## Partner Key

**Partner API Key:** `asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN`

This key provides:
- 65% creator fee share
- Full API access
- Priority support

## Revenue Model

| Daily Volume | Monthly Earnings |
|-------------|-----------------|
| $1,000 | $195 |
| $10,000 | $1,950 |
| $50,000 | $9,750 |
| $100,000 | $19,500 |

## Resources

- [Bags.fm Documentation](https://docs.bags.fm)
- [OpenClaw Documentation](https://docs.openclaw.ai)
- [Everything Claude Code](https://github.com/affaan-m/everything-claude-code)
- [Awesome LLM Apps](https://github.com/Shubhamsaboo/awesome-llm-apps)

## License

MIT — Built for the Agent Economy ⚡
