
## Quick Start

```bash
# Install dependencies
cd server
npm install

# Start the server
npm start

# Or use dev mode (auto-restart on changes)
npm run dev
```

The server will run on `http://localhost:3001`

## Environment Variables

Create a `.env` file in the server directory:

```
PORT=3001
PYTHON_ML_API_URL=http://localhost:5000/predict
```

## API Endpoints

### 1. Fetch Stock Data
```bash
POST /api/fetch-stock-data
Content-Type: application/json

{
  "symbol": "GOOG",
  "startDate": "2012-01-01",
  "endDate": "2024-12-31"
}
```

### 2. Predict Stock Prices
```bash
POST /api/predict-stock
Content-Type: application/json

{
  "symbol": "GOOG",
  "stockData": [...]
}
```

### 3. Health Check
```bash
GET /health
```

## Frontend Configuration

Update your frontend to use this backend instead of Supabase:

In `src/lib/api.ts`, change the API URL:
```typescript
const API_URL = 'http://localhost:3001/api';
```

## Deployment Options

This backend can be deployed to:
- **Railway** - https://railway.app (easiest)
- **Render** - https://render.com (free tier available)
- **Heroku** - https://heroku.com
- **AWS/Azure/GCP** - Any cloud provider
- **Your own server** - VPS, Docker, etc.

## Connecting Your Python ML Model

1. Deploy your Keras model as a REST API (FastAPI/Flask)
2. Set the `PYTHON_ML_API_URL` environment variable
3. The backend will automatically call your model for predictions
