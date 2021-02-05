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

		// const isUsernameUnique = await validateUsername(req.body.username);
		// if (!isUsernameUnique) throw new Error('Username is already taken');
		if (!comparePasswordInputs(passwordInput, confirmPasswordInput)) throw new Error('Passwords do not match');

		//Do this after confirming that the passwords match. Otherwise we're awaiting for no reason
		const hashedPassword = await bcrypt.hash(passwordInput, 10);

		// Username is unique, and passwords match. So go ahead and save a new user
		user.password = hashedPassword;
		console.log(user); //remove for production
		await user.save();
		res.redirect('/'); // pass in the logged in user
	} catch (error) {
		console.error(error);
		res.render('users/signup', { user: user, error: error });
	}
});

router.post('/login', async (req, res) => {
	res.redirect('/');
});

function comparePasswordInputs(firstInput, secondInput) {
	return firstInput === secondInput;
}

async function validateUsername(newUsername) {
	const existingUser = await User.findOne({ username: newUsername });
	if (existingUser != null) {
		// means there is already an existing username with that username
		// do not validate. return false
		console.log('already an existing user');
		return false;
	}
	return existingUser != null;
}

module.exports = router;
