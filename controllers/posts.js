const Post = require('../models/post');
const Comment = require('../models/comment');

import { authUser, renderEditDeleteButtons } from '../middleware.js';

export async function editPostPage(req, res) {
	const post = await Post.findById(req.params.id);
	if (authUser(req.user, post)) {
		res.status(200);
		res.render('posts/edit', { post: post, currentClient: req.user });
	} else {
		res.status(403);
		res.render('invalid-permission');
	}
}

export async function getPost(req, res) {
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
		res.render('posts/show', {
			post: post,
			comments: comments,
			renderButtons: renderButtons,
			currentClient: req.user,
		});
	}
}

export async function createNewPost(req, res) {
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
}

export async function updatePost(req, res) {
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
}

export async function toggleLike(req, res) {
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
}

export async function deletePost(req, res) {
	const post = await Post.findById(req.params.id);
	if (authUser(req.user, post)) {
		await post.deleteOne({ id: post.id });
		res.status(204);
		res.redirect('/');
	} else {
		res.status(403);
		res.render('invalid-permission');
	}
}
