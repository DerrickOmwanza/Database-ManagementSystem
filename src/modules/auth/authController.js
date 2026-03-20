const asyncHandler = require('../../shared/utils/asyncHandler');
const authRepository = require('./authRepository');
const authService = require('./authService');
const { validateLogin } = require('./authValidators');

const showLogin = asyncHandler(async (req, res) => {
  if (req.session.user) {
    return res.redirect('/auth/me');
  }

  return res.render('auth/login', {
    title: 'Login',
  });
});

const login = asyncHandler(async (req, res) => {
  validateLogin(req.body);

  const user = await authService.authenticate(req.body, authRepository);
  req.session.user = user;

  if (req.accepts('json') && !req.accepts('html')) {
    return res.status(200).json({
      message: 'Login successful',
      user,
    });
  }

  req.flash('success', `Welcome back, ${user.fullName}`);
  return res.redirect('/auth/me');
});

const logout = asyncHandler(async (req, res) => {
  req.session.destroy(() => {
    if (req.accepts('json') && !req.accepts('html')) {
      res.status(200).json({ message: 'Logout successful' });
      return;
    }

    res.redirect('/auth/login');
  });
});

const me = asyncHandler(async (req, res) => {
  if (req.accepts('json') && !req.accepts('html')) {
    return res.status(200).json({
      user: req.session.user,
    });
  }

  return res.render('auth/me', {
    title: 'My Account',
    pageHeading: 'My Account',
    pageDescription: 'View the currently authenticated user profile and session role.',
    user: req.session.user,
  });
});

module.exports = {
  showLogin,
  login,
  logout,
  me,
};
