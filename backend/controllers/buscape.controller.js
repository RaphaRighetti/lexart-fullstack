const { scrapBuscape } = require("../services/buscape.service");

const buscapeProducts = async (req, res) => {
  try {
    const allowedCategories = ['tv', 'celular', 'geladeira'];
    const { category } = req.params;
    if (!allowedCategories.includes(category)) return res.status(400).json({ message: 'Invalid category' });
    const { q: query } = req.query;
    const response = await scrapBuscape(category, query);
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error', msg: err.message });
  }
};

module.exports = {
  buscapeProducts,
};