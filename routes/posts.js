const express = require('express');
const router = express.Router();
const Post = require('../models/post');

import { checkAuthenticated } from '../middleware.js';
import { getPost, createNewPost, editPostPage, deletePost, updatePost, toggleLike } from '../controllers/posts.js';

router.get('/new', checkAuthenticated, (req, res) => {
	res.status(200);
	res.render('posts/new', { post: new Post(), currentClient: req.user });
});

router.get('/edit/:id', checkAuthenticated, editPostPage);

router.get('/:slug', getPost);

router.post('/', checkAuthenticated, createNewPost);

router.put('/:id', checkAuthenticated, updatePost);

router.put('/like/:id', checkAuthenticated, toggleLike);

router.delete('/:id', checkAuthenticated, deletePost);

module.exports = router;
