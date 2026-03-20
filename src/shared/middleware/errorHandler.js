function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  if (req.accepts('json')) {
    return res.status(statusCode).json({
      error: message,
      details: err.details || null,
    });
  }

  return res.status(statusCode).render('error', {
    title: `${statusCode} - Error`,
    message,
  });
}

module.exports = errorHandler;
