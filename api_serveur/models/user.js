const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define the model
const userSchema = new Schema({
    email: {type: String, unique: true, lowercase: true},
    password: String
});

// Adds methods to the UserSchema that is accessible anywhere else
userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return callback(err);

        callback(null, isMatch);
    })
};


// On Save Hook, encrypt password
// Runs before the User gets saved
userSchema.pre('save', function (next) {
    const user = this;

    // Generate the salt
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        // hash (encrypt) the password using the salt
        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) return next(err);

            //Overwrite plain text pswd with the encrypted pswd
            user.password = hash;
            next();
        });
    });
});

// Create the model class to represent all Users
const modelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = modelClass;