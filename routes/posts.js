const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// Middleware
import { checkAuthenticated } from '../basicAuth';

// Routes
router.get('/new', checkAuthenticated, (req, res) => {
	res.status(200);
	res.render('posts/new', { post: new Post(), user: req.user });
});

router.get('/edit/:id', async (req, res) => {
	const post = await Post.findById(req.params.id);
	res.status(200);
	res.render('posts/edit', { post: post });
});

router.get('/:slug', async (req, res) => {
	const post = await Post.findOne({ slug: req.params.slug });
	if (post == null) {
		res.status(404);
		res.render('404', { error: null });
	} else {
		res.status(200);
		res.render('posts/show', { post: post });
	}
});

router.post('/', checkAuthenticated, async (req, res) => {
	const user = req.user;
	let post = new Post({
		title: req.body.title,
		description: req.body.description,
		markdown: req.body.markdown,
		author: user,
	});

	try {
		post = await post.save();
		user.posts.push(post);
		await user.save();
		res.status(201);
		res.redirect(`/posts/${post.slug}`);
	} catch {
		res.status(500);
		res.render('posts/new', { post: post });
	}
});

router.put('/:id', async (req, res) => {
	let post = await Post.findById(req.params.id);
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
});

router.delete('/:id', async (req, res) => {
	await Post.findByIdAndDelete(req.params.id);
	res.status(204);
	res.redirect('/');
});

module.exports = router;
