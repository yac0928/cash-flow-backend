'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Expense.belongsTo(models.Category, { foreignKey: 'categoryId' })
      Expense.belongsTo(models.Payment, { foreignKey: 'paymentId' })
      Expense.belongsTo(models.User, { foreignKey: 'userId' })
    }
  }
  Expense.init({
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    paymentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    paymentYears: {
      type: DataTypes.INTEGER
    },
    paymentPerMonth: {
      type: DataTypes.INTEGER
    },
    comment: {
      type: DataTypes.TEXT
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    group: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Expense',
    tableName: 'Expenses',
    underscored: true
  })
  return Expense
}
