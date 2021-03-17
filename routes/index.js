const express = require('express');
const router = express.Router();
const passport = require('passport');
const Post = require('../models/post');
const User = require('../models/user');

import { checkAuthenticated, checkNotAuthenticated } from '../middleware';

function getPaginatedResults(Model) {
	return async (req, res, next) => {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;

		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;

		const paginatedResults = {};
		if (startIndex > 0) {
			paginatedResults.previous = {
				page: page - 1,
				limit,
			};
		}
		if (endIndex < (await Model.countDocuments().exec())) {
			paginatedResults.next = {
				page: page + 1,
				limit,
			};
		}
		try {
			paginatedResults.results = await Model.find()
				.sort({ createdAt: 'desc' })
				.populate('author')
				.limit(limit)
				.skip(startIndex)
				.exec();
			res.paginatedResults = paginatedResults;
			next();
		} catch (error) {
			res.status(500);
			console.log(error);
		}
	};
}

//homepage with all posts
router.get('/', getPaginatedResults(Post), async (req, res) => {
	// await Comment.deleteMany({});
	// await Post.deleteMany({});
	// await User.deleteMany({});

	const posts = await Post.find().sort({ createdAt: 'desc' }).populate('author');

	res.status(200);
	res.render('index', {
		currentClient: req.user,
		paginatedResults: res.paginatedResults,
	});
});

//login page
router.get('/login', checkNotAuthenticated, (req, res) => {
	res.status(200);
	res.render('users/login');
});

//signup page
router.get('/signup', checkNotAuthenticated, (req, res) => {
	res.status(200);
	res.render('users/signup');
});

router.get('/profile', checkAuthenticated, async (req, res) => {
	const user = await User.findOne({ username: req.user.username });
	const postsByUser = await Post.find({ author: user });
	res.render('users/profile', {
		user: user,
		posts: postsByUser,
		currentClient: req.user,
	});
});

router.get('/settings', checkAuthenticated, async (req, res) => {
	try {
		const user = await User.findOne({ username: req.user.username });
		res.render('users/settings', {
			user: user,
			currentClient: req.user,
		});
	} catch {
		res.status(500);
		res.redirect('/');
	}
});

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true,
	})
);

router.delete('/logout', (req, res) => {
	req.logOut();
	res.status(200);
	res.redirect('/');
});

// 404 page
router.get('*', (req, res) => {
	res.status(404);
	res.render('404');
});

module.exports = router;
