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

// Advanced results middleware
const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
const courseRouter = require('./courses');

const router = express.Router();

// Protect middleware
const { protect } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/:id/photo').put(protect, bootcampPhotoUpload);

router.route('/radius/:zipcode/:distance').get(getBootcampInRadius);

router
	.route('/')
	.get(advancedResults(Bootcamp, 'courses'), getBootcamps)
	.post(protect, createBootcamp);

router.route('/').get(getBootcamps).post(createBootcamp);

router
	.route('/:id')
	.get(getBootcamp)
	.put(protect, updateBootcamp)
	.delete(protect, deleteBootcamp);

module.exports = router;
