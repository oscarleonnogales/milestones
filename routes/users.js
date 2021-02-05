const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.get('/', (req, res) => {
	res.send('users page');
});

router.get('/signup', (req, res) => {
	console.log('users page');
	res.render('users/signup');
});

router.post('/', async (req, res) => {
	try {
		const username = req.body.username;
		const passwordInput = req.body.password;
		const passwordConfirmInput = req.body.confirmPassword;

		const isUsernameUnique = await validateUsername(username);
		if (!isUsernameUnique) throw new Error('Username is taken');
		if (!confirmPassword(passwordInput, passwordConfirmInput)) throw new Error('Passowrds do not match');

		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
	} catch (error) {
		console.error(error);
		res.redirect('/users');
	}
});

function confirmPassword(firstInput, secondInput) {
	return firstInput === secondInput;
}

async function validateUsername(newUsername) {
	const existingUser = await User.findOne({ username: newUsername });
	return existingUser != null;
}

module.exports = router;
