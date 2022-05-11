const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: true
	},
	tag: {
		type: String,
		required: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

const MarkcollectionSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId
	},
	set: [ BookmarkSchema ],
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = mongoose.model('Markcollection', MarkcollectionSchema);