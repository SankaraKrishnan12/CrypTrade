import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CoinModal from "./CoinModal";
import aiVid from "./aiMod.mp4";
import AIChatPopup from "../components/aiChatPopup"; 
import Navbar from "../components/navbar";
import "./styles.css";
import "./CoinModal.css";

const Home = () => {
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [yieldData, setYieldData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchYieldData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/yield");
        setYieldData(response.data.bestYield || null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching yield data:", error);
        setLoading(false);
      }
    };

    fetchYieldData();
  }, []);

  const handleAiClick = () => {
    setShowChat((prev) => !prev); 
  };

  return (
    <div className="container">
      <Navbar/>
      <h1 className="title">Crypto Market</h1>

      {loading ? (
        <p>Loading yield data...</p>
      ) : yieldData ? (
        <div className="table-container">
          <table className="crypto-table">
            <thead>
              <tr>
                <th>Chain</th>
                <th>Project</th>
                <th>Symbol</th>
                <th>TVL (USD)</th>
                <th>APY %</th>
                <th>1D Change</th>
                <th>7D Change</th>
                <th>30D Change</th>
                <th>Sigma</th>
                <th>Mu</th>
                <th>Prediction</th>
              </tr>
            </thead>
            <tbody>
              {yieldData.map((coin, index) => (
                <tr key={index} onClick={() => setSelectedCoin(coin)}>
                  <td>{coin.chain}</td>
                  <td>{coin.project}</td>
                  <td>{coin.symbol}</td>
                  <td>${coin.tvlUsd?.toLocaleString() || "N/A"}</td>
                  <td>{coin.apy?.toFixed(2) || "N/A"}%</td>
                  <td className={coin.apyPct1D >= 0 ? "positive" : "negative"}>
                    {coin.apyPct1D}%
                  </td>
                  <td className={coin.apyPct7D >= 0 ? "positive" : "negative"}>
                    {coin.apyPct7D}%
                  </td>
                  <td className={coin.apyPct30D >= 0 ? "positive" : "negative"}>
                    {coin.apyPct30D}%
                  </td>
                  <td>{coin.sigma}</td>
                  <td>{coin.mu}</td>
                  <td
                    className={
                      coin.predictions?.predictedClass === "Up"
                        ? "positive"
                        : "negative"
                    }
                  >
                    {coin.predictions?.predictedClass} (
                    {coin.predictions?.predictedProbability}%)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No data available</p>
      )}

      {selectedCoin && (
        <CoinModal coin={selectedCoin} onClose={() => setSelectedCoin(null)} />
      )}

      <div className="ai-icon-container" onClick={handleAiClick}>
        <video
          ref={videoRef}
          className="ai-icon"
          controls
          disablePictureInPicture
          controlsList="noplaybackrate nodownload nofullscreen noremoteplayback"
          onContextMenu={(e) => e.preventDefault()}
          style={{ pointerEvents: "none" }}
          autoPlay
          loop
          muted
        >
          <source src={aiVid} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {showChat && <AIChatPopup onClose={() => setShowChat(false)} />}
    </div>
  );
};

export default Home;
