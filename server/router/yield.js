const express = require('express')
const axios = require('axios')

const Yield = express.Router()

Yield.get("/", async(req, res) => {
    try {
        const response = await axios.get("https://yields.llama.fi/pools");
        const aptosPools = response.data.data.filter(pool => pool.chain === "Aptos");
    
        if (aptosPools.length === 0) return res.json({ message: "No Aptos pools found" });
    
        const bestYield = aptosPools.sort((a, b) => b.apy - a.apy);
    
        res.json({ bestYield });
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch yield data" });
      }
})

module.exports = Yield