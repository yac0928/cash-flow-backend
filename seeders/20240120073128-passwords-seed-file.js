'use strict'
const bcrypt = require('bcryptjs')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query('SELECT * FROM Users', {
      type: Sequelize.QueryTypes.SELECT
    })
    const hashedPasswords = await Promise.all(users.map(async user => {
      const passwordHash = await bcrypt.hash('12345678', 10)
      return {
        password_hash: passwordHash,
        user_id: user.id,
        created_at: new Date(),
        updated_at: new Date()
      }
    }))

    // 插入數據
    await queryInterface.bulkInsert('Passwords', hashedPasswords)
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Passwords', {})
  }
}
