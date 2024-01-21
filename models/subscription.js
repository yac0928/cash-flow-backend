'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Subscription.hasMany(models.User, { foreignKey: 'subscriptionId' })
    }
  }
  Subscription.init({
    level: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Subscription',
    tableName: 'Subscriptions',
    underscored: true
  })
  return Subscription
}
