const express = require('express');
const { register, login } = require('../controllers/auth');

// Initialize routes parser
const router = express.Router();

router.post('/register', register);
router.post('/login', login);


// Export routes controller
module.exports = router;
