const express = require('express');
const { body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post(
    '/login',
    [
        body('email', 'Please enter a valid email address.')
            .isEmail()
            .normalizeEmail(),
        body('password', 'Password has be alphanumeric and be between 6 and 12 characters.')
            .isAlphanumeric()
            .trim()
            .isLength({ min: 6, max: 12 })
    ],
    authController.postLogin
);

router.get('/reset', authController.getReset);

router.get('/reset/:token', authController.getNewPassword);

router.get('/confirm/:token', authController.getConfirmAccount);

router.post(
    '/signup',
    [
        body('username', 'Username has to be between 4 and 15 characters.')
            .isLength({ min: 4, max: 15 })
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
    authController.postSignup
);

router.post('/logout', authController.postLogout);

router.post('/reset', authController.postReset);

router.post(
    '/new-password',
    [
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
    authController.postNewPassword
);

module.exports = router;