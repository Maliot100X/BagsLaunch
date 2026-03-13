// BagsLaunch Web Interface
// Powered by Bags.fm API

const API_KEY = 'asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN';
const BASE_URL = 'https://public-api-v2.bags.fm/api/v1';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('launchForm');
  const launchBtn = document.getElementById('launchBtn');
  const status = document.getElementById('status');
  const resultSection = document.getElementById('resultSection');
  const launchAnother = document.getElementById('launchAnother');

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      symbol: formData.get('symbol').toUpperCase(),
      description: formData.get('description') || `AI Agent Token - ${formData.get('symbol')}`,
      imageUrl: formData.get('imageUrl') || 'https://bags.fm/default-token.png',
      walletAddress: formData.get('walletAddress'),
      feeClaimer: formData.get('walletAddress'),
      feeBasisPoints: 6500 // 65%
    };

    // Validate Solana address
    if (!isValidSolanaAddress(data.walletAddress)) {
      showStatus('Invalid Solana wallet address', 'error');
      return;
    }

    // Show loading
    launchBtn.disabled = true;
    launchBtn.textContent = '⏳ Launching...';
    showStatus('🚀 Launching your token on Solana...', 'loading');

    try {
      // Step 1: Create fee share config
      const feeConfigResult = await createFeeShareConfig(data.walletAddress);
      console.log('Fee config:', feeConfigResult);

      // Step 2: Launch token
      const launchResult = await launchToken(data);
      
      if (launchResult.success || launchResult.mintAddress) {
        showStatus('✅ Token launched successfully!', 'success');
        
        // Show result
        document.getElementById('mintAddress').textContent = launchResult.mintAddress || launchResult.tokenMint;
        document.getElementById('tokenUrl').href = launchResult.tokenUrl || `https://app.bags.fm/token/${launchResult.mintAddress || launchResult.tokenMint}`;
        
        form.style.display = 'none';
        resultSection.style.display = 'block';
      } else {
        showStatus(`❌ Error: ${launchResult.message || 'Launch failed'}`, 'error');
      }
    } catch (error) {
      console.error('Launch error:', error);
      showStatus(`❌ Error: ${error.message}`, 'error');
    } finally {
      launchBtn.disabled = false;
      launchBtn.textContent = '🚀 Launch Token';
    }
  });

  // Reset form
  launchAnother.addEventListener('click', () => {
    form.reset();
    form.style.display = 'block';
    resultSection.style.display = 'none';
    status.className = 'status';
    status.textContent = '';
  });

  function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type}`;
  }

  // Validate Solana address (basic check)
  function isValidSolanaAddress(address) {
    // Basic length and character check
    return address && address.length >= 32 && address.length <= 44;
  }

  // Create fee share configuration
  async function createFeeShareConfig(walletAddress) {
    try {
      const response = await fetch(`${BASE_URL}/fee-share/create-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify({
          feeClaimer: walletAddress,
          feeBasisPoints: 6500
        })
      });
      
      // If already exists, continue with launch
      if (!response.ok) {
        console.log('Fee config may already exist, continuing with launch...');
        return { exists: true };
      }
      
      return response.json();
    } catch (error) {
      console.log('Fee config error (continuing):', error.message);
      return { exists: false };
    }
  }

  // Launch token
  async function launchToken(data) {
    const response = await fetch(`${BASE_URL}/token/launch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY
      },
      body: JSON.stringify({
        name: data.name,
        symbol: data.symbol,
        description: data.description,
        imageUrl: data.imageUrl,
        feeClaimer: data.feeClaimer,
        feeBasisPoints: data.feeBasisPoints
      })
    });

    return response.json();
  }
});

// Export for use in other modules
window.BagsLaunch = {
  launchToken,
  createFeeShareConfig,
  checkEarnings
};
