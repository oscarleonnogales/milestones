const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.get('/', async (req, res) => {
	const users = await User.find();
	res.render('users');
});

// Creating a new user
router.post('/signup', async (req, res) => {
	let user = new User({
		username: req.body.username,
		password: req.body.password,
	});
	try {
		const passwordInput = req.body.password;
		const confirmPasswordInput = req.body.confirmPassword;
		console.log(req.body.username, passwordInput, confirmPasswordInput);

		if (!comparePasswordInputs(passwordInput, confirmPasswordInput)) throw new Error('Passwords do not match');
		const isUsernameUnique = await validateUsername(req.body.username);
		if (!isUsernameUnique) throw new Error('Username is already taken');

		const hashedPassword = await bcrypt.hash(passwordInput, 10);

		// Username is unique, and passwords match. So go ahead and save a new user
		user.password = hashedPassword;
		console.log(user);
		await user.save();
		res.redirect('/');
	} catch (error) {
		console.error(error);
		res.render('users/signup', { user: user, error: error });
	}
});

router.post('/login', async (req, res) => {
	const user = await User.findOne({ username: req.body.username });
	if (user) {
		try {
			if (await bcrypt.compare(req.body.password, user.password)) {
				res.send(`${user.username} is now logged in`);
			} else res.send('Incorrect password');
		} catch (error) {
			res.redirect('/');
		}
	} else {
		return res.status(400).send('Cannot find user');
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
