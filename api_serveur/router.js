const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// Session is set to false to avoid creating a cookie
const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false});


module.exports = function (app) {
    app.post('/signin', requireSignin, Authentication.signin);
    app.post('/signup', Authentication.signup);
};