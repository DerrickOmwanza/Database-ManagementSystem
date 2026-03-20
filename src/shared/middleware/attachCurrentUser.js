function attachCurrentUser(req, res, next) {
  res.locals.currentUser = req.session.user || null;
  next();
}

module.exports = attachCurrentUser;
