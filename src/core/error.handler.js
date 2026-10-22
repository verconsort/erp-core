function errorHandler(err, req, res, next) {
  console.error('[Kernel Error]', err.stack || err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: err.message || 'An unexpected error occurred.'
    }
  });
}

module.exports = errorHandler;
