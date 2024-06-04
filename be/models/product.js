const { Sequelize } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'products',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      saleCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      coverImage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      salePrice: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      paranoid: true, // mô hình sẽ sử dụng xóa mềm thay vì xóa cứng 
    }
  )
  return Product
}
