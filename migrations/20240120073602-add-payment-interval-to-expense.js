'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Expenses', 'payment_month', {
      type: Sequelize.INTEGER
    })
    await queryInterface.addColumn('Expenses', 'payment_day', {
      type: Sequelize.INTEGER
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Expenses', 'payment_month')
    await queryInterface.removeColumn('Expenses', 'payment_day')
  }
}
