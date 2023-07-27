const LocalStrategy = require("passport-local").Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById){

  // this function verify the user password
  const authenticateUser = async (email, password, done) =>{
    const user = getUserByEmail(email)

    if (user == null){
      return done(null, false, {message: "something wrong with email or password"})
    }

    try{
      if (await bcrypt.compare(password, user.password)){
        return done(null, user)
      }else{
        return done(null, false, {message: "something wrong with email or password"})
      }
    }catch (e) {
      return done(e)
    }
  }
  passport.use(new LocalStrategy({ usernameField: 'email'}, authenticateUser))

  // what does serialize and deserialize do ?
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    done(null, getUserById)
  })
}

module.exports = initialize