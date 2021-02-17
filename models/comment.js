const mongoose = require('mongoose');
const Post = require('./post');

const commentSchema = new mongoose.Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	post: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'Post',
	},
	createdAt: {
		type: Date,
		default: Date.now,
		required: true,
	},
	text: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('Comment', commentSchema);
