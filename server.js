const dotenv = require('dotenv').config({ path: './config/config.env' });
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

// Route files
const bootcamp = require('./routes/bootcamps');
const course = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

// Connect to database
connectDB();

// Init express
const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Init middleware logs for devs
if ((process.env.NODE_ENV = 'development')) {
	app.use(morgan('dev'));
}

// File upload middleware
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent cross-site scripting requests
app.use(xss());

// Rate limiting
const limiter = rateLimit({
	windowsMs: 10 * 60 * 1000,
	max: 100,
});

app.use(limiter);

// Prevent http param poullution
app.use(hpp());

// Enbale CORS
app.use(cors());


// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.use('/api/v1/bootcamps', bootcamp);
app.use('/api/v1/courses', course);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

// Custom handle error
app.use(errorHandler);

// Server port
const PORT = process.env.PORT || 5000;

// Server config
app.listen(
	PORT,
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
	)
);

// handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red);
	// Close server and exit process
	server.close(() => process.exit(1));
});
