const express = require("express");
const router = express.Router();
const db = require("../models");

// Devuelve un consejo aleatorio
router.get("/random", async (req, res) => {
  try {
    const count = await db.HealthTip.count();
    const random = Math.floor(Math.random() * count);
    const tip = await db.HealthTip.findOne({ offset: random });
    if (!tip) return res.status(404).json({ message: "No hay consejos" });
    res.json(tip);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
