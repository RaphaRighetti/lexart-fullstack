const { scrapBuscape } = require("./buscape.service");
const { scrapMl } = require("./ml.service");

const getAllProducts = async (category, query) => {
  const mlProducts = await scrapMl(category, query);
  const buscapeProducts = await scrapBuscape(category, query);
  return [...mlProducts, ...buscapeProducts];
};

module.exports = {
  getAllProducts,
};