// BagsLaunch - Complete Interface

const API_KEY = 'asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN';
const BASE_URL = 'https://public-api-v2.bags.fm/api/v1';

document.addEventListener('DOMContentLoaded', () => {
  // Calculator
  const volumeSlider = document.getElementById('volumeSlider');
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      const volume = parseInt(e.target.value);
      document.getElementById('volumeValue').textContent = '$' + volume.toLocaleString();
      
      const daily = volume * 0.01 * 0.65;
      const monthly = daily * 30;
      const annual = daily * 365;
      
      document.getElementById('dailyEarn').textContent = '$' + Math.round(daily).toLocaleString();
      document.getElementById('monthlyEarn').textContent = '$' + Math.round(monthly).toLocaleString();
      document.getElementById('annualEarn').textContent = '$' + Math.round(annual).toLocaleString();
    });
  }
  
  // Launch Form
  const form = document.getElementById('launchForm');
  const launchBtn = document.getElementById('launchBtn');
  const status = document.getElementById('status');
  const resultSection = document.getElementById('resultSection');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const data = {
        name: formData.get('name').trim(),
        symbol: formData.get('symbol').trim().toUpperCase(),
        description: formData.get('description').trim() || `AI Agent Token - ${formData.get('symbol')}`,
        imageUrl: 'https://bags.fm/default.png',
        walletAddress: formData.get('walletAddress').trim()
      };

      // Validate
      if (!data.name || !data.symbol || !data.walletAddress) {
        showStatus('Please fill all required fields', 'error');
        return;
      }

      if (!isValidSolanaAddress(data.walletAddress)) {
        showStatus('Invalid Solana wallet address', 'error');
        return;
      }

      launchBtn.disabled = true;
      launchBtn.textContent = '⏳ Launching...';
      showStatus('🚀 Creating token metadata...', 'loading');

      try {
        // Step 1: Create token info
        const tokenInfo = await createTokenInfo(data);
        
        if (!tokenInfo.tokenMint) {
          throw new Error(tokenInfo.message || 'Failed to create token');
        }

        // Step 2: Create fee share config
        showStatus('⚙️ Setting up fee sharing...', 'loading');
        await createFeeShareConfig(data.walletAddress);

        // Show success
        showStatus('✅ Token launched successfully!', 'success');
        
        document.getElementById('mintAddress').textContent = tokenInfo.tokenMint;
        document.getElementById('tokenUrl').href = `https://app.bags.fm/token/${tokenInfo.tokenMint}`;
        
        form.style.display = 'none';
        resultSection.style.display = 'block';
        
      } catch (error) {
        console.error('Error:', error);
        showStatus('❌ Error: ' + error.message, 'error');
        launchBtn.disabled = false;
        launchBtn.textContent = '🚀 Launch Token';
      }
    });
  }

  function showStatus(message, type) {
    status.textContent = message;
    status.className = 'status ' + type;
  }

  function isValidSolanaAddress(address) {
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return base58Regex.test(address);
  }

  async function createTokenInfo(data) {
    const response = await fetch(BASE_URL + '/token-launch/create-token-info', {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: data.name,
        symbol: data.symbol,
        description: data.description,
        imageUrl: data.imageUrl
      })
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'API Error');
    }

    return response.json();
  }

  async function createFeeShareConfig(walletAddress) {
    try {
      const response = await fetch(BASE_URL + '/fee-share/create-config', {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          feeClaimer: walletAddress,
          feeBasisPoints: 6500
        })
      });
      return response.json();
    } catch (e) {
      console.log('Fee config note:', e.message);
    }
  }
});
