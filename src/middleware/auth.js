const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const dbContext = require("../dbInit/dbcontext");

const User = dbContext.User

passport.use(
  new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
  }, async (req, email, password, done) => {
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: "User not found" });
      }
      let checkPassword = await(user.comparePassword(password));
      if (!checkPassword) {
        return done(null, false, { message: "Wrong password" });
      }
      return done(null, user);
    } catch (error) {
      console.log(error);
      return done(null, false);
    }
  })
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(
  new JwtStrategy(
    {
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async (payload, next) => {
      try {
        let user = await User.findById(payload.subject)
        if (user) {
          return next(null, user);
        }
        return next(null, false);
      } catch (error) {
        console.log(error);
        return next(error, false);
      }
    },
  ),
);

const auth = {
  isAuthenticated,
};

function isAuthenticated(req, res, next) {
  if(req.user) {
      return next();
  }
  res.redirect('/login');
}

module.exports = auth;