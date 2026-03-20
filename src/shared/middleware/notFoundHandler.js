function notFoundHandler(req, res) {
  if (req.accepts('json')) {
    return res.status(404).json({
      error: 'Route not found',
    });
  }

  return res.status(404).render('error', {
    title: '404 - Page Not Found',
    message: 'The page you are looking for does not exist.',
  });
}

module.exports = notFoundHandler;
