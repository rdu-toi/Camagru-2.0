const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoBDStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
// const passport = require('passport');

// require('./config/passport')(passport);

// const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://rdu-toi:5FEh3VraWgXrvf4@camagru-bnooz.mongodb.net/camagru';

const app = express();
const store = new MongoBDStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const guestRoutes = require('./routes/guest');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false, limit: '100mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(guestRoutes);
app.use(authRoutes);

// app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI, {useNewUrlParser: true})
  .then(result => {
    app.listen(3000);
  })
  .then(result => {
    console.log('Server started!');
  })
  .catch(err => {
    console.log(err);
  });