const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('express-flash');
const methodOverride = require('method-override');

const env = require('./config/env');
const routes = require('./routes');
const attachCurrentUser = require('./shared/middleware/attachCurrentUser');
const notFoundHandler = require('./shared/middleware/notFoundHandler');
const errorHandler = require('./shared/middleware/errorHandler');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(session({
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  rolling: true,                      // reset expiry on every request
  cookie: {
    maxAge: 30 * 60 * 1000,           // 30-minute inactivity timeout
    httpOnly: true,                   // not accessible via JS
    sameSite: 'lax',
    secure: env.nodeEnv === 'production',
  },
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentPath = req.path;
  next();
});

app.use(attachCurrentUser);
app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
