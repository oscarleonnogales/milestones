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
});

module.exports = mongoose.model('User', userSchema);
