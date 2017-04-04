const passport = require('passport');
const user = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const User = require('../models/user');

// Create local strategy
const localOptions = {usernameField: 'email'};
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    // Verify username and password, call "done" with the user if they are correct
    User.findOne({email: email}, (err, user) => {
        if (err) return done(err);
        if (!user) done(null, false); // No user, => false = not found

        console.log(User.comparePassword);

        user.comparePassword(password, (err, isMatch) => {
            if (err) return done(err);
            if (!isMatch) return done(null, false);

            return done(null, user);
        })

    })
});

// Setup options for JWT Strategy
const jwtOptions = {
    // Whenever a request comes in, specifies where to look to find the token
    // => Look at the header called "Authorization" to find the token
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    // Secret used to decode the token
    secretOrKey: config.secret
};

// Create JWT strategy
// Which will be called everytime someones tried to access a protected route
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    // See if the user ID in the payload exists (payload = jwt token) in our database
    user.findById(payload.sub, (err, user) => {

        if (err) return done(err, false);

        if (user) return done(null, user);

        if (!user) return done(null, false);
    });
});


// Tell passport to use this strategies
passport.use(jwtLogin);
passport.use(localLogin);