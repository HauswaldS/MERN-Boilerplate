const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    // sub => subject of the token, we create a JSON web token based on the user id
    // iat => issued at time
    return jwt.encode({sub: user.id, iat: timestamp}, config.secret);
}

exports.signup = function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) return res.status(422).send({error: "You must provide a password and an email."});

    // See if the user exists
    User.findOne({email: email}, (err, existingUser) => {
        if (err) return next(err);

        // Sets the nature of the error (422 = unprocessable entity) with an error message
        if (existingUser) return res.status(422).send({error: 'Email is in use'});

        const user = new User({email: email, password: password});

        user.save((err) => {
            if (err) return next(err);

            res.json({token: tokenForUser(user)});
        });
    })

};

exports.signin = (req, res, next) => {
    res.send({token: tokenForUser(req.user)});
};