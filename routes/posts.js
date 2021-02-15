const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');

// Middleware
import { checkAuthenticated, authUser, renderEditDeleteButtons } from '../basicAuth';

// Routes
router.get('/new', checkAuthenticated, (req, res) => {
	res.status(200);
	res.render('posts/new', { post: new Post(), currentClient: req.user });
});

router.get('/edit/:id', checkAuthenticated, async (req, res) => {
	const post = await Post.findById(req.params.id);
	if (authUser(req.user, post)) {
		res.status(200);
		res.render('posts/edit', { post: post });
	} else {
		res.status(403);
		res.render('invalid-permission');
	}
});

// Specific post page
router.get('/:slug', async (req, res) => {
	const post = await Post.findOne({ slug: req.params.slug }).populate('author');
	let comments;
	if (post == null) {
		res.status(404);
		const error = new Error('Cannot find that post');
		res.render('404', { error: error });
	} else {
		comments = await Comment.find({ post: post }).populate('author');
		let renderButtons = renderEditDeleteButtons(req.user, post);
		res.status(200);
		// const currentClient = req.user || new User();
		res.render('posts/show', {
			post: post,
			comments: comments,
			renderButtons: renderButtons,
			currentClient: req.user,
		});
	}
});

// Create a new post
router.post('/', checkAuthenticated, async (req, res) => {
	const currentClient = req.user;
	let post = new Post({
		title: req.body.title,
		description: req.body.description,
		markdown: req.body.markdown,
		author: currentClient,
	});

	try {
		post = await post.save();
		currentClient.posts.push(post);
		await currentClient.save();
		res.status(201);
		res.redirect(`/posts/${post.slug}`);
	} catch {
		res.status(500);
		res.render('posts/new', { post: post });
	}
});

// Comment on a post
router.post('/comments/:id', checkAuthenticated, async (req, res) => {
	const post = await Post.findById(req.params.id);
	try {
		const newComment = new Comment({
			author: req.user,
			text: req.body.commentText,
			post: post,
		});
		await newComment.save();
		res.status(201);
	} catch (error) {
		res.status(500);
	}
	res.redirect(`/posts/${post.slug}`);
});

// Delete a comment
router.delete('/comments/:id', checkAuthenticated, async (req, res) => {
	const comment = await Comment.findById(req.params.id);
	if (authUser(req.user, comment)) {
		await comment.deleteOne({ id: comment.id });
		res.status(204);
		res.redirect('/');
	} else {
		res.status(403);
		res.render('invalid-permission');
	}
});

// Update a post
router.put('/:id', checkAuthenticated, async (req, res) => {
	let post = await Post.findById(req.params.id);
	if (authUser(req.user, post)) {
		post.title = req.body.title;
		post.description = req.body.description;
		post.markdown = req.body.markdown;
		try {
			post = await post.save();
			res.status(204);
			res.redirect(`/posts/${post.slug}`);
		} catch (error) {
			res.status(500);
			res.render('posts/edit', { post: post });
		}
	} else {
		res.status(403);
		res.render('invalid-permission');
	}
});

// Like/Dislike a post
router.put('/like/:id', checkAuthenticated, async (req, res) => {
	let post = await Post.findById(req.params.id);
	if (post.likes.includes(req.user.id)) {
		post.likes = post.likes.filter((user) => user != req.user.id);
	} else {
		post.likes.push(req.user);
	}
	try {
		post = await post.save();
		res.status(204);
		res.redirect(`/posts/${post.slug}`);
	} catch (error) {
		res.status(500);
		res.render('posts/edit', { post: post });
	}
});

// Delete a post
router.delete('/:id', checkAuthenticated, async (req, res) => {
	const post = await Post.findById(req.params.id);
	if (authUser(req.user, post)) {
		await post.deleteOne({ id: post.id });
		res.status(204);
		res.redirect('/');
	} else {
		res.status(403);
		res.render('invalid-permission');
	}
});

module.exports = router;
