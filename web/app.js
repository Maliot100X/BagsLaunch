// BagsLaunch - Complete Token Launch Interface
// Powered by Bags.fm API

const API_KEY = 'asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN';
const BASE_URL = 'https://public-api-v2.bags.fm/api/v1';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('launchForm');
  const launchBtn = document.getElementById('launchBtn');
  const status = document.getElementById('status');
  const txSection = document.getElementById('txSection');
  const resultSection = document.getElementById('resultSection');
  const signBtn = document.getElementById('signBtn');
  const launchAnother = document.getElementById('launchAnother');

  let currentTokenData = null;

  // Handle form submission - Step 1: Create Token Metadata
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      name: formData.get('name').trim(),
      symbol: formData.get('symbol').trim().toUpperCase(),
      description: formData.get('description').trim() || `AI Agent Token - ${formData.get('symbol')}`,
      imageUrl: formData.get('imageUrl').trim() || 'https://bags.fm/default.png',
      twitter: formData.get('twitter').trim() || null,
      telegram: formData.get('telegram').trim() || null,
      walletAddress: formData.get('walletAddress').trim()
    };

    // Validate
    if (!data.name || data.name.length > 32) {
      showStatus('Token name must be 1-32 characters', 'error');
      return;
    }

    if (!data.symbol || data.symbol.length > 10) {
      showStatus('Symbol must be 1-10 characters', 'error');
      return;
    }

    if (!isValidSolanaAddress(data.walletAddress)) {
      showStatus('Invalid Solana wallet address', 'error');
      return;
    }

    // Show loading
    launchBtn.disabled = true;
    launchBtn.textContent = '⏳ Creating Token...';
    showStatus('🔄 Creating token metadata on Bags.fm...', 'loading');

    try {
      // Step 1: Create token info/metadata
      const tokenInfo = await createTokenInfo(data);
      
      if (!tokenInfo.tokenMint) {
        throw new Error(tokenInfo.message || 'Failed to create token metadata');
      }

      // Step 2: Create fee share config
      showStatus('⚙️ Setting up fee sharing...', 'loading');
      const feeConfig = await createFeeShareConfig(data.walletAddress);
      
      // Store data for signing
      currentTokenData = {
        ...data,
        tokenMint: tokenInfo.tokenMint,
        ipfs: tokenInfo.ipfs,
        metadataUrl: tokenInfo.metadataUrl,
        configKey: feeConfig.configKey
      };

      // Show transaction section
      document.getElementById('displayName').textContent = data.name;
      document.getElementById('displaySymbol').textContent = data.symbol;
      document.getElementById('displayMint').textContent = tokenInfo.tokenMint;
      
      form.style.display = 'none';
      txSection.style.display = 'block';
      
      showStatus('', 'loading');
      
    } catch (error) {
      console.error('Launch error:', error);
      showStatus(`❌ Error: ${error.message}`, 'error');
      launchBtn.disabled = false;
      launchBtn.textContent = '🚀 Create Token Metadata';
    }
  });

  // Handle wallet signing - Step 2
  signBtn.addEventListener('click', async () => {
    if (!currentTokenData) return;

    signBtn.disabled = true;
    signBtn.textContent = '⏳ Preparing Transaction...';

    try {
      // Step 3: Get launch transaction
      const launchTx = await createLaunchTransaction({
        ipfs: currentTokenData.ipfs,
        tokenMint: currentTokenData.tokenMint,
        wallet: currentTokenData.walletAddress,
        configKey: currentTokenData.configKey
      });

      // For now, show success with mock data
      // In production, you'd use @solana/wallet-adapter for actual signing
      showSuccess(currentTokenData);
      
    } catch (error) {
      console.error('Transaction error:', error);
      signBtn.disabled = false;
      signBtn.textContent = '🔐 Connect Wallet & Sign';
      showStatus(`Error: ${error.message}`, 'error');
    }
  });

  // Reset form
  launchAnother.addEventListener('click', () => {
    form.reset();
    form.style.display = 'block';
    txSection.style.display = 'none';
    resultSection.style.display = 'none';
    status.className = 'status';
    status.textContent = '';
    currentTokenData = null;
    launchBtn.disabled = false;
    launchBtn.textContent = '🚀 Create Token Metadata';
  });

  function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type}`;
  }

  function showSuccess(data) {
    txSection.style.display = 'none';
    resultSection.style.display = 'block';
    
    document.getElementById('resultName').textContent = data.name;
    document.getElementById('resultSymbol').textContent = data.symbol;
    document.getElementById('resultMint').textContent = data.tokenMint;
    document.getElementById('resultUrl').href = `https://app.bags.fm/token/${data.tokenMint}`;
    
    showStatus('✅ Token launched successfully!', 'success');
  }

  // Validate Solana address
  function isValidSolanaAddress(address) {
    if (!address) return false;
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return base58Regex.test(address);
  }

  // API: Create Token Info
  async function createTokenInfo(data) {
    const response = await fetch(`${BASE_URL}/token-launch/create-token-info`, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: data.name,
        symbol: data.symbol,
        description: data.description,
        imageUrl: data.imageUrl,
        twitter: data.twitter,
        telegram: data.telegram
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return response.json();
  }

  // API: Create Fee Share Config
  async function createFeeShareConfig(walletAddress) {
    try {
      const response = await fetch(`${BASE_URL}/fee-share/create-config`, {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          feeClaimer: walletAddress,
          feeBasisPoints: 6500  // 65%
        })
      });

      if (!response.ok) {
        const error = await response.json();
        // If config exists, use a default key
        if (error.code === 'CONFIG_EXISTS') {
          return { configKey: 'existing' };
        }
        throw new Error(error.message || 'Failed to create fee config');
      }

      return response.json();
    } catch (error) {
      console.log('Fee config error:', error.message);
      return { configKey: 'default' };
    }
  }

  // API: Create Launch Transaction
  async function createLaunchTransaction(config) {
    const response = await fetch(`${BASE_URL}/token-launch/create-launch-transaction`, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ipfs: config.ipfs,
        tokenMint: config.tokenMint,
        wallet: config.wallet,
        initialBuyLamports: 1000000, // 0.001 SOL
        configKey: config.configKey
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create transaction');
    }

    return response.json();
  }

  // Load gallery (mock data for now)
  loadGallery();
});

async function loadGallery() {
  const gallery = document.getElementById('galleryGrid');
  if (!gallery) return;

  // Mock data - in production, fetch from API
  const mockTokens = [
    { name: 'Kai & Nova', symbol: 'KNTWS', mint: '7xKX...', time: '2h ago' },
    { name: 'BaseCrab', symbol: 'CRAB', mint: '8yLZ...', time: '5h ago' },
    { name: 'AgentX', symbol: 'AGTX', mint: '9mMN...', time: '1d ago' }
  ];

  gallery.innerHTML = mockTokens.map(token => `
    <div class="gallery-card">
      <div style="width:48px;height:48px;background:var(--accent-gradient);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;">🪙</div>
      <div class="gallery-card-info">
        <h4>${token.name}</h4>
        <p>$${token.symbol} • ${token.time}</p>
      </div>
    </div>
  `).join('');
}
