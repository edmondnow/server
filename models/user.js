const bcrypt = require('bcrypt-nodejs') 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});


//on Save Hook, encrypt password
// Before saving a model, run this pre-hook 
userSchema.pre('save', function(next){
  //get access to the user model
  const user = this; //user.email //user.password

  // generate a salt
  bcrypt.genSalt(10, function(err, salt){
    if (err) { return next(err) }
    //hash, or encrypt our password with the salt
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err) }
      
      //overwrite plain text password with encrypted password

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePasswords = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) { 
    if (err) { return callback(err); }
    callback(null, isMatch);

    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user)

    })
  })
}
 
//Create the model class
const ModelClass = mongoose.model('user', userSchema);

//Export the model
module.exports = ModelClass;
