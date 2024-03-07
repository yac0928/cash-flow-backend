const { redisClient } = require('../services/redisClient')

const DEFAULT_EXPIRATION_INTERVAL = 3600

function getOrSetCache (key, cb) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, async (err, data) => {
      if (err) return reject(err)
      if (data !== null) return resolve(JSON.parse(data))
      const freshData = await cb()
      redisClient.setex(key, DEFAULT_EXPIRATION_INTERVAL, JSON.stringify(freshData))
      resolve(freshData)
    })
  })
}

function deleteCache (key) {
  redisClient.del(key, (err, reply) => {
    if (err) throw err
  })
}

module.exports = {
  getOrSetCache,
  deleteCache
}
