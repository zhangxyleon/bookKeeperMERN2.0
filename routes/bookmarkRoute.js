const express = require('express');
const mongoose = require('mongoose');
const { json } = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticate = require('../authenticate');
const Markcollection = require('../models/Markcollection');
//@route GET /colletions
//@des return collections of one user and will create a collection for a new user
//@access private
router.get('/', authenticate.verifyUser, async (req, res) => {
	try {
		//console.log(req.user._id);
		const collection = await Markcollection.findOne({ user: req.user._id });
		if (collection) {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(collection);
		} else {
			const new_collection = await Markcollection.create({ user: req.user._id });
			if (await Markcollection.findById(new_collection.id)) {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(new_collection);
			}
		}
	} catch (err) {
		res.send(err.message);
	}
});

router.put('/', authenticate.verifyUser, (req, res) => {
	res.statusCode = 403;
	res.end('PUT operation not supported on /favorites/');
});

//@route get /collections/set/
//@des get the set of bookmark of  user
//@access private
router.get('/set', authenticate.verifyUser, async (req, res) => {
	try {
		const collection = await Markcollection.findOne({ user: req.user._id });
		if (collection) {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(collection.set);
		} else {
			return res.status(404).json({ errors: [ { msg: 'collection does not exist' } ] });
		}
	} catch (err) {
		res.send(err.message);
	}
});
//@route post /collections/set/
//@des  add a new bookmark to the set
//@access private
router.post('/set', authenticate.verifyUser, async (req, res) => {
	//console.log(req.user._id);
	try {
		const collection = await Markcollection.findOne({ user: req.user._id });
		//console.log(collection.set);
		if (collection) {
			//check wether this is an unique book mark()
			collection.set.push(req.body);
			await collection.save();
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			//console.log(collection.set);
			res.json(collection.set);
		} else {
			return res.status(404).json({ errors: [ { msg: 'collection does not exist' } ] });
		}
	} catch (err) {
		res.send(err.message);
	}
});
//@route delete /collections/set/:bookmarkId
//@des  delete a  bookmark to the set
//@access private
router.delete('/set/:bookmarkId', authenticate.verifyUser, async (req, res) => {
	try {
		const collection = await Markcollection.findOne({ user: req.user._id });
		if (collection) {
			if (collection.set.id(req.params.bookmarkId) != null) {
				collection.set.id(req.params.bookmarkId).remove();
				await collection.save();
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(collection.set);
			} else {
				return res.status(404).json({ errors: [ { msg: 'This bookmark does not exist' } ] });
			}
		} else {
			return res.status(404).json({ errors: [ { msg: 'collection does not exist' } ] });
		}
	} catch (err) {
		res.send(err.message);
	}
});

//@route post /collections/set/:bookmarkId
//@des  update a  bookmark
//@access private
router.post('/set/:bookmarkId', authenticate.verifyUser, async (req, res) => {
	try {
		const collection = await Markcollection.findOne({ user: req.user._id });
		if (collection) {
			if (collection.set.id(req.params.bookmarkId) != null) {
				collection.set.id(req.params.bookmarkId).name = req.body.name;
				collection.set.id(req.params.bookmarkId).url = req.body.url;
				collection.set.id(req.params.bookmarkId).tag = req.body.tag;
				await collection.save();
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(collection.set);
			} else {
				return res.status(404).json({ errors: [ { msg: 'This bookmark does not exist' } ] });
			}
		} else {
			return res.status(404).json({ errors: [ { msg: 'collection does not exist' } ] });
		}
	} catch (err) {
		res.send(err.message);
	}
});

//@route delete /collections/set/tag/:tagname
//@des  delete all bookmarks with a given tag
//@access private
router.delete('/set/tag/:tagname', authenticate.verifyUser, async (req, res) => {
	try {
		const collection = await Markcollection.findOne({ user: req.user._id });
		if (collection) {
			collection.set = collection.set.filter(({ tag }) => tag != req.params.tagname);
			await collection.save();
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(collection.set);
		} else {
			return res.status(404).json({ errors: [ { msg: 'collection does not exist' } ] });
		}
	} catch (err) {
		res.send(err.message);
	}
});

module.exports = router;