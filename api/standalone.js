const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8888;

// Serve static frontend (new React build)
app.use(express.static(path.join(__dirname, '../frontend-new/dist')));

// Fetch Bitcoin price from CoinGecko API
async function fetchBitcoinPrice() {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur,gbp&include_24hr_change=true&include_market_cap=true'
  );
  const data = await response.json();
  return {
    usd: data.bitcoin.usd,
    eur: data.bitcoin.eur,
    gbp: data.bitcoin.gbp,
    change_24h: data.bitcoin.usd_24h_change,
    market_cap: data.bitcoin.usd_market_cap,
    timestamp: new Date().toISOString()
  };
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    redis: 'disabled (standalone mode)',
    timestamp: new Date().toISOString()
  });
});

// Get Bitcoin price
app.get('/api/price', async (req, res) => {
  try {
    console.log('🌐 Fetching BTC price from CoinGecko...');
    const price = await fetchBitcoinPrice();
    res.json({ ...price, cached: false });
  } catch (error) {
    console.error('Error fetching price:', error);
    res.status(500).json({ error: 'Failed to fetch Bitcoin price' });
  }
});

// Get historical sentiment (mock data for demo)
app.get('/api/sentiment', (req, res) => {
  const sentiments = ['Extreme Fear', 'Fear', 'Neutral', 'Greed', 'Extreme Greed'];
  const index = Math.floor(Math.random() * 100);
  let sentiment;
  if (index < 20) sentiment = sentiments[0];
  else if (index < 40) sentiment = sentiments[1];
  else if (index < 60) sentiment = sentiments[2];
  else if (index < 80) sentiment = sentiments[3];
  else sentiment = sentiments[4];

  res.json({
    index,
    sentiment,
    timestamp: new Date().toISOString()
  });
});

// Saylor's wisdom endpoint
app.get('/api/wisdom', (req, res) => {
  const rules = [
    "Those who understand Bitcoin buy Bitcoin. Those who don't, criticize Bitcoin.",
    "Everyone is against Bitcoin before they are for it.",
    "You will never be done learning about Bitcoin.",
    "Bitcoin is powered by chaos.",
    "Bitcoin is the only game in the casino that we can all win.",
    "Bitcoin won't protect you if you don't wear the armor.",
    "Bitcoin is the one thing in the universe you can truly own.",
    "Everyone gets Bitcoin at the price they deserve.",
    "Only buy Bitcoin with the money you can't afford to lose.",
    "Tickets to escape the matrix are priced in Bitcoin.",
    "All your models will be destroyed.",
    "The cure to economic ill is the orange pill.",
    "Be for Bitcoin, not against fiat.",
    "Bitcoin is for everyone.",
    "Think in terms of Bitcoin.",
    "You don't change Bitcoin, it changes you.",
    "Laser eyes protect you from endo lies.",
    "Respect Bitcoin, or it will make a clown out of you.",
    "You do not sell your Bitcoin.",
    "Spread Bitcoin with love."
  ];
  
  res.json({
    rule: rules[Math.floor(Math.random() * rules.length)],
    source: "Michael Saylor's 21 Rules of Bitcoin"
  });
});

// Catch-all for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend-new/dist/index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Bitcoin Tracker running on port ${PORT}`);
  console.log(`📊 Open: http://localhost:${PORT}`);
});
