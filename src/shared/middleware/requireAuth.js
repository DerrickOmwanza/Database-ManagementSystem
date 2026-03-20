const AppError = require('../errors/AppError');

function requireAuth(req, res, next) {
  if (!req.session.user) {
    if (req.accepts('html')) {
      req.flash('error', 'Please log in to continue');
      return res.redirect('/auth/login');
    }

    return next(new AppError('Authentication required', 401));
  }

  return next();
}

module.exports = requireAuth;
