const express = require('express')
const axios = require('axios')
const fs = require('fs')
const {parse} = require('json2csv')

const Yield = express.Router()

Yield.get("/:id", async(req, res) => {
    try {
        const response = await axios.get("https://yields.llama.fi/pools");
        const aptosPools = response.data.data.filter(pool => pool.chain === "Aptos");
    
        if (aptosPools.length === 0) return res.json({ message: "No Aptos pools found" });
    
        const bestYield = aptosPools.sort((a, b) => b.apy - a.apy);
        
        const csv = parse(bestYield)
        fs.writeFileSync('data.csv', csv)
        const id = req.params.id

        const predictionResponse = await axios.post("http://127.0.0.1:8000/predict", {
          apy: bestYield[id].apy,
          apyPct1D: bestYield[id].apyPct1D,
          apyPct7D: bestYield[id].apyPct7D,
          apyPct30D: bestYield[id].apyPct30D,
          tvlUsd: bestYield[id].tvlUsd,
          sigma: bestYield[id].sigma,
          mu: bestYield[id].mu
      });
      
    

      return res.json({ 
        // bestYield, 
        predicted_apy: predictionResponse.data.predicted_apy, 
        trade_signal: predictionResponse.data.trade_signal,
        best_dex: predictionResponse.data.best_dex,
        risk_level: predictionResponse.data.risk_level
    });
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch yield data", error : error.message });
      }
})

module.exports = Yield

