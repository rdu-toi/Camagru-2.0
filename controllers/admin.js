const Image = require('../models/image');
const User = require('../models/user');

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
          user.save();
          res.user = user;
          req.session.user = user;
          return req.session.save(err => {
            console.log(err);
            res.redirect('/');
          });
      })
      .catch(err => {
        console.log(err);
      });
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      console.log(err);
    });
};