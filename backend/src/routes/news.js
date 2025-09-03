// routes/news.js
const express = require("express");
const router = express.Router();
const { getRandomNews } = require("../controllers/newsController"); // <- ¡Correcto!

router.get("/", async (req, res) => {
  try {
    const articles = await getRandomNews(6); // O el número que quieras
    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo obtener las noticias" });
  }
});

module.exports = router;
