# Deployment Guide

This project can be used in **two ways**:

## Option 1: Inside Lovable (Current Setup)
✅ **Already running** - No extra setup needed
- Frontend: Auto-deployed by Lovable
- Backend: Lovable Cloud (Supabase Edge Functions)
- Perfect for quick development and testing

## Option 2: Outside Lovable (Standalone)

### Use in Any IDE (VSCode, WebStorm, etc.)

#### 1️⃣ **Clone the Repository**
```bash
git clone <your-repo-url>
cd <project-name>
```

#### 2️⃣ **Install Dependencies**
```bash
# Frontend
npm install

# Backend (standalone)
cd server
npm install
cd ..
```

#### 3️⃣ **Choose Your Backend**

**A. Keep Using Lovable Cloud (Recommended)**
```bash
# Create .env file
cp .env.example .env

# Add your Supabase credentials (get from Lovable Cloud tab)
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_PUBLISHABLE_KEY=...

# Run frontend
npm run dev
```

**B. Use Standalone Node.js Backend**
```bash
# Update .env
VITE_USE_STANDALONE_BACKEND=true
VITE_STANDALONE_API_URL=http://localhost:3001/api

# Terminal 1: Start backend
cd server
npm start

# Terminal 2: Start frontend
npm run dev
```

#### 4️⃣ **Open Browser**
Navigate to `http://localhost:5173`

---

## Deployment to Production

### Frontend Deployment
Deploy to any hosting provider:
- **Vercel**: `vercel deploy`
- **Netlify**: Connect GitHub repo
- **AWS S3 + CloudFront**
- **Your own server**: Build with `npm run build`

### Backend Options

#### A. Keep Lovable Cloud
- ✅ Nothing to do - already deployed!
- Just update environment variables in production frontend

#### B. Deploy Standalone Backend

**Railway** (Easiest):
```bash
cd server
railway init
railway up
```

**Render**:
1. Connect GitHub repo
2. Set root directory: `server`
3. Build command: `npm install`
4. Start command: `npm start`

**Docker** (Any provider):
```bash
cd server
docker build -t stock-prediction-api .
docker run -p 3001:3001 stock-prediction-api
```

---

## Connecting Your Python ML Model

### 1. Create FastAPI Wrapper
```python
# api.py
from fastapi import FastAPI
from keras.models import load_model
import numpy as np

app = FastAPI()
model = load_model('Stock Predictions Model.keras')

@app.post("/predict")
async def predict(data: dict):
    symbol = data['symbol']
    stock_data = data['data']
    
    # Your ML prediction logic here
    predictions = your_prediction_function(stock_data)
    
    return {
        "symbol": symbol,
        "predictions": predictions
    }
```

### 2. Deploy Python API
- **Railway**: `railway up`
- **Render**: Connect repo
- **Heroku**: `git push heroku main`

### 3. Configure Backend
Update environment variable:
```bash
# For standalone backend
echo "PYTHON_ML_API_URL=https://your-python-api.com/predict" >> server/.env

# For Lovable Cloud
# Add PYTHON_ML_API_URL secret in Lovable Cloud tab
```

---

## Environment Variables Summary

### Frontend (.env)
```bash
# Lovable Cloud (Option A)
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_key

# Standalone Backend (Option B)
VITE_USE_STANDALONE_BACKEND=true
VITE_STANDALONE_API_URL=https://your-backend.com/api
```

### Backend (server/.env)
```bash
PORT=3001
PYTHON_ML_API_URL=https://your-ml-model.com/predict
```

---

## Development Workflow

**Working in Lovable:**
1. Chat with AI to make changes
2. Changes auto-deploy
3. Test immediately

**Working in VSCode (or any IDE):**
1. Clone repo
2. Make changes locally
3. Push to GitHub
4. Lovable auto-syncs (if connected)
5. Or deploy separately

**Best of Both Worlds:**
- Prototype in Lovable (fast)
- Export to IDE for fine-tuning
- Deploy anywhere you want

---

## Troubleshooting

**Can't connect to backend?**
- Check if backend is running: `curl http://localhost:3001/health`
- Verify environment variables
- Check CORS settings

**Supabase functions not working locally?**
- Install Supabase CLI: `npm install -g supabase`
- Run locally: `supabase functions serve`

**Need help?**
Check the README files:
- `README.md` - Main project
- `server/README.md` - Backend details
