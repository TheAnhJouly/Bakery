module.exports = (sequelize, DataTypes) => {
  const BigCategory = sequelize.define('big_categories', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  })
  return BigCategory
}
