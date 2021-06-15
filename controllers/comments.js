const Post = require('../models/post');
const Comment = require('../models/comment');

import { authUser } from '../middleware.js';

export async function createNewComment(req, res) {
	const post = await Post.findById(req.params.id);
	try {
		const newComment = new Comment({
			author: req.user,
			text: req.body.commentText,
			post: post,
		});
		await newComment.save();
		post.commentsCount++;
		await post.save();
		res.status(201);
	} catch (error) {
		res.status(500);
	}
	res.redirect(`/posts/${post.slug}`);
}

export async function deleteComment(req, res) {
	const comment = await Comment.findById(req.params.id);
	if (authUser(req.user, comment)) {
		try {
			await comment.deleteOne({ id: comment.id });
			const post = await Post.findById(comment.post);
			post.commentsCount--;
			await post.save();
			res.status(204);
			res.redirect(`/posts/${post.slug}`);
		} catch {
			res.status(500);
			res.redirect('/');
		}
	} else {
		res.status(403);
		res.render('invalid-permission');
	}
}
