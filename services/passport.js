const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;

//create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
  //verify this username and password, call done with user
  //if it is correct username and password
  // otherwise call done with false
  User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }
  });
});

//Setup option for JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT strategy
//payload is the token (user id and timestamp, done is when we are done)
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  //See if the user id and the payload exists in our database
  //If it does, call 'done' with that other
  // otherwise, call done withoiut a user object
  User.findById(payload.sub , function(err, user){
    if (err) { return done(err, false); }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
  
});

//Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
