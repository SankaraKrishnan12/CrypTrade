from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import pickle

app = FastAPI()

# Load trained model
with open("yield_model.pkl", "rb") as f:
    model = pickle.load(f)

# Define input schema
class APYInput(BaseModel):
    apy: float
    apyPct1D: float
    apyPct7D: float
    apyPct30D: float
    tvlUsd: float
    sigma: float
    mu: float

def get_trade_signal(predicted_apy, apy_change_7d, risk_level):
    if predicted_apy > 15 and apy_change_7d > 5 and risk_level == "LOW":
        return "BUY"
    elif predicted_apy < 5 or risk_level == "HIGH":
        return "SELL"
    else:
        return "HOLD"

def get_best_dex():
    return "Liquidswap"  # Placeholder, can integrate real-time DEX selection

@app.post("/predict")
async def predict_apy(apy_data: APYInput):
    features = np.array([[apy_data.apy, apy_data.apyPct1D, apy_data.apyPct7D, apy_data.apyPct30D, apy_data.tvlUsd, apy_data.sigma, apy_data.mu]])
    predicted_apy = model.predict(features)[0]

    # Generate buy/sell signal
    risk_level = "HIGH" if apy_data.sigma > 10 else "LOW"
    trade_signal = get_trade_signal(predicted_apy, apy_data.apyPct7D, risk_level)
    
    return {
        "predicted_apy": predicted_apy,
        "trade_signal": trade_signal,
        "best_dex": get_best_dex(),
        "risk_level": risk_level
    }



