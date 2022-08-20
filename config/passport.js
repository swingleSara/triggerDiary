const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User");
const dotenv = require("dotenv");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          367186950295 -
          li7okjcl0t3018vuvnsf43rrts95td0d.apps.googleusercontent.com,
        clientSecret: GOCSPX - MV_kfy1p7gynC_fyyWSEKgBR8OL9,
        callbackURL: "https://trigger-diary.herokuapp.com/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        };

        try {
          let user = await User.findOne({ googleId: profile.id });
          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
