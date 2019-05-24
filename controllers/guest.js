const Image = require('../models/image');

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
    Image.find()
        .populate('userId')
        .exec()
        .then(images => {
            res.render('guest/gallery', {
                images: images,
                pageTitle: 'Gallery',
                path: '/gallery'
            });
        })
        .catch(err => {
            console.log(err);
        });
};