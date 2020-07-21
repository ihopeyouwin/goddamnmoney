const { DataTypes, UUIDV4 } = require('sequelize');
const sequelize = require('./connection');

const Payments = sequelize.define('payments', {
  paymentId: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  creator: {
    type: DataTypes.UUID,
    allowNull: false
  },
  wallet: {
    type: DataTypes.UUID,
    allowNull: false
  },
  sum: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
});

module.exports = Payments;