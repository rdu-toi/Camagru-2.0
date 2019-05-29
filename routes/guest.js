const express = require('express');

const guestController = require('../controllers/guest');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', guestController.getIndex);

router.get('/gallery', guestController.getGallery);

router.get('/gallery/:page', guestController.getGallery);

module.exports = router;