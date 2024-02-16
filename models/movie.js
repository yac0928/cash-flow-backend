'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Movie.hasMany(models.Screening, { foreignKey: 'movieWebId' })
    }
  }
  Movie.init({
    webId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    name: DataTypes.STRING,
    nameEn: DataTypes.STRING,
    duration: DataTypes.STRING,
    description: DataTypes.TEXT,
    posterUrl: DataTypes.STRING,
    movieDetailUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Movie',
    tableName: 'Movies',
    underscored: true
  })
  return Movie
}
