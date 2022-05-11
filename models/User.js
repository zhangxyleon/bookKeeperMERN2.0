const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const UserSchema = new mongoose.Schema({
	avatar: {
		type: String
	},
	date: {
		type: Date,
		default: Date.now
	}
});

//UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
module.exports = mongoose.model('User', UserSchema); 