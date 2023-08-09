if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const path = require('path');
const mongoConnect = require('./mongo');
const User = require('./models/userSchema');

mongoConnect.connect()
const initializePassport = require('./passport-config')
initializePassport(passport)

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 10,
  },
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}))
app.use(cookieParser());
app.use(passport.initialize())
app.use(passport.session())

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name })
})

app.post('/logout', checkAuthenticated, (req, res, next) => {
  console.log("logout")
  req.logOut((err) => {
    if (err) next(err);

    req.session.destroy((err) => {
      if (err) next(err);
      res.redirect('/login');
    })
  })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    const newUser = new User({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save();

    res.redirect('/login')
  } catch (err){
    console.log(err)
    res.redirect('/register')
  }
})


function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.listen(3000)