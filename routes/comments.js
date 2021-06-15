const express = require('express');
const router = express.Router();

import { checkAuthenticated } from '../middleware.js';
import { createNewComment, deleteComment } from '../controllers/comments.js';

router.post('/:id', checkAuthenticated, createNewComment);

router.delete('/:id', checkAuthenticated, deleteComment);

module.exports = router;
