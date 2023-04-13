const { Product } = require('../models');

const getProducts = async (category, website) => {
  const options = { where: { category } };
  if (!!website) {
    options.where.website = website;
  }
  const products = await Product.findAll(options);
  if (products.length === 0) return null;
  return products;
};

module.exports = {
  getProducts,
};
