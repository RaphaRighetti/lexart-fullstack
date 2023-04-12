module.exports = (sequelize, DataTypes) => {
  
  const Product = sequelize.define('Product', {
    title: DataTypes.STRING,
    price: DataTypes.STRING,
    image: DataTypes.STRING,
    link: DataTypes.STRING,
    category: DataTypes.STRING,
  }, 
  {
    timestamps: false,
    tableName: 'products',
  });
  return Product
};