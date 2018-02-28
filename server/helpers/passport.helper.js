// passport google authentication
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var Lecturer = require('../models/lecturer');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  Lecturer.findOne({
    googleId: profile.id
  }, (err, lecturer) => {
    if (lecturer === null) {
      var newLecturer = new Lecturer({
        googleId: profile.id,
        name: profile.displayName,
        token: accessToken
      });
      newLecturer.save((err, newLecturer) => {
        if (err)
          throw err;
        // start session and redirect to the dashboard
        done(null, newLecturer);
      });
    } else {
      console.log("[WARN] User with id " + profile.id + " already exists, logging in...");
      // start session and redirect to the dashboard
      done(null, lecturer);
    }
  })
}));

module.exports = passport;
