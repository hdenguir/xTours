const express = require('express');
const tourCtrl = require('./../controllers/tourController');
const authCtrl = require('./../controllers/authController');
const reviewCtrl = require('./../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');

const tourRouter = express.Router();

tourRouter.use('/:tourId/reviews', reviewRouter);

tourRouter
  .route('/top-5-cheap')
  .get(tourCtrl.aliasTopTours, tourCtrl.getAllTours);

tourRouter.route('/tour-stats').get(tourCtrl.getTourStats);
tourRouter
  .route('/monthly-plan/:year')
  .get(
    authCtrl.protect,
    authCtrl.restrictTo('admin', 'lead-guide', 'guide'),
    tourCtrl.getMonthlyPlan,
  );

tourRouter
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourCtrl.getToursWithin);

tourRouter
  .route('/distances/:latlng/unit/:unit')
  .get(tourCtrl.getDistances);

tourRouter
  .route('/')
  .get(tourCtrl.getAllTours)
  .post(
    authCtrl.protect,
    authCtrl.restrictTo('admin', 'lead-guide'),
    tourCtrl.createTour,
  );

tourRouter
  .route('/:id')
  .get(tourCtrl.getTour)
  .patch(
    authCtrl.protect,
    authCtrl.restrictTo('admin', 'lead-guide'),
    tourCtrl.uploadTourImages,
    tourCtrl.resizeTourImages,
    tourCtrl.updateTour,
  )
  .delete(
    authCtrl.protect,
    authCtrl.restrictTo('admin', 'lead-guide'),
    tourCtrl.deleteTour,
  );

module.exports = tourRouter;
