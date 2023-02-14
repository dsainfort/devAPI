const express = require('express');
const {
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
} = require('../controllers/users');

// Import Course model
const User = require('../models/User');

// Initialize express router
const router = express.Router({ mergeParams: true });

// Advanced filtering middleware
const advancedResults = require('../middleware/advancedResults');

// Protect middleware
const { protect, authorize } = require('../middleware/auth');

// Protect all routes with with admin role access only
router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advancedResults(User), getUsers).post(createUser);

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
