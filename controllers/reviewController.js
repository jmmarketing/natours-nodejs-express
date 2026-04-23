//Get All Reviews
//Create Review

const Reviews = require('../models/reviewModel');
const AppError = require('../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviewData = await Reviews.find();

  res.status(200).json({
    status: 'Success',
    results: reviewData.length,
    data: {
      reviews: reviewData,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const newReview = await Reviews.create(req.body);

  res.status(201).json({
    stauts: 'success',
    data: {
      review: newReview,
    },
  });
});
