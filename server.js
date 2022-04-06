const express = require('express');

const app = express();

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

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
	console.info(`Server started on port ${PORT}`);
});
