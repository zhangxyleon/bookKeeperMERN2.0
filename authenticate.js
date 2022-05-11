const config = require('config');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('./models/User');

//https://www.npmjs.com/package/passport-local-mongoose

passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
	return jwt.sign(user, config.secretKey, { expiresIn: 7200 });
};

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: config.get('secretKey')
};

exports.jwtPassport = passport.use(
	new JwtStrategy(options, (jwt_payload, done) => {
		//console.log('JWT payload: ', jwt_payload);
		User.findOne({ _id: jwt_payload._id }, (err, user) => {
			if (err) {
				return done(err, false);
			} else if (user) {
				return done(null, user);
			} else {
				return done(null, false);
			}
		});
	})
);

//return a middleware that verifyuser
exports.verifyUser = passport.authenticate('jwt', { session: false });
