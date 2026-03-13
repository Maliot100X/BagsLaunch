// BagsLaunch API Route
// Powered by Bags.fm API

const API_KEY = 'asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN';
const BASE_URL = 'https://public-api-v2.bags.fm/api/v1';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, symbol, description, imageUrl, walletAddress, feeBasisPoints } = req.body;

  // Validation
  if (!name || !symbol || !walletAddress) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      required: ['name', 'symbol', 'walletAddress']
    });
  }

  try {
    // Create fee share config
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

    const result = await response.json();

    if (response.ok) {
      return res.status(200).json({
        success: true,
        ...result,
        platform: 'BagsLaunch (Powered by Bags.fm)'
      });
    } else {
      return res.status(response.status).json({
        success: false,
        error: result.message || 'Launch failed',
        details: result
      });
    }
  } catch (error) {
    console.error('Launch error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
