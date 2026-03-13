// BagsLaunch - Complete Interface

const API_KEY = 'asC9NcTpRAJQ56WppDTHyBtEm5qHyh7tyyBiafiaYvN';
const BASE_URL = 'https://public-api-v2.bags.fm/api/v1';

document.addEventListener('DOMContentLoaded', () => {
  // Calculator
  const volSlider = document.getElementById('volSlider');
  const volValue = document.getElementById('volValue');
  const dailyEl = document.getElementById('daily');
  const monthlyEl = document.getElementById('monthly');
  const annualEl = document.getElementById('annual');
  
  if (volSlider) {
    volSlider.addEventListener('input', (e) => {
      const vol = parseInt(e.target.value);
      if (volValue) volValue.textContent = '$' + vol.toLocaleString();
      
      const daily = vol * 0.01 * 0.65;
      const monthly = daily * 30;
      const annual = daily * 365;
      
      if (dailyEl) dailyEl.textContent = '$' + Math.round(daily).toLocaleString();
      if (monthlyEl) monthlyEl.textContent = '$' + Math.round(monthly).toLocaleString();
      if (annualEl) annualEl.textContent = '$' + Math.round(annual).toLocaleString();
    });
  }
  
  // Launch Form
  const form = document.getElementById('launchForm');
  const launchBtn = document.getElementById('launchBtn');
  const status = document.getElementById('status');
  const result = document.getElementById('result');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('tokenName').value.trim();
      const symbol = document.getElementById('tokenSymbol').value.trim().toUpperCase();
      const description = document.getElementById('tokenDesc')?.value.trim() || `AI Agent Token - ${symbol}`;
      const wallet = document.getElementById('walletAddress').value.trim();

      if (!name || !symbol || !wallet) {
        showStatus('Please fill all required fields', 'error');
        return;
      }

      if (!isValidSolana(wallet)) {
        showStatus('Invalid Solana wallet address', 'error');
        return;
      }

      launchBtn.disabled = true;
      launchBtn.textContent = '⏳ Launching...';
      showStatus('🚀 Creating token metadata...', 'loading');

      try {
        const tokenInfo = await createToken(name, symbol, description);
        
        if (!tokenInfo.tokenMint) {
          throw new Error(tokenInfo.message || 'Failed to create token');
        }

        await setupFeeShare(wallet);

        showStatus('✅ Token launched successfully!', 'success');
        
        document.getElementById('mintAddr').textContent = tokenInfo.tokenMint;
        document.getElementById('tokenLink').href = `https://app.bags.fm/token/${tokenInfo.tokenMint}`;
        
        form.style.display = 'none';
        result.style.display = 'block';
        
      } catch (err) {
        console.error('Error:', err);
        showStatus('❌ ' + (err.message || 'Launch failed'), 'error');
        launchBtn.disabled = false;
        launchBtn.textContent = '🚀 Launch Token';
      }
    });
  }

  function showStatus(msg, type) {
    if (status) {
      status.textContent = msg;
      status.className = 'status ' + type;
    }
  }

  function isValidSolana(addr) {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr);
  }

  async function createToken(name, symbol, desc) {
    const res = await fetch(BASE_URL + '/token-launch/create-token-info', {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        symbol: symbol,
        description: desc,
        imageUrl: 'https://bags.fm/default.png'
      })
    });
    
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'API Error');
    }
    return res.json();
  }

  async function setupFeeShare(wallet) {
    try {
      await fetch(BASE_URL + '/fee-share/create-config', {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          feeClaimer: wallet,
          feeBasisPoints: 6500
        })
      });
    } catch (e) {
      console.log('Fee share note:', e.message);
    }
  }
});
