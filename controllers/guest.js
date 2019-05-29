const Image = require('../models/image');
let photos;

exports.getIndex = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    if (req.user) {
        res.render('admin/webcam', {
            path: '/admin/webcam',
            pageTitle: 'Take a Pic',
            errorMessage: message
        });
    } else {
        res.render('guest/index', {
            path: '/',
            pageTitle: 'Camagru'
        });
    }
};

exports.getGallery = (req, res, next) => {
    let currentPage = 1;
    let thisUser;
    if (req.user) {
        thisUser = req.user.username;
    }
    else thisUser = false;
    if (req.params.page) {
        currentPage = Number(req.params.page);
        if (photos) {
            return res.render('guest/gallery', {
                images: photos.reverse(),
                pageTitle: 'Gallery',
                path: '/gallery',
                thisUser: thisUser,
                currentPage: currentPage
            });
        }
    }

    Image.find()
        .populate('userId')
        .exec()
        .then(images => {
            photos = images.reverse();
            res.render('guest/gallery', {
                images: images.reverse(),
                pageTitle: 'Gallery',
                path: '/gallery',
                thisUser: thisUser,
                currentPage: currentPage
            });
        })
        .catch(err => {
            console.log(err);
        });
};