const User = require('../models/user');
const bcrypt = require('bcrypt');

export async function changeLocation(req, res) {
	const user = await User.findById(req.params.id);
	if (user.id === req.user.id) {
		try {
			user.location = req.body.location;
			await user.save();
			res.status(200);
			res.render('users/settings', { currentClient: user, message: 'Saved New Location' });
		} catch (error) {
			res.status(500);
			res.render('users/settings', { currentClient: user, message: 'Saved New Location', error: error });
		}
	} else {
		res.status(403);
		res.redirect(`/users/${user.username}`);
	}
}

export async function changePassword(req, res) {
	const user = await User.findById(req.params.id);
	if (user.id === req.user.id) {
		try {
			if (await bcrypt.compare(req.body.oldPassword, user.password)) {
				const passwordInput = req.body.password;
				const confirmPasswordInput = req.body.confirmPassword;

				if (!comparePasswordInputs(passwordInput, confirmPasswordInput)) throw new Error('New Passwords do not match');
				const hashedPassword = await bcrypt.hash(passwordInput, 10);
				user.password = hashedPassword;
				await user.save();
				res.status(200);
				res.render('users/settings', { currentClient: user, message: 'Saved New Password', error: null });
			} else throw new Error('Old Password Was Entered Incorrectly');
		} catch (error) {
			res.status(500);
			res.render('users/settings', { currentClient: user, message: null, error: error });
		}
	} else {
		res.status(403);
		res.redirect(`/users/${user.username}`);
	}
}

// Helper Functions
function comparePasswordInputs(firstInput, secondInput) {
	return firstInput === secondInput;
}
