module.exports = (sequelize, DataTypes) => {
  const Carousel = sequelize.define('carousels', {
    image: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
  })
  return Carousel
}
