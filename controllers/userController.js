// const fs = require('fs');
// // const userData = JSON.parse(
// //   fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
// // );

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

// <<<<<<<<< USER ROUTE HANDLERS >>>>>>>>>

exports.getAllUsers = catchAsync(async (req, res) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const userData = await features.query;

  res.status(200).json({
    status: 'success',
    userCount: userData.length,
    data: {
      users: userData,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'No Route. Try again later',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'No Route. Try again later',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'No Route. Try again later',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'No Route. Try again later',
  });
};
