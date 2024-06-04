const { Sequelize } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    gender: {
      type: Sequelize.ENUM('male', 'female', 'other'),
      allowNull: false,
    },
    birthday: {
      type: Sequelize.DATEONLY,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: 'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png',
    },
    role: {
      type: Sequelize.ENUM('user', 'admin'),
      allowNull: false,
    },
  })
  return User
}
