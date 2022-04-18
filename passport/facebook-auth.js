/* const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User.model");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  "sign-in-facebook",
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: `${process.env.FACEBOOK_SECRET}`,
      callbackURL: "http://localhost:4000/auth/facebook/callback",
      profileFields: ["email", "name", "photos","profileUrl"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await User.findById(profile.id);
      if (user) {
        return done(null,false);
      } else {        
        const { email, first_name, last_name } = profile._json;
        const user = await new User();
        (user.email = email),
          (user.firstName = first_name),
          (user.lastName = last_name);
        user._id = profile.id;
        user.image = profile.photos[0].value
        await user.save();
        done(null, profile);
      }
    }
  )
);

// log in with facebook
passport.use(
  "sign-up-facebook",
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: `${process.env.FACEBOOK_SECRET}`,
      callbackURL: "http://localhost:3000/auth/facebook/signin",
      profileFields: ["email", "name", "photos"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await User.findById(profile.id);
      if (user) {
        done(null, user);
      } else {
        return done(null, false);
      }
    }
  )
); */