const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.get('/', async (req, res) => {
	const users = await User.find();
	res.render('users');
});

router.get('/:username', async (req, res) => {
	let user;
	try {
		user = await User.findOne({ username: req.params.username }).populate('posts');
		if (user) {
			res.status(200);
			res.render('users/profile', { user: user });
		} else throw new Error("User doesn't exist");
	} catch (error) {
		res.status(404);
		res.render('404', { error: error });
	}
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
