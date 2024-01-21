module.exports = {
  apiErrorHandler (err, req, res, next) {
    if (res.headersSent) {
      return next(err) // 如果响应已经发送，直接调用下一个错误处理中间件
    }
    res.status(500).json({
      status: 'error',
      message: `${err}`
    })
    // if (err instanceof Error) {
    //   res.status(500).json({
    //     status: 'error',
    //     message: `${err.name}: ${err.message}`
    //   })
    // } else {
    //   res.status(500).json({
    //     status: 'error',
    //     message: `${err}`
    //   })
  }
}
