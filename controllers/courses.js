const ErrorResponse = require('../utils/errorReponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

// @desc Get all courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampID/courses
// @access Public
exports.getCourses = asyncHandler(async (req, res, next) => {
	if (req.params.bootcampId) {
		const courses = await Course.find({ bootcamp: req.params.bootcampId });
		res.status(200).json({
			success: true,
			count: courses.length,
			data: courses,
		});
	} else {
		res.status(200).json(res.advancedResults);
	}
});

// @desc Get single courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampID/courses
// @access Public
exports.getCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id).populate({
		path: 'bootcamp',
		select: 'name description',
	});

	if (!course) {
		return next(
			new ErrorResponse(`No Course with the id of ${req.params.id}`),
			404
		);
	}

	res.status(200).json({
		success: true,
		data: course,
	});
});

// @desc Add single course
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access Private
exports.addCourse = asyncHandler(async (req, res, next) => {
	req.body.bootcamp = req.params.bootcampId;

	const bootcamp = await Bootcamp.findById(req.params.bootcampId);

	if (!bootcamp) {
		return next(
			new ErrorResponse(`No Bootcamp with the id of ${req.params.bootcampId}`),
			404
		);
	}

	const course = await Course.create(req.body);

	res.status(200).json({
		success: true,
		data: course,
	});
});

// @desc Update single course
// @route PUT /api/v1/courses/:id
// @route PUT /api/v1/courses/:id
// @access Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
	let course = await Course.findById(req.params.id);

	if (!course) {
		return next(
			new ErrorResponse(`No Course with the id of ${req.params.id}`),
			404
		);
	}

	course = await Course.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: course,
	});
});

// @desc Delete single course
// @route DELETE /api/v1/bootcamps/:bootcampId/courses
// @route DELETE /api/v1/bootcamps/:bootcampId/courses
// @access Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
	const course = await Course.findById(req.params.id);

	if (!course) {
		return next(
			new ErrorResponse(`No Course with the id of ${req.params.id}`),
			404
		);
	}

	await course.remove();

	res.status(200).json({
		success: true,
		data: {},
	});
});
