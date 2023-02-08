const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const errorResponse = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}

	//Make sure token exist
	if (!token) {
		return next(new errorResponse('Not authorized to access this route', 401));
	}

	try {
		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// console.log(decodedToken);

		req.user = await User.findById(decoded.id);

		next();
	} catch (err) {
		return next(new errorResponse('Invalid token', 401));
	}
});

// Grant access to specific role
exports.authorize = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(new errorResponse(`User role ${req.user.role} is not authorized to access this routes`, 403));
		}
		next();
	}
}