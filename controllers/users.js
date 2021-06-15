const User = require('../models/user');
const Post = require('../models/post');
const bcrypt = require('bcrypt');

export async function getAllUsers(req, res) {
	let searchOptions = {};
	if (req.query.username != null && req.query.username !== '') {
		searchOptions.username = new RegExp(req.query.username, 'i');
	}
	try {
		const users = await User.find(searchOptions).limit(25).exec();
		res.render('users/index', { users: users, searchOptions: req.query, currentClient: req.user });
	} catch {
		res.redirect('/');
	}
}

export async function showUserProfile(req, res) {
	let user;
	let currentClient;
	try {
		user = await User.findOne({ username: req.params.username });
		if (user) {
			const postsByUser = await Post.find({ author: user });
			let alreadyFollowing = false;
			if (req.user) {
				req.user.following.forEach((user) => {
					if (user.username === req.params.username) alreadyFollowing = true;
				});
				currentClient = req.user;
			}
			res.status(200);
			res.render('users/profile', {
				user: user,
				posts: postsByUser,
				currentClient: currentClient,
				alreadyFollowing: alreadyFollowing,
			});
		} else throw new Error("User doesn't exist");
	} catch (error) {
		console.log(error);
		res.status(404);
		res.render('404', { error: error });
	}
}

export async function followUser(req, res) {
	if (req.user.username != req.params.username) {
		const currentClient = req.user;
		try {
			const user = await User.findOne({ username: req.params.username });
			currentClient.following.push(user);
			await currentClient.save();
			res.status(200);
		} catch (error) {
			res.status(500);
		}
	} else {
		res.status(400);
	}
	res.redirect(`/users/${req.params.username}`);
}

export async function unfollowUser(req, res) {
	const currentClient = req.user;
	currentClient.following = currentClient.following.filter((user) => user.username != req.params.username);
	await currentClient.save();
	res.redirect(`/users/${req.params.username}`);
}

export async function createNewUser(req, res) {
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
		res.render('users/login', { error: null, message: 'Success! Please log in to continue' });
	} catch (error) {
		res.status(400);
		res.render('users/signup', { error: error });
	}
}

// Helper Functions
function comparePasswordInputs(firstInput, secondInput) {
	return firstInput === secondInput;
}

async function validateUsername(newUsername) {
	const existingUser = await User.findOne({ username: newUsername });
	return existingUser ? false : true;
}
