const express = require('express');

const institutionController = require('./institutionController');
const requireAuth = require('../../shared/middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);
router.get('/', institutionController.list);
router.get('/new', institutionController.showCreate);
router.post('/', institutionController.create);

module.exports = router;
