const express = require('express');
const { register, login, getMe } = require('../controllers/auth');

// Initialize routes parser
const router = express.Router();

// Protect middleware
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);


// Export routes controller
module.exports = router;
