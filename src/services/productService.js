const { Product } = require('../models');

async function listNearExpiryProducts() {
  const today = new Date();
  const limitDate = new Date(today);
  limitDate.setDate(today.getDate() + 7); // próximos 7 dias

  return await Product.findAll({
    where: {
      expirationDate: {
        [Op.lte]: limitDate,
      },
    },
  });
}

module.exports = {
  listNearExpiryProducts,
};
