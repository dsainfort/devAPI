const express = require('express');

const { getReviews, getReview, addReview } = require('../controllers/reviews');

// Import Course model
const Review = require('../models/Review');

// @description: Initialize routes
const router = express.Router({ mergeParams: true });

// Advanced filtering middleware
const advancedResults = require('../middleware/advancedResults');

// Protect middleware
const { protect, authorize } = require('../middleware/auth');

// @description: Routes URL mapping
router
	.route('/')
	.get(
		advancedResults(Review, {
			path: 'bootcamp',
			select: 'name description',
		}),
		getReviews
	)
	.post(protect, authorize('user', 'admin'), addReview);

router.route('/:id').get(getReview);

module.exports = router;
