'use strict'
const { LoremIpsum } = require('lorem-ipsum')
const faker = require('faker')
const { v4: uuidv4 } = require('uuid')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const lorem = new LoremIpsum()
    // const getRandomDate = () => {
    //   const startDate = new Date('2022-01-01')
    //   const endDate = new Date('2023-12-31')
    //   const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
    //   const randomDate = new Date(randomTime)
    //   return randomDate.toISOString().split('T')[0] // 返回形如 'YYYY-MM-DD' 的日期字符串
    // }
    const getRandomDate = () => {
      const randomDate = faker.date.between('2024-02-01T00:00:00.000Z', '2024-02-29T00:00:00.000Z')
      return randomDate.toISOString().split('T')[0]
    }
    const categories = await queryInterface.sequelize.query('SELECT * FROM Categories', {
      type: Sequelize.QueryTypes.SELECT
    })
    const users = await queryInterface.sequelize.query('SELECT * FROM Users', {
      type: Sequelize.QueryTypes.SELECT
    })
    const payments = await queryInterface.sequelize.query('SELECT * FROM Payments', {
      type: Sequelize.QueryTypes.SELECT
    })
    await queryInterface.bulkInsert('Expenses',
      Array.from({ length: 150 }, () => ({
        date: getRandomDate(),
        name: lorem.generateWords(1),
        amount: Math.floor(Math.random() * 5 + 1) * 1000,
        category_id: categories[Math.floor(Math.random() * categories.length)].id,
        payment_id: payments[Math.floor(Math.random() * payments.length)].id,
        payment_years: Math.floor(Math.random() * 4),
        payment_per_month: Math.floor(Math.random() * 12 + 1),
        comment: lorem.generateSentences(3),
        user_id: users[Math.floor(Math.random() * users.length)].id,
        group: uuidv4(),
        created_at: new Date(),
        updated_at: new Date()
      }))
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Expenses', {})
  }
}
