const express = require('express');
const { body } = require('express-validator/check');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/webcam', isAuth, adminController.getWebcam);

router.get('/my-gallery', isAuth, adminController.getMyGallery);

router.get('/my-account', isAuth, adminController.getMyAccount);

router.post('/webcam', isAuth, adminController.postWebcam);

router.post('/my-account', isAuth,
    [
        body('username', 'Username has to be between 3 and 15 characters.')
            .isLength({ min: 3, max: 15 })
            .custom((value, { req }) => {
                return User.findOne({ username: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject(
                            'Username alredy exists, please pick a different one.'
                        );
                    }
                });
            }),
        body('email', 'Please enter a valid email.')
            .isEmail()
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(userDoc => {
                    if (userDoc) {
                        return Promise.reject(
                            'E-Mail already exists, please pick a different one.'
                        );
                    }
                });
            })
            .normalizeEmail(),
        body('password', 'Password has to be alphanumeric and between 6 and 12 characters.')
            .trim()
            .isLength({ min: 6, max: 12 })
            .isAlphanumeric(),
        body('confirmPassword')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords have to match!');
                }
                return true;
            })
    ],
    adminController.postMyAccount
    );

module.exports = router;