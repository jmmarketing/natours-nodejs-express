const Tour = require('../models/tourModel');

// Example for testing purposes.
// const toursData = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

// <<<<<<<<< TOUR ROUTE HANDLERS/CONTROLLERS >>>>>>>>>
//Example used for Middleware, using simple ID. Mongo has own ids.
// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour id: ${val}`);
//   if (val > toursData.length) {
//     return res
//       .status(404)
//       .json({ status: 'fail', message: 'Invalid tour ID.' });
//   }

//   next();
// };

// Example middleware to validate body, but mongoose schema/model can handle validation of req.
// exports.checkBody = (req, res, next) => {
//   const { name, price } = req.body;
//   if (!name || !price) {
//     return res.status(400).json({
//       status: 'Bad Request',
//       message: 'Missing tour details',
//     });
//   }

//   next();
// };

exports.getAllTours = async (req, res) => {
  try {
    const toursData = await Tour.find();

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

exports.getTour = (req, res) => {
  // const paramID = +req.params.id;
  // const tour = toursData.find((t) => t.id === paramID);

  res.status(200).json({
    status: 'success',
    data: {
      tours: tour,
    },
  });
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

exports.updateTour = (req, res) => {
  // const paramID = +req.params.id;
  // const tour = toursData.find((t) => t.id === paramID);
  // const tourIndex = toursData.findIndex((t) => t.id === paramID);

  // Object.assign(tour, req.body);
  // toursData[tourIndex] = tour;

  res.status(201).json({ status: 'success', data: { tour } });
};

exports.deleteTour = (req, res) => {
  // const paramID = +req.params.id;

  // INSERT MODIFICATION LOGIC (TOUR REMOVAL)
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
