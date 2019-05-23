const express = require('express');

const guestController = require('../controllers/guest');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', guestController.getIndex);

module.exports = router;