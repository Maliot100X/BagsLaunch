# BagsLaunch 🚀

> AI Agent Token Launch Platform — Build for the agent economy.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Maliot100X/BagsLaunch)
[![GitHub Stars](https://img.shields.io/github/stars/Maliot100X/BagsLaunch)](https://github.com/Maliot100X/BagsLaunch)

## Overview

BagsLaunch enables AI agents to launch Solana tokens and earn **65% of trading fees forever**. 

This platform provides:
- One-click token launch via Bags.fm API
- Beautiful dark theme interface
- Skills ready to copy into any OpenClaw agent

## Features

- 💰 **65% Fee Share** — Earn from every trade
- ⛽ **Gasless Launches** — Free when available
- 🤖 **AI Agent SDK** — Simple API calls
- 🔄 **Swap API** — Best prices across DEXes
- 📊 **Trading Intelligence** — Real-time analytics

## Quick Start

### Option 1: Web Interface

Deploy to Vercel and use the web interface:

```bash
# Clone and deploy
git clone https://github.com/Maliot100X/BagsLaunch.git
cd BagsLaunch
vercel deploy
```

### Option 2: Use the Skill in Your Agent

Copy the `SKILL.md` file and give it to your OpenClaw agent:

```
Read https://raw.githubusercontent.com/Maliot100X/BagsLaunch/main/SKILL.md
```

## Directory Structure

```
BagsLaunch/
├── SKILL.md              # Main OpenClaw skill
├── skills/
│   └── bags-launch.md    # Standalone skill file
├── web/
│   ├── index.html       # Web UI (dark theme)
│   ├── styles.css
│   └── app.js
├── api/
│   └── launch.js       # Vercel API route
├── package.json
├── vercel.json
└── README.md
```

## API Reference

### Launch Token

```bash
POST https://public-api-v2.bags.fm/api/v1/token/launch
x-api-key: asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN
Content-Type: application/json

{
  "name": "TokenName",
  "symbol": "SYMBOL",
  "description": "Your token description",
  "imageUrl": "https://...",
  "feeClaimer": "SolanaWalletAddress",
  "feeBasisPoints": 6500
}
```

### Check Earnings

```bash
GET https://public-api-v2.bags.fm/api/v1/fees/earnings?wallet=YOUR_WALLET
x-api-key: asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN
```

## Partner Key

**Partner API Key:** `asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN`

This key provides:
- 65% of creator fees
- Gasless launches (when available)
- Priority support

## Revenue Model

| Daily Trading Volume | Monthly Earnings |
|---------------------|-----------------|
| $1,000 | ~$195 |
| $10,000 | ~$1,950 |
| $50,000 | ~$9,750 |
| $100,000 | ~$19,500 |

## Resources

- [Bags.fm Documentation](https://docs.bags.fm)
- [OpenClaw Documentation](https://docs.openclaw.ai)
- [Everything Claude Code](https://github.com/affaan-m/everything-claude-code)
- [Awesome LLM Apps](https://github.com/Shubhamsaboo/awesome-llm-apps)

## License

MIT — Built for the Agent Economy ⚡
