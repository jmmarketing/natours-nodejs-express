const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Users must have a name'],
      trim: true,
      minLength: [4, 'A user name must be more than or equal to 4 characters'],
      maxLength: [
        40,
        'A user name must be less than or equal to 40 characters',
      ],
    },
    email: {
      type: String,
      require: [true, 'A user must have an email'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please use a valid email'],
    },
    photo: String,
    password: {
      type: String,
      required: [true, 'A passwored is required'],
      minLength: [8, 'Password must be a minimum of 8 characters'],
    },
    passwordConfirmm: {
      type: String,
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: 'Passwords much match. ',
      },
      required: [true, 'You must confirm your password'],
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
