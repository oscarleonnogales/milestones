const express = require('express');
const router = express.Router();
const passport = require('passport');
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

import { checkNotAuthenticated } from '../basicAuth';

//homepage with all posts
router.get('/', async (req, res) => {
	// await Comment.deleteMany({});
	// await Post.deleteMany({});
	// await User.deleteMany({});
	const posts = await Post.find().sort({ createdAt: 'desc' }).populate('author');
	res.status(200);
	res.render('index', {
		user: req.user,
		posts: posts,
	});
});

//login page
router.get('/login', checkNotAuthenticated, (req, res) => {
	res.status(200);
	res.render('users/login', { user: new User(), error: null, message: null });
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

//signup page
router.get('/signup', checkNotAuthenticated, (req, res) => {
	res.status(200);
	res.render('users/signup', { user: new User(), error: null });
});

// 404 page
router.get('*', (req, res) => {
	res.status(404);
	res.render('404');
});

module.exports = router;
