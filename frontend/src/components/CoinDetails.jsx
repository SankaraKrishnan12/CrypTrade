import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./CoinDetails.css"; // Add styles as needed

const CoinDetails = ({ coin, onClose }) => {
  if (!coin) return null;

  // Mock data for graph (Replace with real API data if available)
  const data = [
    { name: "Day 1", price: coin.apy - 1 },
    { name: "Day 2", price: coin.apy },
    { name: "Day 3", price: coin.apy + 2 },
    { name: "Day 4", price: coin.apy - 0.5 },
    { name: "Day 5", price: coin.apy + 3 },
  ];

  return (
    <div className="coin-details-modal">
      <div className="coin-details-content">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>{coin.project} ({coin.symbol}) Details</h2>
        <p><strong>Chain:</strong> {coin.chain}</p>
        <p><strong>TVL:</strong> ${coin.tvlUsd?.toLocaleString()}</p>
        <p><strong>APY:</strong> {coin.apy?.toFixed(2)}%</p>
        <p><strong>Prediction:</strong> {coin.predictions?.predictedClass} ({coin.predictions?.predictedProbability}%)</p>

        {/* Graph Section */}
        <div className="chart-container">
          <h3>Price Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="price" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Action Buttons */}
        <div className="coin-actions">
          <button className="btn predict">Predict</button>
          <button className="btn buy">Buy</button>
          <button className="btn sell">Sell</button>
        </div>
      </div>
    </div>
  );
};

export default CoinDetails;
