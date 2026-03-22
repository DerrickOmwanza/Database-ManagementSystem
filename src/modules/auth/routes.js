const express = require('express');

const authController = require('./authController');
const requireAuth = require('../../shared/middleware/requireAuth');

const router = express.Router();

router.get('/login', authController.showLogin);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.me);
router.post('/me/password', requireAuth, authController.changePassword);
router.post('/me/username', requireAuth, authController.changeUsername);

module.exports = router;
