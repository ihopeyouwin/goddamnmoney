const { DataTypes } = require('sequelize');
const sequelize = require('./connection');
const Payments = require('./payments');

const Wallets = sequelize.define('wallets', {
  walletId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  creator: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'EUR',
    allowNull: false,
  },
});
Wallets.hasMany(Payments, {foreignKey: 'wallet'});

module.exports = Wallets;