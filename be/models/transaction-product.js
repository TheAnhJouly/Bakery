module.exports = (sequelize, DataTypes) => {
  const TransactionProduct = sequelize.define('transaction_product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  })
  return TransactionProduct
}
