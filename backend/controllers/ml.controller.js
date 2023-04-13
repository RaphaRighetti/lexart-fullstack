const { scrapMl } = require("../services/ml.service");

const mlProducts = async (req, res) => {
  try {
    const allowedCategories = ['tv', 'celular', 'geladeira'];
    const { category } = req.params;
    if (!allowedCategories.includes(category)) return res.status(400).json({ message: 'Invalid category' });
    const { q: query } = req.query;
    const response = await scrapMl(category, query);
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error', msg: err.message });
  }
};

module.exports = {
  mlProducts,
};