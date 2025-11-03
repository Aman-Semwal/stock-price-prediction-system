import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Stock prediction server is running' });
});

// Fetch stock data from Yahoo Finance
app.post('/api/fetch-stock-data', async (req, res) => {
  try {
    const { symbol, startDate, endDate } = req.body;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Stock symbol is required' });
    }

    console.log(`Fetching stock data for ${symbol} from ${startDate} to ${endDate}`);

    // Convert dates to Unix timestamps
    const start = startDate 
      ? Math.floor(new Date(startDate).getTime() / 1000) 
      : Math.floor(new Date('2012-01-01').getTime() / 1000);
    const end = endDate 
      ? Math.floor(new Date(endDate).getTime() / 1000) 
      : Math.floor(Date.now() / 1000);

    // Use Yahoo Finance v8 chart API
    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${start}&period2=${end}&interval=1d`;
    
    const response = await fetch(yahooUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    
    if (!response.ok) {
      console.error(`Yahoo Finance API error: ${response.status}`);
      const errorText = await response.text();
      console.error(`Response: ${errorText}`);
      return res.status(response.status).json({ 
        error: 'Failed to fetch stock data from Yahoo Finance. Please verify the stock symbol.' 
      });
    }

    const jsonData = await response.json();
    
    // Extract data from Yahoo Finance v8 API response
    const result = jsonData.chart.result[0];
    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];
    
    const data = timestamps.map((timestamp, index) => ({
      date: new Date(timestamp * 1000).toISOString().split('T')[0],
      open: quotes.open[index],
      high: quotes.high[index],
      low: quotes.low[index],
      close: quotes.close[index],
      volume: quotes.volume[index],
      adjClose: quotes.close[index]
    })).filter(item => item.close !== null);

    console.log(`Successfully fetched ${data.length} data points for ${symbol}`);

    res.json({ symbol, data });

  } catch (error) {
    console.error('Error in fetch-stock-data:', error);
    res.status(500).json({ 
      error: error.message || 'Unknown error' 
    });
  }
});

// Predict stock prices
app.post('/api/predict-stock', async (req, res) => {
  try {
    const { symbol, stockData } = req.body;
    
    if (!symbol || !stockData) {
      return res.status(400).json({ error: 'Stock symbol and data are required' });
    }

    console.log(`Making prediction for ${symbol} with ${stockData.length} data points`);

    // TODO: Replace with your Python ML API endpoint
    const PYTHON_API_URL = process.env.PYTHON_ML_API_URL || 'http://localhost:5000/predict';
    
    if (!PYTHON_API_URL) {
      console.warn('PYTHON_ML_API_URL not configured, using mock predictions');
      
      // Mock predictions
      const predictions = stockData.map((item, index) => ({
        date: item.date,
        actual: item.close,
        predicted: item.close * (0.95 + Math.random() * 0.1),
      }));

      return res.json({ 
        symbol, 
        predictions,
        note: 'Using mock predictions. Deploy your Python API and set PYTHON_ML_API_URL env variable to get real predictions.'
      });
    }

    // Call Python ML API
    const response = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol,
        data: stockData
      })
    });

    if (!response.ok) {
      console.error(`Python API error: ${response.status}`);
      throw new Error('Failed to get predictions from ML model');
    }

    const predictions = await response.json();
    console.log(`Successfully received predictions for ${symbol}`);

    res.json({ symbol, predictions });

  } catch (error) {
    console.error('Error in predict-stock:', error);
    res.status(500).json({ 
      error: error.message || 'Unknown error' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Stock Prediction Server running on http://localhost:${PORT}`);
  console.log(`📊 API Endpoints:`);
  console.log(`   - POST /api/fetch-stock-data`);
  console.log(`   - POST /api/predict-stock`);
  console.log(`   - GET  /health\n`);
});
