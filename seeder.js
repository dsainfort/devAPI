const fs = require('fs');
const dotenv = require('dotenv').config({ path: './config/config.env' });
const mongoose = require('mongoose').set('strictQuery', false);
const colors = require('colors');

// Load model
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');
const Review = require('./models/Review');

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// Read JSON files
const bootcamps = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

const courses = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);

const users = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

const reviews = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
);

// Import into database
const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);
		await Course.create(courses);
		await User.create(users);
		await Review.create(reviews);
		console.log('Data imported'.bgCyan);
		process.exit();
	} catch (err) {
		console.log(err);
	}
};

// Delete data
const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
		await Course.deleteMany();
		await User.deleteMany();
		await Review.deleteMany();
		console.log('Data destroyed'.bgRed.inverse);
		process.exit();
	} catch (err) {
		console.log(err);
	}
};

// Argv for running seeder
if (process.argv[2] === '-i') {
	importData();
} else if (process.argv[2] === '-d') {
	deleteData();
}
