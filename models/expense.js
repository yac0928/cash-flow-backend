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
      // define association here
    }
  }
  Expense.init({
    id: DataTypes.STRING,
    date: {
      type: DataTypes.DATE,
      allownull: false
    },
    name: {
      type: DataTypes.STRING,
      allownull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allownull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allownull: false
    },
    comment: DataTypes.TEXT,
    userId: {
      type: DataTypes.INTEGER,
      allownull: false
    }
  }, {
    sequelize,
    modelName: 'Expense',
    tableName: 'Expenses',
    underscored: true
  })
  return Expense
}
