const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator/check");

const Image = require('../models/image');
const User = require('../models/user');
const Comment = require('../models/comment');

exports.getWebcam = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('admin/webcam', {
    path: '/admin/webcam',
    pageTitle: 'Take a Pic',
    errorMessage: message
  })
};

exports.postWebcam = (req, res, next) => {
  if (req.body.imgsrc) {
    const img = req.body.imgsrc;
    const userId = req.user;

    const image = new Image({
      userId: userId,
      image: img
    });
    image.save()
      .then(result => {
        res.redirect('/admin/webcam');
      })
      .catch(err => {
        console.log(err);
      });
  }
  else {
    res.redirect('/admin/webcam');
  }
};

exports.getMyGallery = (req, res, next) => {
  Image.find({ userId: req.user._id })
    .then(images => {
      res.render('admin/my-gallery', {
        images: images,
        pageTitle: 'My Gallery',
        path: '/admin/my-gallery'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getMyAccount = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  const username = req.user.username;
  const email = req.user.email;

  res.render('admin/my-account', {
    path: '/admin/my-account',
    pageTitle: 'My Account',
    errorMessage: message,
    oldInput: {
      username: username,
      email: email,
      password: '',
      confirmPassword: ''
    },
    validationErrors: []
  })
};

exports.postMyAccount = (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/my-account', {
      path: '/admin/my-account',
      pageTitle: 'My Account',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        username: username,
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors: errors.array()
    });
  }

  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      User.findById(req.user._id)
        .then(user => {
          user.username = username;
          user.email = email;
          user.password = hashedPassword;
          return user.save(err => {
            console.log(err);
            req.session.user = user;
            req.session.isLoggedIn = true;
            req.session.save(err => {
              req.user = req.session.user;
              console.log(err);
            });
          });
        })
        .then(result => {
          res.redirect('/');
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postDeleteImage = (req, res, next) => {
  const imageId = req.body.imageId;
  Image.deleteOne({ _id: imageId, userId: req.user._id })
    .then(() => {
      console.log('Image Deleted!');
      res.redirect('/admin/my-gallery');
    })
    .catch(err => console.log(err));
};

exports.getImageComments = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  const imageId = req.params.imageId;
  Image.findById(imageId)
    .then(image => {
      Comment.find({ imageId })
        .populate('userId')
        .exec()
        .then(comments => {
          res.render('admin/comments', {
            image: image,
            pageTitle: 'Comment',
            path: '/comments',
            comments: comments,
            errorMessage: message
          });
        })
        .catch(err => {
          console.log(err);
        })
    })
    .catch(err => {
      console.log(err);
    });
};

exports.postImageComments = (req, res, next) => {
  const comment = req.body.comment;
  const imageId = req.body.imageId;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('gallery', {
      path: '/gallery',
      pageTitle: 'Gallery',
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const newComment = new Comment({
    userId: req.user._id,
    imageId: imageId,
    comment: comment
  });
  newComment.save(err => {
    console.log(err);
    res.redirect('/gallery');
  })
};