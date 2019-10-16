const express = require('express');
const viewsCtrl = require('../controllers/viewsController');
const userCtrl = require('../controllers/userController');
const authCtrl = require('./../controllers/authController');
const bookingCtrl = require('./../controllers/bookingController');
const viewRouter = express.Router();

//viewRouter.use(authCtrl.isLoggedIn);
viewRouter.use(viewsCtrl.alerts);

viewRouter.get('/', authCtrl.isLoggedIn, viewsCtrl.getOverview);
viewRouter.get(
  '/tours/:slug',
  authCtrl.isLoggedIn,
  viewsCtrl.getTour,
);
viewRouter.get('/login', authCtrl.isLoggedIn, viewsCtrl.getLoginForm);
viewRouter.get('/me', authCtrl.protect, viewsCtrl.getAccount);
viewRouter.get('/my-tours', authCtrl.protect, viewsCtrl.getMyTours);
viewRouter.post(
  '/submit-user-data',
  authCtrl.protect,
  userCtrl.uploadUserPhoto,
  userCtrl.resizeUserPhoto,
  viewsCtrl.updateUserData,
);

module.exports = viewRouter;
