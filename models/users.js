const { DataTypes } = require('sequelize');
const sequelize = require('./connection');
const Payments = require('./payments');
const Wallets = require('./wallets');

const Users = sequelize.define('users', {
  userId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

Users.hasMany(Payments, {foreignKey: 'creator'});
Users.hasMany(Wallets, {foreignKey: 'creator'});

module.exports = Users;