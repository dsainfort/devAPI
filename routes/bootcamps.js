const express = require('express');
const {
	getBootcamps,
	getBootcamp,
	createBootcamp,
	updateBootcamp,
	deleteBootcamp,
	getBootcampInRadius,
	bootcampPhotoUpload,
} = require('../controllers/bootcamps');

// Bringing models
const Bootcamp = require('../models/Bootcamp');

// Initialize routes
const router = express.Router();

// Include other resource routers
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

// Advanced results middleware
const advancedResults = require('../middleware/advancedResults');

// Protect middleware
const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router
	.route('/:id/photo')
	.put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);

router
	.route('/')
	.get(advancedResults(Bootcamp, 'courses'), getBootcamps)
	.post(protect, authorize('publisher', 'admin'), createBootcamp);

router.route('/').get(getBootcamps).post(createBootcamp);

router
	.route('/:id')
	.get(getBootcamp)
	.put(protect, authorize('publisher', 'admin'), updateBootcamp)
	.delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router;
