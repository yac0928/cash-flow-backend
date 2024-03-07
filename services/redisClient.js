const Redis = require('ioredis')

let redisClient

if (process.env.NODE_ENV === 'production') {
  redisClient = new Redis(process.env.REDIS_URI)
} else {
  redisClient = new Redis()
}

module.exports = { redisClient }
