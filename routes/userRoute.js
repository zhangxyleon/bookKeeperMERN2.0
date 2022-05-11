const express = require('express');
const router = express.Router();
const authenticate = require('../authenticate');
const User = require('../models/User');
const gravatar = require('gravatar');
const passport = require('passport');

router.get('/', authenticate.verifyUser, async (req, res) => {
	//console.log(req);
	try {
		const user = await User.findOne({ _id: req.user._id });
		if (user) {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(user);
		} else {
			return res.status(404).json({ errors: [ { msg: 'User does not exist' } ] });
		}
	} catch (err) {
		res.send(err.message);
	}
});

router.post('/signup', (req, res) => {
	User.register(new User({ email: req.body.email }), req.body.password, (err, user) => {
		if (err) {
			res.statusCode = 400;
			res.setHeader('Content-Type', 'application/json');
			res.json({ err: err });
		} else {
			user.save((err, user) => {
				if (err) {
					res.statusCode = 400;
					res.setHeader('Content-Type', 'application/json');
					res.json({ err: err });
					return;
				}

				passport.authenticate('local')(req, res, () => {
					const token = authenticate.getToken({ _id: req.user._id });
					res.statusCode = 200;
					res.setHeader('Content-Type', 'application/json');
					res.json({ success: true, token: token, status: 'Registration Successful!' });
				});
			});
		}
	});
});

router.post('/login', passport.authenticate('local'), (req, res) => {
	const token = authenticate.getToken({ _id: req.user._id });
	res.statusCode = 200;
	res.setHeader('Content-Type', 'application/json');
	res.json({ success: true, token: token, status: 'You are successfully logged in!' });
});

module.exports = router;