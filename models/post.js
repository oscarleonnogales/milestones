const mongoose = require('mongoose');
const slugify = require('slugify');
const marked = require('marked');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const domPurify = createDomPurify(new JSDOM().window);

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

module.exports = mongoose.model('Post', postSchema);
