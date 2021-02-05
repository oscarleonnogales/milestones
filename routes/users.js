const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.get('/', async (req, res) => {
	const users = await User.find();
	res.render('users');
});

// Creating a new user
router.post('/', async (req, res) => {
	try {
		const username = req.body.username;
		const passwordInput = req.body.password;
		const passwordConfirmInput = req.body.confirmPassword;
		console.log(username, passwordInput, passwordConfirmInput);

		// const isUsernameUnique = await validateUsername(username);
		// if (!isUsernameUnique) throw new Error('Username is taken');
		// if (!confirmPassword(passwordInput, passwordConfirmInput)) throw new Error('Passowrds do not match');

		//Do this after confirming that the passwords match. Otherwise we're awaiting for no reason
		const hashedPassword = await bcrypt.hash(req.body.password, 10);

		const user = new User({
			username: username,
			password: hashedPassword,
		});
		console.log(user);

		await user.save();
		res.redirect('/');
	} catch (error) {
		console.error(error);
		// res.redirect('/users');
	}
});

router.post('/login', async (req, res) => {
	res.redirect('/');
});

function confirmPassword(firstInput, secondInput) {
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
