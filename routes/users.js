const express = require('express');
const router = express.Router();

import { checkAuthenticated, checkNotAuthenticated } from '../middleware.js';
import { getAllUsers, showUserProfile, followUser, unfollowUser, createNewUser } from '../controllers/users.js';

router.get('/', getAllUsers);

router.get('/:username', showUserProfile);

router.put('/follow/:username', checkAuthenticated, followUser);

router.put('/unfollow/:username', checkAuthenticated, unfollowUser);

router.post('/signup', checkNotAuthenticated, createNewUser);

module.exports = router;
