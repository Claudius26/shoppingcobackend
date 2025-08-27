const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authControllers');

const {protect} = require('../middlewares/authMiddleware')

// @route POST /api/auth/register
router.post('/register', register);

// @route POST /api/auth/login
router.post('/login', login);

// @route GET /api/auth/me
router.get('/me', protect, getProfile);

module.exports = router;
