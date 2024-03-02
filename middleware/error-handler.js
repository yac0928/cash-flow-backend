module.exports = {
  apiErrorHandler (err, req, res, next) {
    res.status(500).json({
      status: 'error',
      message: `${err}`
    })
  }
}
