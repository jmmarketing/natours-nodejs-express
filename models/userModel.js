const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'You must confirm your password'],
      validate: {
        //This only works on CREATE and SAVE!
        validator: function (val) {
          return val === this.password;
        },
        message: 'Passwords much match. ',
      },
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true }, id: false },
);

userSchema.pre('save', async function (next) {
  // Flag to for only running when password is modified.
  if (!this.isModified('password')) return next();

  //bcrypt hash is asynchornous so need async/await
  this.password = await bcrypt.hash(this.password, 12);

  // Only needed to confirm the password entered, then we can remove it before saving. Not required to be persistned to the database
  this.passwordConfirm = undefined;

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
