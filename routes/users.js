const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
import { checkAuthenticated } from '../basicAuth';

// All users
router.get('/', async (req, res) => {
	let searchOptions = {};
	if (req.query.username != null && req.query.username !== '') {
		searchOptions.username = new RegExp(req.query.username, 'i');
	}
	try {
		const users = await User.find(searchOptions);
		res.render('users/index', { users: users, searchOptions: req.query });
	} catch {
		res.redirect('/');
	}
});

// Show a user profile
router.get('/:username', async (req, res) => {
	let userViewing;
	let loggedIn = false;
	try {
		userViewing = await User.findOne({ username: req.params.username }).populate('posts');
		if (userViewing) {
			res.status(200);
			let alreadyFollowing = false;
			if (req.user) {
				req.user.following.forEach((user) => {
					if (user.username === req.params.username) alreadyFollowing = true;
				});
				loggedIn = true;
			}
			res.render('users/profile', { user: userViewing, loggedIn: loggedIn, alreadyFollowing: alreadyFollowing });
		} else throw new Error("User doesn't exist");
	} catch (error) {
		res.status(404);
		res.render('404', { error: error });
	}
});

// Follow a user
router.put('/follow/:username', checkAuthenticated, async (req, res) => {
	if (req.user.username != req.params.username) {
		const loggedInUser = req.user;
		try {
			const userToFollow = await User.findOne({ username: req.params.username });
			loggedInUser.following.push(userToFollow);
			await loggedInUser.save();
			res.status(200);
		} catch (error) {
			res.status(500);
		}
	} else {
		res.status(400);
	}
	res.redirect(`/users/${req.params.username}`);
});

// Unfollow a user
router.put('/unfollow/:username', checkAuthenticated, async (req, res) => {
	const user = req.user;
	user.following = user.following.filter((user) => user.username != req.params.username);
	await user.save();
	res.redirect(`/users/${req.params.username}`);
});

// Creating a new user
router.post('/signup', async (req, res) => {
	let user = new User({
		username: req.body.username,
		password: req.body.password,
	});
	if (user.username === 'Admin') user.role = 'admin';
	try {
		const passwordInput = req.body.password;
		const confirmPasswordInput = req.body.confirmPassword;

		if (!comparePasswordInputs(passwordInput, confirmPasswordInput)) throw new Error('Passwords do not match');
		const isUsernameUnique = await validateUsername(req.body.username);
		if (!isUsernameUnique) throw new Error('Username is already taken');

		const hashedPassword = await bcrypt.hash(passwordInput, 10);

		user.password = hashedPassword;
		await user.save();
		res.status(201);
		res.render('users/login', { user: user, error: null, message: 'Success! Please log in to continue' });
	} catch (error) {
		res.status(400);
		res.render('users/signup', { user: user, error: error });
	}
});

function comparePasswordInputs(firstInput, secondInput) {
	return firstInput === secondInput;
}

async function validateUsername(newUsername) {
	const existingUser = await User.findOne({ username: newUsername });
	return existingUser ? false : true;
}

module.exports = router;
