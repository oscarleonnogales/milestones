const express = require('express');
const router = express.Router();

import { checkAuthenticated } from '../middleware.js';
import { changeLocation, changePassword } from '../controllers/settings.js';

router.put('/location/:id', checkAuthenticated, changeLocation);

router.put('/password/:id', checkAuthenticated, changePassword);

module.exports = router;
