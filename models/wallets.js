const { DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('./connection');

const Wallets = sequelize.define('wallets', {
  walletId: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  creator: {
    type: DataTypes.UUID,
    allowNull: false
  },
});

module.exports = Wallets;