const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');

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
