const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    //rating, createdAt, ref to tour, ref to user, review

    rating: {
      type: Number,
      min: [1, 'Your rating must be at least a 1.0'],
      max: [5, 'Your rating can not be more than 5.0'],
      required: [true, 'You can not leave a review without a rating (1-5)'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    review: {
      type: String,
      minLength: [15, 'Minimum length of a review is 15 characters'],
      maxLength: [240, 'Maximum lenght of a review is 240 characters'],
      required: [true, 'Review can not be empty'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Reviews do not work without an user. '],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.pre(/^find/, function (next) {
  this.populate('tour').populate({
    path: 'user',
    select: 'name role id email',
  });
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
