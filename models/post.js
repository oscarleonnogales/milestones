const mongoose = require('mongoose');
const slugify = require('slugify');
const marked = require('marked');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const domPurify = createDomPurify(new JSDOM().window);
import User from './user';
import Comment from './comment';

const postSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'User',
	},
	likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	commentsCount: {
		type: Number,
		default: 0,
	},
	description: {
		type: String,
	},
	markdown: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	slug: {
		type: String,
		required: true,
		unique: true,
	},
	sanitizedHTML: {
		type: String,
		required: true,
	},
});

postSchema.pre('validate', function (next) {
	if (this.title) {
		this.slug = slugify(this.title, {
			lower: true,
			strict: true,
		});
	}

	if (this.markdown) {
		this.sanitizedHTML = domPurify.sanitize(marked(this.markdown));
	}
	next();
});

postSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
	const user = await User.findById(this.author);
	user.posts = user.posts.filter((post) => post != this.id);
	await user.save();
	await Comment.deleteMany({ post: this });
	next();
});

module.exports = mongoose.model('Post', postSchema);
