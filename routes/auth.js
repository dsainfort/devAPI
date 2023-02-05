const express = require('express');
const { register } = require('../controllers/auth');

// Initialize routes parser
const router = express.Router();

router.post('/register', register);

// Export routes controller
module.exports = router;
