const Parser = require("rss-parser");
const parser = new Parser();

const EL_TIEMPO_FEED = "https://www.eltiempo.com/rss/salud.xml";

async function getRandomNews(count = 3) {
  const feed = await parser.parseURL(EL_TIEMPO_FEED);
  const articles = feed.items
    .filter(
      (item) =>
        item.enclosure?.url && item.title && item.link && item.contentSnippet
    )
    .map((item) => ({
      title: item.title,
      description: item.contentSnippet,
      link: item.link,
      image: item.enclosure.url,
    }));
  const shuffled = articles.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

module.exports = { getRandomNews };
