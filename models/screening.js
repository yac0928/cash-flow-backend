'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Screening extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Screening.belongsTo(models.Movie, { foreignKey: 'movieWebId' })
    }
  }
  Screening.init({
    movieWebId: DataTypes.STRING,
    room: DataTypes.STRING,
    date: DataTypes.DATE,
    time: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Screening',
    tableName: 'Screenings',
    underscored: true
  })
  return Screening
}
