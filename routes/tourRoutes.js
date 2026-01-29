const express = require('express');
const tourController = require('../controllers/tourController');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkID,
  checkBody,
  aliasTopTours,
} = tourController;

const router = express.Router();
// Was called tourRouter before migrating to own file.

// ########### TOUR ROUTES ##########
//Param middleware. Will only run when a parameter of 'id' is in the request path.
// router.param('id', checkID);

//Example of chained controllers.
// router.route('/').get(getAllTours).post(checkBody, createTour);
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/').get(getAllTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

// MODULE EXPORT
module.exports = router;
