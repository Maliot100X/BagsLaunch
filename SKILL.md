# BagsLaunch — Complete Token Launch Skill

> Launch Solana tokens using Bags.fm and earn 65% of trading fees forever.

**Partner API Key:** `ZF5gMGdiipHjRb4RgJynAhn5NJ68Zy4iWDdKE2g8sU5`  
**Base URL:** `https://public-api-v2.bags.fm/api/v1`

---

## How It Works

### Step 1: Create Token Metadata

```javascript
// POST /token-launch/create-token-info
async function createTokenInfo(config) {
  const { name, symbol, description, imageUrl, twitter, telegram, website } = config;
  
  const response = await fetch('https://public-api-v2.bags.fm/api/v1/token-launch/create-token-info', {
    method: 'POST',
    headers: {
      'x-api-key': 'asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN'
    },
    body: JSON.stringify({
      name,
      symbol: symbol.toUpperCase(),
      description: description || `AI Agent Token - ${symbol}`,
      imageUrl: imageUrl || 'https://bags.fm/default.png',
      twitter: twitter || null,
      telegram: telegram || null,
      website: website || null
    })
  });
  
  return response.json();
  // Returns: { ipfs, tokenMint, metadataUrl }
}
```

### Step 2: Create Fee Share Config

```javascript
// POST /fee-share/create-config
async function createFeeShareConfig(walletAddress) {
  const response = await fetch('https://public-api-v2.bags.fm/api/v1/fee-share/create-config', {
    method: 'POST',
    headers: {
      'x-api-key': 'asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      feeClaimer: walletAddress,
      feeBasisPoints: 6500  // 65% to creator
    })
  });
  
  return response.json();
  // Returns: { configKey }
}
```

### Step 3: Get Launch Transaction

```javascript
// POST /token-launch/create-launch-transaction
async function createLaunchTransaction(config) {
  const { ipfs, tokenMint, wallet, configKey, initialBuyLamports = 1000000 } = config;
  
  const response = await fetch('https://public-api-v2.bags.fm/api/v1/token-launch/create-launch-transaction', {
    method: 'POST',
    headers: {
      'x-api-key': 'asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ipfs,
      tokenMint,
      wallet,
      initialBuyLamports,
      configKey
    })
  });
  
  return response.json();
  // Returns: { transaction, tipWallet, tipLamports }
}
```

### Step 4: User Signs & Submits (Client-Side)

The user signs the transaction with their wallet (Phantom, Backpack, etc.) and submits to Solana.

---

## Complete Agent Workflow

### Agent Says to User:

```
🚀 I'll launch your token on Solana via Bags.fm!

Please provide:
1. Token Name (e.g., "Kai & Nova")
2. Symbol (e.g., "KNTWS") - max 10 characters
3. Description (optional)
4. Your Solana Wallet Address

💰 Launch is FREE (gasless) when available, or ~0.03 SOL self-funded.
📈 You'll earn 65% of all trading fees forever!
```

### User Provides Info

User sends: name, symbol, description, wallet address

### Agent Executes:

```javascript
async function fullLaunchWorkflow(userConfig) {
  // Validate
  if (!userConfig.name || !userConfig.symbol || !userConfig.walletAddress) {
    throw new Error('Missing: name, symbol, or walletAddress');
  }
  
  // Step 1: Create token metadata
  const tokenInfo = await createTokenInfo(userConfig);
  
  // Step 2: Create fee share config  
  const feeConfig = await createFeeShareConfig(userConfig.walletAddress);
  
  // Step 3: Get launch transaction
  const launchTx = await createLaunchTransaction({
    ipfs: tokenInfo.ipfs,
    tokenMint: tokenInfo.tokenMint,
    wallet: userConfig.walletAddress,
    configKey: feeConfig.configKey
  });
  
  // Return transaction to user for signing
  return {
    success: true,
    tokenMint: tokenInfo.tokenMint,
    metadataUrl: tokenInfo.metadataUrl,
    transaction: launchTx.transaction,
    instructions: 'Sign this transaction with your wallet to complete launch'
  };
}
```

### After User Signs:

```javascript
// Submit signed transaction to Solana
async function submitTransaction(signedTransaction) {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const tx = VersionedTransaction.deserialize(signedTransaction);
  const signature = await connection.sendTransaction(tx);
  return signature;
}
```

---

## Check Earnings

```javascript
async function checkEarnings(walletAddress) {
  const response = await fetch(
    `https://public-api-v2.bags.fm/api/v1/partner/stats?partnerKey=YOUR_PARTNER_KEY`,
    {
      headers: { 'x-api-key': 'asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN' }
    }
  );
  return response.json();
}
```

---

## Error Handling

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Invalid input | Check name/symbol/wallet format |
| 401 | Bad API key | Verify partner key |
| 429 | Rate limited | Wait 1 minute |
| 500 | Server error | Retry later |

---

## Revenue Model

| Daily Volume | Monthly Earnings |
|--------------|-----------------|
| $1,000 | $195 |
| $10,000 | $1,950 |
| $50,000 | $9,750 |
| $100,000 | $19,500 |

---

## Quick Reference

```bash
# Create Token Info
POST https://public-api-v2.bags.fm/api/v1/token-launch/create-token-info
x-api-key: asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN

# Create Fee Share
POST https://public-api-v2.bags.fm/api/v1/fee-share/create-config
x-api-key: asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN

# Get Launch Tx
POST https://public-api-v2.bags.fm/api/v1/token-launch/create-launch-transaction
x-api-key: asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN

# Partner Stats
GET https://public-api-v2.bags.fm/api/v1/partner/stats
x-api-key: asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN
```
