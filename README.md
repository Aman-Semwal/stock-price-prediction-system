
# 📈 Stock Price Prediction Web App

A full-stack Machine Learning–based web application that predicts stock prices using **historical data**, **LSTM models**, and **Yahoo Finance API**.  
Built with **FastAPI (Python)** for the backend and **React + TypeScript (Vite)** for the frontend.

---

## 🚀 Project Overview

This project allows users to:
- Search for any stock symbol (like **AAPL**, **GOOG**, **TSLA**, etc.)
- Fetch real-time and historical data from **Yahoo Finance**
- Predict future stock prices using a trained **LSTM model**
- Visualize stock trends and prediction results interactively

---

## 🧠 Tech Stack

| Component | Technology Used |
|------------|----------------|
| **Frontend** | React + TypeScript + Vite |
| **Backend** | FastAPI (Python) |
| **Machine Learning** | LSTM (TensorFlow / Keras) |
| **Data Source** | Yahoo Finance API |
| **Styling** | TailwindCSS / CSS Modules |
| **Deployment Ready** | Vercel (frontend), Render / Railway (backend) |

```

---

## 🧩 Backend (FastAPI)

### ▶️ Run Backend Locally

```bash
cd backend
python -m venv venv
venv\Scripts\activate       # For Windows
# or
source venv/bin/activate    # For Linux/Mac

pip install -r requirements.txt
python app.py
```

**Server URL:**  
```
http://localhost:3001
```

**Available Endpoints:**
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/fetch-stock-data` | Fetch stock data from Yahoo Finance |
| POST | `/api/predict-stock` | Predict stock prices using LSTM |
| GET | `/health` | Server health check |

---

## 💻 Frontend (React + Vite)

### ▶️ Run Frontend Locally

```bash
cd frontend
npm install
npm run dev
```

**Frontend URL:**
```
http://localhost:8081
```

**Environment Variables (`.env`):**
```bash
VITE_USE_STANDALONE_BACKEND=true
VITE_STANDALONE_API_URL=http://localhost:3001/api
```

---

## 🌐 API Integration Flow

1. User enters a stock symbol and date range.  
2. Frontend calls `/api/fetch-stock-data` (Yahoo Finance API via backend).  
3. Backend sends data to ML model for prediction.  
4. Frontend displays both **actual** and **predicted** stock prices in charts.

---

## 📊 Example Prediction Chart

![Example Graph](https://user-images.githubusercontent.com/example-placeholder.png)  
*(Displays stock closing prices vs predicted values)*

---

## 🧰 Tools & Libraries Used

- **Python:** FastAPI, NumPy, Pandas, Matplotlib, TensorFlow, yFinance  
- **JavaScript:** React, TypeScript, Vite, Fetch API  
- **Deployment:** Vercel (Frontend), Render/Railway (Backend)

---

## ✅ Features Summary

- 📡 Fetches live stock market data  
- 🔮 Predicts future prices using LSTM  
- 📊 Interactive visualizations  
- 🌐 CORS-enabled API for frontend integration  
- ⚙️ Environment-based backend selection  

---

## 📜 License

This project is licensed under the **MIT License** — feel free to use and modify.

---

## ❤️ Acknowledgements

- [Yahoo Finance API](https://finance.yahoo.com/)  
- [FastAPI](https://fastapi.tiangolo.com/)  
- [TensorFlow / Keras](https://www.tensorflow.org/)  
- [React + Vite](https://vitejs.dev/)

