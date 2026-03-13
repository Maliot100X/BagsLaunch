# bags-launch — Complete Token Launch Skill

> Launch Solana tokens using Bags.fm API and earn 65% of trading fees forever.

**Partner API Key:** `asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN`  
**Base URL:** `https://public-api-v2.bags.fm/api/v1`

---

## Overview

This skill enables your AI agent to launch tokens on Solana via Bags.fm infrastructure and earn passive revenue from trading fees.

## Quick Start

```javascript
const API_KEY = 'asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN';
const BASE_URL = 'https://public-api-v2.bags.fm/api/v1';

// Launch a token
const result = await launchToken({
  name: "MyAgent",
  symbol: "MAGT",
  description: "AI Agent Token",
  walletAddress: "YourSolanaWallet"
});

console.log(result.mintAddress); // Token mint address
console.log(result.tokenUrl);    // bags.fm link
```

---

## API Reference

### Launch Token

```javascript
async function launchToken(config) {
  const { name, symbol, description, imageUrl, walletAddress, feeBasisPoints } = config;
  
  // Create fee share config first
  await fetch(`${BASE_URL}/fee-share/create-config`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY
    },
    body: JSON.stringify({
      feeClaimer: walletAddress,
      feeBasisPoints: feeBasisPoints || 6500
    })
  });
  
  // Launch token
  const response = await fetch(`${BASE_URL}/token/launch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY
    },
    body: JSON.stringify({
      name,
      symbol: symbol.toUpperCase(),
      description: description || `AI Agent Token - ${symbol}`,
      imageUrl: imageUrl || 'https://bags.fm/default-token.png',
      feeClaimer: walletAddress,
      feeBasisPoints: feeBasisPoints || 6500
    })
  });
  
  return response.json();
}
```

### Check Earnings

```javascript
async function checkEarnings(walletAddress) {
  const response = await fetch(
    `${BASE_URL}/fees/earnings?wallet=${walletAddress}`,
    {
      headers: {
        'x-api-key': API_KEY
      }
    }
  );
  
  return response.json();
  // { totalEarned: 1.52, pending: 0.15 }
}
```

---

## Complete Example

```javascript
const API_KEY = 'asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN';

async function fullLaunchWorkflow() {
  // Step 1: Collect user info
  const tokenInfo = {
    name: 'Kai & Nova',
    symbol: 'KNTWS',
    description: 'Twin Sisters AI Agents',
    walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'
  };
  
  // Step 2: Launch token
  const result = await launchToken(tokenInfo);
  
  if (result.success) {
    console.log('✅ Token launched!');
    console.log('Mint:', result.mintAddress);
    console.log('URL:', result.tokenUrl);
  }
}
```

---

## Command Reference

| Command | Description |
|---------|-------------|
| `launch <name> <symbol>` | Quick launch with name and symbol |
| `launch --fee-share 6500` | Custom fee basis points |
| `earnings <wallet>` | Check fee earnings |
| `status` | Check launch status |

---

## Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 401 | Invalid API key | Check API key |
| 400 | Missing fields | Provide name, symbol, wallet |
| 429 | Rate limited | Wait and retry |

---

## Revenue Calculator

```javascript
function calculateEarnings(dailyVolume) {
  const feePercent = 0.01; // 1% on bags.fm
  const yourShare = 0.65; // 65% goes to you
  
  const dailyFees = dailyVolume * feePercent;
  const monthlyEarnings = dailyFees * yourShare * 30;
  
  return monthlyEarnings;
}

// Examples
console.log(calculateEarnings(1000));   // $195/month
console.log(calculateEarnings(10000));  // $1,950/month
console.log(calculateEarnings(50000)); // $9,750/month
```

---

## Integration with OpenClaw

Add to your OpenClaw agent:

```
Read https://raw.githubusercontent.com/Maliot100X/BagsLaunch/main/skills/bags-launch.md
```
