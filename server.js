if (process.env.NODE_ENV !== 'production'){
  // setting our mode into developement mode
  require('dotenv').config()
}

const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require("express-flash")
const session = require("express-session")
const app = express()

// passport could help us to persist our user information to stay login
const initializePassport = require("./passport-config")
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended: false}))
app.use(flash())
// secret : key that encrypt all of the infomation
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// should access our database here
// the user list is just for easy implementation
let users = []

app.get('/', (req, res) => {
  res.render("index.ejs", {name :'Meison'})
})

app.get('/login', (req, res) => {
  res.render("login.ejs")
})
// failureFlash help us to show the error message
app.post('/login', passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', (req, res) => {
  res.render("register.ejs")
})
app.post('/register', async (req, res) => {
  try{
    const hashedPW = await bcrypt.hash(req.body.password, 10)

    users.push({
      id: Date.now().toString(),
      name:req.body.name,
      email:req.body.email,
      password: hashedPW
    })
    res.redirect('/login')
  }catch{
    console.log("something wrong here in post request!!")
    res.redirect('/register')
  }
})

app.listen(3000)
