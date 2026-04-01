const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');

//Built in
const { promisify } = require('util');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
  });

  //Payload, secret, expiration options
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: { user: newUser },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1.) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  //2.) check if the user exits and password is correct
  //+password is forced projection, on top of what is normally returned. You coudl do {password: 1} or ('password), but those would return ONLY password, and not password in addition to everything else. Need this because we have password hidden by default in schema.
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect email or password', 401));

  //3.) If everything is ok, send token to client.

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
});

//Protecting routes middleware
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //1.) Getting the token and check if it exits
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token)
    return next(
      new AppError('You are not logged in! Please login for access', 401),
    );

  //2.) Verify the token
  // jwt.verify without the callback is synchronous, so we used the promisify util method to make it a promise and asynch without the callback.
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3.) Check if user still exists
  const userFound = await User.findById(decoded.id);
  if (!userFound) {
    return next(
      new AppError(
        'The user associated with this token no longer exists!',
        401,
      ),
    );
  }

  //4.) Check if user changed password after the JWT as issued.
  if (userFound.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User changed password, please login again!', 401),
    );
  }

  // Grant access to protected route.

  req.user = userFound; //would be passed to next middleware (like restricTo)
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles is array ['admin', 'lead-guide']. role="'user"
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to do this!', 403));
    }

    next();
  };
};

// Basics of forgot password functionality
// 1.) User sends post request to forgot password route w/ email - creates reset token sent to email
// 2.) User sends token from email w/ password to update the password.

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1.) get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('No user with that email address', 404));
  }

  // 2.) Generate random token
  const resetToken = user.createPasswordResetToken();
  //Need the to turn Validation off before saving.
  await user.save({ validateBeforeSave: false });

  // 3.) Send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Update and confirm your new password: ${resetURL}.\n If you didnt forget, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Reset password request. (Valid for 10min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Reset token sent to account email!',
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500,
      ),
    );
  }
});

exports.resetPassword = (req, res, next) => {
  // 1.) Get user based on the token
  // Take token from the req, reencrypt with crypto.createHash and compare to stored token in passwordResertToken.
  const token = req.params.token;
  const reHashed = crypto.createHash('sha256').update(token).digest('hex');

  // 2.) If token has not expired && user, set the new password

  // 3.) Update the changedPasswordAt property for current user

  // 4.) Log the user in, send JWT.
};
