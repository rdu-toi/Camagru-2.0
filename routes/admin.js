const express = require('express');
const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/webcam', isAuth, express.static(__dirname + '/public'), adminController.getWebcam);

module.exports = router;