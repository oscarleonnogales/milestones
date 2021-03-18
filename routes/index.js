const express = require('express');
const router = express.Router();
const passport = require('passport');
const Post = require('../models/post');
const User = require('../models/user');

import { checkAuthenticated, checkNotAuthenticated, getPaginatedResults } from '../middleware';

//homepage with all posts
router.get('/', getPaginatedResults(Post, {}), async (req, res) => {
	// await Comment.deleteMany({});
	// await Post.deleteMany({});
	// await User.deleteMany({});

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
	const postsByUser = await Post.find({ author: req.user });
	res.render('users/profile', {
		user: req.user,
		posts: postsByUser,
		currentClient: req.user,
	});
});

router.get('/settings', checkAuthenticated, async (req, res) => {
	try {
		const user = await User.findOne({ username: req.user.username });
		res.render('users/settings', {
			currentClient: req.user,
			message: null,
			error: null,
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
