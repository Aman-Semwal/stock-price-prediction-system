// API Configuration

const USE_STANDALONE_BACKEND = import.meta.env.VITE_USE_STANDALONE_BACKEND === 'true';
const STANDALONE_API_URL = import.meta.env.VITE_STANDALONE_API_URL || 'http://localhost:3001/api';

export const API_CONFIG = {
  useStandalone: USE_STANDALONE_BACKEND,
  standaloneUrl: STANDALONE_API_URL,
};

export interface StockDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjClose: number;
}

export interface StockDataResponse {
  symbol: string;
  data: StockDataPoint[];
}

export interface PredictionPoint {
  date: string;
  actual: number;
  predicted: number;
}

export interface PredictionResponse {
  symbol: string;
  predictions: PredictionPoint[];
  note?: string;
}

// Fetch stock data from Yahoo Finance
export async function fetchStockData(
  symbol: string,
  startDate: string,
  endDate: string
): Promise<StockDataResponse> {
  const url = USE_STANDALONE_BACKEND
    ? `${STANDALONE_API_URL}/fetch-stock-data`
    : null; // Will use Supabase function invoke

  if (USE_STANDALONE_BACKEND && url) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symbol, startDate, endDate }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch stock data');
    }

    return await response.json();
  }

  // This will be handled by the component using Supabase
  throw new Error('Supabase integration should be used by the component directly');
}

// Get stock predictions
export async function predictStock(
  symbol: string,
  stockData: StockDataPoint[]
): Promise<PredictionResponse> {
  const url = USE_STANDALONE_BACKEND
    ? `${STANDALONE_API_URL}/predict-stock`
    : null;

  if (USE_STANDALONE_BACKEND && url) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symbol, stockData }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get predictions');
    }

    return await response.json();
  }

  throw new Error('Supabase integration should be used by the component directly');
}
