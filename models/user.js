const mongoose = require('mongoose');

const ROLES = {
	ADMIN: 'admin',
	BASIC: 'basic',
};

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		unique: true,
		required: true,
	},
	joinedAt: {
		type: Date,
		default: Date.now,
		required: true,
	},
	location: {
		type: String,
		default: 'Milky Way Galaxy',
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		required: true,
		default: ROLES.BASIC,
	},
	posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
	following: [this],
});

module.exports = mongoose.model('User', userSchema);
