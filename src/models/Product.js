module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name: DataTypes.STRING,
    expirationDate: DataTypes.DATE,
    price: DataTypes.FLOAT,
    status: DataTypes.STRING, // ex: "valid", "near_expiry", "expired"
  });

  return Product;
};