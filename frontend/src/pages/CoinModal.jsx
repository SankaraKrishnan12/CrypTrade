import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import axios from "axios";

// Register necessary Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const CoinModal = ({ coin = {}, onClose, onAnalyze, onBuy, onSell, stockId }) => {
  const priceHistory = [
    coin.apyPct1D ?? 0,
    coin.apyPct7D ?? 0,
    coin.apyPct30D ?? 0,
  ];

  const chartData = {
    labels: ["1D", "7D", "30D"],
    datasets: [
      {
        label: "APY %",
        data: priceHistory,
        fill: false,
        borderColor: "rgba(0, 255, 127, 0.8)",
        backgroundColor: "rgba(0, 255, 127, 0.2)",
      },
    ],
  };

  const[final, setFinal] = useState(false)
  const[predicted, setPredicted] = useState(null)
  
  const handlePredict = async() => {
    await axios.get(`http://localhost:5000/yield/${stockId}`)
          .then((res) => {
              setFinal(true)
              setPredicted(res.data)
          })    
          .catch((err) => {
            console.log(err.message)
          })
    }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
        <h2 className="coin-title">{coin.symbol} Details</h2>
        <div className="coin-info">
          <p><strong>Project:</strong> {coin.project}</p>
          <p><strong>Chain:</strong> {coin.chain}</p>
          <p><strong>TVL (USD):</strong> ${coin.tvlUsd?.toLocaleString() ?? "N/A"}</p>
          <p><strong>APY:</strong> {coin.apy ? coin.apy.toFixed(2) : "N/A"}%</p>
          <p>
            <strong>Prediction:</strong>{" "}
            {coin.predictions
              ? `${coin.predictions.predictedClass} (${coin.predictions.predictedProbability?.toFixed(2) ?? "N/A"}%)`
              : "N/A"}
          </p>
        </div>

        <div className="chart-container">
          <Line data={chartData} />
        </div>

          <div className="modal-actions">
            <button className="analyze-btn" onClick={() => handlePredict()}>
              Analyze
            </button>
            <button className="buy-btn" onClick={() => onBuy?.(coin)}>
              Buy
            </button>
            <button className="sell-btn" onClick={() => onSell?.(coin)}>
              Sell
            </button>
          </div>
          
          {final &&
            <div className="prediction">
              <p>Apy : {predicted.predicted_apy}</p>
              <p>Trade Signal : {predicted.trade_signal}</p>
              <p>Best Dex : {predicted.best_dex}</p>
              <p>Risk Level : {predicted.risk_level}</p>
            </div>
          }
        
      </div>
    </div>
  );
};

export default CoinModal;
