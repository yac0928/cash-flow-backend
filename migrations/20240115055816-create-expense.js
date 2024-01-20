'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Expenses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      amount: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      category_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      payment_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      comment: {
        type: Sequelize.TEXT
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Expenses')
  }
}
