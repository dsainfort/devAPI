const advancedResults = (model, populate) => async (req, res, next) => {
	let query;
	// Copy req.query to reqQuery with spread parameter
	const reqQuery = { ...req.query };

	// Remove fields acting like query selectors
	const removeFields = ['select', 'sort', 'page', 'limit'];

	// Loop over remove fields and delete them from reqQuery
	removeFields.forEach((param) => delete reqQuery[param]);

	// console.log(reqQuery);

	// Create query string
	let queryStr = JSON.stringify(reqQuery);

	// Create operator with regex (gt, gte, etc...)
	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	);

	// Finding resources object
	query = model.find(JSON.parse(queryStr));

	// Select fields
	if (req.query.select) {
		const fields = req.query.select.split(',').join(' ');
		query = query.select(fields);
	}

	// Sort fields
	if (req.query.sort) {
		const sortBy = req.query.sort.split(',').join(' ');
		query = query.sort(sortBy);
	} else {
		query = query.sort('-createdAt DESC');
	}

	// Pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 25;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await model.countDocuments();

	query = query.skip(startIndex).limit(limit);

	if (populate) {
		query = query.populate(populate);
	}

	// Execute query
	const results = await query;

	// Pagination result
	const pagination = {};

	// Next page
	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}

	// Previous page
	if (startIndex < 0) {
		pagination.prev = {
			page: page - 1,
			limit,
		};
	}

	res.advancedResults = {
		success: true,
		count: results.length,
		pagination,
		data: results,
	};

	next();
};

module.exports = advancedResults;
