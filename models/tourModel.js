const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [
        40,
        ' A tour name must be less than or equal to 40 characters',
      ],
      minLength: [
        10,
        ' A tour name must be more than or equal to 10 characters',
      ],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour should have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Tour rating must be above 1.0'],
      max: [5, 'Tour rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    discount: {
      type: Number,
      validate: {
        validator: function (val) {
          //'This' only points to created Document NOT Update document
          return val < this.price;
        },
        message: 'Discount price, ${VALUE}, is greater than the price!',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour should have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, //Will permanently hide from output
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//Document Middleware Runs before the .save() and .create()
tourSchema.pre('save', function (next) {
  //This = currenlty processed document.
  // const slug = this.name.trim().split(' ').join('-');
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Reference for Post middleware (hook).
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);

//   next();
// });

//Query Middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(docs);
  next();
});

//Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
  //Does NOT Work because the aggregation obj already was built, this just appends before firing. .Match would have to be used during the build.
  // this.match({ secretTour: { $ne: true } });

  //We can access the built aggregation pipeline with this. Unshift ads to bethe beggning.
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

//Virtual Property
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
