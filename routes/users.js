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

		user.password = hashedPassword;
		console.log(user);
		await user.save();
		res.render('users/login', { user: user, error: null, message: 'Success! Please log in to continue' });
	} catch (error) {
		console.error(error);
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
