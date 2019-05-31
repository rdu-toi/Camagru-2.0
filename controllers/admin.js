const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator/check");

const Image = require('../models/image');
const User = require('../models/user');
const Comment = require('../models/comment');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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"
    }
  })
);

let photos;

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
  let currentPage = 1;

  if (req.params.page) {
      currentPage = Number(req.params.page);
      if (photos) {
          return res.render('admin/my-gallery', {
              images: photos.reverse(),
              pageTitle: 'My Gallery',
              path: 'admin/my-gallery',
              currentPage: currentPage
          });
      }
  }

  Image.find({ userId: req.user._id })
    .then(images => {
      photos = images.reverse();
      res.render('admin/my-gallery', {
        images: images.reverse(),
        pageTitle: 'My Gallery',
        path: '/admin/my-gallery',
        currentPage: currentPage
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
          if (req.body.emailForComments) {
            user.emailForComments = true;
          } else user.emailForComments = false;
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
  let thisUser = false;
  Image.findById(imageId)
    .then(image => {
      Comment.find({ imageId })
        .populate('userId')
        .exec()
        .then(comments => {
          if (image.userId._id === req.user._id) {
            thisUser = true;
          }
          res.render('admin/comments', {
            image: image,
            pageTitle: 'Comment',
            path: '/comments',
            comments: comments,
            errorMessage: message,
            thisUser: thisUser
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
  const userId = req.body.userId;

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
    User.findById(userId)
    .then(user => {
      console.log('Made it this far!');
      if (user.emailForComments) {
        console.log('Sending an email for comment to this address: ' + 'user.email');
        return transporter.sendMail({
          to: user.email,
          from: 'we@camagru-2.0.com',
          subject: 'You got a comment!',
          html: `
            <h1>Someone commented on one of your images:</h1>
            <p>"${comment}"</p>
          `
        });
      }
    })
  })
};

exports.postLike = (req, res, next) => {
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

  Image.findById(imageId)
  .then(image => {
    const likes = image.likes;
    image.likes = likes + 1;
    image.save(err => {
      console.log(err);
      res.redirect('/gallery');
    });
  })
  .catch(err => {
    cconsole.log(err);
  });
}