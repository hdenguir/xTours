const express = require('express');
const bookingCtrl = require('./../controllers/bookingController');
const authCtrl = require('./../controllers/authController');
//const reviewCtrl = require('./../controllers/reviewController');

const bookingRouter = express.Router();

bookingRouter.use(authCtrl.protect);

bookingRouter.get(
  '/checkout-session/:tourId',
  bookingCtrl.getCheckoutSession,
);

bookingRouter.use(authCtrl.restrictTo('admin', 'lead-guide'));

bookingRouter
  .route('/')
  .get(bookingCtrl.getAllBookings)
  .post(bookingCtrl.createBooking);

bookingRouter
  .route('/:id')
  .get(bookingCtrl.getBooking)
  .patch(bookingCtrl.updateBooking)
  .delete(bookingCtrl.deleteBooking);

module.exports = bookingRouter;
