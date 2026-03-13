# BagsLaunch — AI Agent Token Launch Platform

> Launch Solana tokens from your AI agent and earn 65% of trading fees forever.

**Platform:** BagsLaunch (Powered by Bags.fm)  
**Partner API Key:** `asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN`  
**Base URL:** `https://public-api-v2.bags.fm/api/v1/`

---

## When to Use

Use this skill when:
- A user wants their AI agent to launch a token on Solana
- You need to earn passive income from trading fees
- Building a platform for token launches
- User provides: token name, symbol, description, image (optional)

---

## How It Works

### Step 1: Authenticate Your Agent

```javascript
// Initialize Bags SDK
import { BagsSDK } from "@bagsfm/bags-sdk";

const sdk = new BagsSDK("YOUR_API_KEY", connection, "confirmed");
```

### Step 2: Create Fee Share Configuration

```javascript
// Create fee share config (required for launches)
async function createFeeShareConfig(walletAddress) {
  const response = await fetch('https://public-api-v2.bags.fm/api/v1/fee-share/create-config', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN'
    },
    body: JSON.stringify({
      feeClaimer: walletAddress,
      feeBasisPoints: 6500 // 65% to you
    })
  });
  return response.json();
}
```

### Step 3: Launch Token

```javascript
// Launch token on Solana
async function launchToken(config) {
  const { name, symbol, description, imageUrl, walletAddress } = config;
  
  const response = await fetch('https://public-api-v2.bags.fm/api/v1/token/launch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN'
    },
    body: JSON.stringify({
      name,
      symbol,
      description,
      imageUrl: imageUrl || 'https://bags.fm/default-token.png',
      feeClaimer: walletAddress,
      feeBasisPoints: 6500
    })
  });
  
  return response.json();
}
```

---

## Complete Launch Workflow

### Step 1: Collect Required Information

Ask user for:
| Field | Required | Example |
|-------|----------|---------|
| `name` | Yes | "Kai & Nova" |
| `symbol` | Yes | "KNTWS" |
| `description` | No | "Twin Sisters AI Agents" |
| `imageUrl` | No | URL to token image |
| `walletAddress` | Yes | User's Solana wallet |

### Step 2: Execute Launch

```javascript
async function completeLaunch(userConfig) {
  // Validate required fields
  if (!userConfig.name || !userConfig.symbol || !userConfig.walletAddress) {
    throw new Error('Missing required fields: name, symbol, walletAddress');
  }
  
  // Create fee share config
  const feeConfig = await createFeeShareConfig(userConfig.walletAddress);
  
  // Launch token
  const result = await launchToken({
    ...userConfig,
    feeClaimer: userConfig.walletAddress,
    feeBasisPoints: 6500
  });
  
  return result;
}
```

### Step 3: Check Earnings

```javascript
async function checkEarnings(walletAddress) {
  const response = await fetch(
    `https://public-api-v2.bags.fm/api/v1/fees/earnings?wallet=${walletAddress}`,
    {
      headers: {
        'x-api-key': 'asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN'
      }
    }
  );
  return response.json();
}
```

---

## Revenue Model

| Daily Volume | Monthly Earnings (65% of fees) |
|--------------|-------------------------------|
| $1,000 | ~$195 |
| $10,000 | ~$1,950 |
| $50,000 | ~$9,750 |
| $100,000 | ~$19,500 |

Token launches charge 1% creator fee. You earn 65% of that.

---

## Error Handling

| Error | Solution |
|-------|----------|
| `401 Unauthorized` | Check API key is valid |
| `400 Bad Request` | Validate required fields |
| `429 Rate Limited` | Wait and retry |
| `500 Server Error` | Try again later |

---

## Examples

### Example 1: Basic Launch

**User Input:**
```
Launch a token called "BaseCrab" with symbol "CRAB"
```

**Your Response:**
I'll launch the token now. Please provide your Solana wallet address.

**User Provides:** `7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU`

**Execution:**
```javascript
await launchToken({
  name: "BaseCrab",
  symbol: "CRAB",
  description: "Autonomous infrastructure scout",
  walletAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
});
```

**Result:**
```json
{
  "success": true,
  "mintAddress": "HvBsjQy2mBbnPhUxCmTEcn8X1ZNPfnKVQrchQD1y2H",
  "tokenUrl": "https://app.bags.fm/token/HvBsjQy2mBbnPhUxCmTEcn8X1ZNPfnKVQrchQD1y2H"
}
```

---

## Quick Reference

```bash
# Create Fee Share Config
POST https://public-api-v2.bags.fm/api/v1/fee-share/create-config
x-api-key: asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN

# Launch Token
POST https://public-api-v2.bags.fm/api/v1/token/launch
x-api-key: asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN

# Check Earnings
GET https://public-api-v2.bags.fm/api/v1/fees/earnings?wallet=YOUR_WALLET
x-api-key: asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN
```

---

## Security Notes

- Never expose your partner API key in public code
- Validate wallet addresses before use
- Always confirm launch details with user before executing
- Keep transaction signatures for records
