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

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const { user } = req.session;

  if (newPassword !== confirmPassword) {
    req.flash('error', 'New passwords do not match.');
    return res.redirect('/auth/me');
  }

  try {
    await authService.changePassword({
      userId: user.id,
      currentPassword,
      newPassword,
    }, authRepository);

    req.flash('success', 'Your password has been changed successfully.');
  } catch (error) {
    req.flash('error', error.message || 'An error occurred while changing your password.');
  }

  return res.redirect('/auth/me');
});

const changeUsername = asyncHandler(async (req, res) => {
  const { currentPassword, newUsername } = req.body;
  const { user } = req.session;

  try {
    const result = await authService.changeUsername({
      userId: user.id,
      currentPassword,
      newUsername,
    }, authRepository);

    // Update the session so the topbar reflects the new username immediately
    req.session.user = { ...user, username: result.newUsername };
    req.flash('success', `Username changed to "${result.newUsername}" successfully.`);
  } catch (error) {
    req.flash('error', error.message || 'An error occurred while changing your username.');
  }

  return res.redirect('/auth/me');
});

module.exports = {
  showLogin,
  login,
  logout,
  me,
  changePassword,
  changeUsername,
};
