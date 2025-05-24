const productService = require('../services/productService');

async function getNearExpiry(req, res) {
  const products = await productService.listNearExpiryProducts();
  return res.json(products);
}

module.exports = {
  getNearExpiry,
};
