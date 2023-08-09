const LocalStrategy = require("passport-local").Strategy
const bcrypt = require('bcrypt')
const User = require('./models/userSchema');

function initialize(passport){
  // this function verify the user password
  const authenticateUser = async (email, password, done) =>{
    const user = await User.findOne({ email: email })
      .then((user) => {
        console.log("user = ", user)
        if (user){
          console.log("get user")
          return user;
        }else{
          console.log("fail to get user by email")
          return null;
        }
      })

    if (user == null){
      return done(null, false, {message: "something wrong with email or password"})
    }

    try{
      console.log(password, user.password)
      if (await bcrypt.compare(password, user.password)){
        return done(null, user)
      }else{
        return done(null, false, {message: "something wrong with email or password"})
      }
    }catch (e) {
      return done(e)
    }
  }
  passport.use(new LocalStrategy({ usernameField: 'email' },
    async function authenticateUser(email, password, done) {
      const user = await User.findOne({ email: email })
      .then((user) => {
        console.log("user = ", user)
        if (user){
          console.log("get user")
          return user;
        }else{
          console.log("fail to get user by email")
          return null;
        }
      })

      if (user == null){
        return done(null, false, {message: "something wrong with email or password"})
      }

      try{
        console.log(password, user.password)
        if (await bcrypt.compare(password, user.password)){
          return done(null, user)
        }else{
          return done(null, false, {message: "something wrong with email or password"})
        }
      }catch (e) {
        return done(e)
      }
      }
    )
  )
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser(async (id, done) => {
    done(null, await User.findOne({ id: id })
      .then((user) => {
        if (user){
          console.log("get user = ", user)
          return user;
        }else{
          console.log("fail to get user in deserializer")
          return null;
        }
      })
    )
  })
}

module.exports = initialize