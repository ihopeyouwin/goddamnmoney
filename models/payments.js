const { DataTypes } = require('sequelize');
const sequelize = require('./connection');

const Payments = sequelize.define('payments', {
  paymentId: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  creator: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  wallet: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sum: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
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