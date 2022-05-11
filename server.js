const express = require('express');
const passport = require('passport');
const app = express();
const path = require('path');

//connet to Mongodb server
const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
		});

		console.log('MongoDB Connected...');
	} catch (err) {
		console.error(err.message);
		process.exit(1);
	}
};

connectDB();
app.use(passport.initialize());
app.use(express.json());
app.use('/users', require('./routes/userRoute'));
app.use('/collections', require('./routes/bookmarkRoute.js'));


app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
	console.info(`Server started on port ${PORT}`);
});
