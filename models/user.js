const mongoose = require('mongoose');

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
	posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
});

module.exports = mongoose.model('User', userSchema);
