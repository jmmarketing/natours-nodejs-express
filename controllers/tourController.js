const fs = require('fs');
const Tour = require('../models/tourModel');

// Example for testing purposes.
// const toursData = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

// <<<<<<<<< TOUR ROUTE HANDLERS/CONTROLLERS >>>>>>>>>
exports.checkID = (req, res, next, val) => {
  console.log(`Tour id: ${val}`);
  if (val > toursData.length) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'Invalid tour ID.' });
  }

  next();
};
exports.checkBody = (req, res, next) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({
      status: 'Bad Request',
      message: 'Missing tour details',
    });
  }

  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestedTime,
    // results: toursData.length,
    // data: {
    //   tours: toursData,
    },
  });
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

exports.createTour = (req, res) => {
  // const newId = toursData[toursData.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);

  res.status(201).json({
    status: 'success',
    // data: { tour: newTour }
  });
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
