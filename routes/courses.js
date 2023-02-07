const express = require('express');
const {
	getCourses,
	getCourse,
	addCourse,
	updateCourse,
	deleteCourse,
} = require('../controllers/courses');

// Import Course model
const Course = require('../models/Course');

// Advanced filtering middleware
const advancedResults = require('../middleware/advancedResults');

// @description: Initialize routes
const router = express.Router({ mergeParams: true });

// Protect middleware
const { protect } = require('../middleware/auth');

// @description: Routes URL mapping
router
	.route('/')
	.get(
		advancedResults(Course, {
			path: 'bootcamp',
			select: 'name description',
		}),
		getCourses
	)
	.post(protect, addCourse);

router
	.route('/:id')
	.get(getCourse)
	.put(protect, updateCourse)
	.delete(protect, deleteCourse);

// @description: Export route | make it accessible to controllers
module.exports = router;
