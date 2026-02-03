const Tour = require('../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  const queryParams = new URLSearchParams({
    limit: '5',
    sort: '-ratingsAverage,price',
    fields: 'name,price,ratingsAverage,summary,difficulty',
  });

  const seperator = req.url.includes('?') ? '&' : '?';
  req.url = req.url + seperator + queryParams.toString();

  next();
};

exports.getAllTours = async (req, res) => {
  try {
    //Tour.find creates the Mongoose Query, req.query is the express query string
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const toursData = await features.query;

    res.status(200).json({
      status: 'success',
      // requestedAt: req.requestedTime,
      results: toursData.length,
      data: {
        tours: toursData,
      },
    });
  } catch (err) {
    res.status(404).json({
      stats: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  // const paramID = +req.params.id;
  // const tour = toursData.find((t) => t.id === paramID);

  try {
    const tour = await Tour.findById(req.params.id);
    //Tour.findOne({_id: req.params.id}) -- same result as above.

    res.status(200).json({
      status: 'success',
      data: {
        tours: tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      stats: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  // const newId = toursData[toursData.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);

  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({ status: 'success', data: { tour } });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  // const paramID = +req.params.id;

  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          // _id: { $toUpper: '$difficulty' },
          _id: '$difficulty',
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } },
      // },
    ]);

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = +req.params.year;

    //Tour.aggregate = mongoose
    const plan = await Tour.aggregate([
      //All of this is MongoDB +JS
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      { $project: { _id: 0 } },
      {
        $sort: { month: 1 },
      },
      {
        $limit: 12,
      },
    ]);

    // Express
    res.status(200).json({
      status: 'success',
      data: plan,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
