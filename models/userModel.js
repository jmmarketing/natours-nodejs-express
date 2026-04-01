const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
//built in node module
const crypto = require('crypto');

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
    role: {
      type: String,
      enum: ['user', ' guide', 'lead-guide', 'admin'],
      default: 'user',
    },

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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  // { toJSON: { virtuals: true }, toObject: { virtuals: true }, id: false },
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

//Instance method - will applied to all documents using the userSchema and ccan be called.
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    //if JWT timestamp is < than the password was changed (b/c the timestamp would be updated when it happened)
    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

//Used from the forgotPassword in authController
userSchema.methods.createPasswordResetToken = function () {
  //Will be sent to user - toString is buffer.toString from node - looks like: 3075627e3cbffefb06a34e4f0fc12d10adc8e79f9ae62113ac9ad17fe5333926
  const resetToken = crypto.randomBytes(32).toString('hex');

  //Takes token and creates encrypted has to look like this: 8baf3a7701563f543b9177bc979b6aea14180c32e5d47a47ab9913c9fd832b5b - And is stored on Document.
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
