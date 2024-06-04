module.exports = (sequelize, DataTypes) => {
  const UserReview = sequelize.define('user-review', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
  })
  return UserReview
}
