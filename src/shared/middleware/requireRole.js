const AppError = require('../errors/AppError');

/**
 * Middleware factory — restricts a route to users whose role is in the
 * allowed list.  Must be used AFTER requireAuth.
 *
 * Usage:  router.use(requireRole('Admin'))
 *         router.use(requireRole('Admin', 'Staff'))
 */
function requireRole(...allowedRoles) {
  return function (req, res, next) {
    const user = req.session.user;

    if (!user) {
      if (req.accepts('html')) {
        req.flash('error', 'Please log in to continue.');
        return res.redirect('/auth/login');
      }
      return next(new AppError('Authentication required', 401));
    }

    if (!allowedRoles.includes(user.role)) {
      if (req.accepts('html')) {
        req.flash('error', 'You do not have permission to access that page.');
        return res.redirect('/');
      }
      return next(new AppError('Forbidden', 403));
    }

    return next();
  };
}

module.exports = requireRole;
