const express = require('express');
const reviewCtrl = require('./../controllers/reviewController');
const authCtrl = require('./../controllers/authController');

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter.use(authCtrl.protect);

reviewRouter
  .route('/')
  .get(reviewCtrl.getAllReviews)
  .post(
    authCtrl.restrictTo('user'),
    reviewCtrl.setTourUserIds,
    reviewCtrl.createReview,
  );

reviewRouter
  .route('/:id')
  .get(reviewCtrl.getReview)
  .patch(
    authCtrl.restrictTo('user', 'admin'),
    reviewCtrl.updateReview,
  )
  .delete(
    authCtrl.restrictTo('user', 'admin'),
    reviewCtrl.deleteReview,
  );

module.exports = reviewRouter;
