const express = require('express');
const userCtrl = require('./../controllers/userController');
const authCtrl = require('./../controllers/authController');
//const reviewCtrl = require('./../controllers/reviewController');

const userRouter = express.Router();

// SIGNUP
userRouter.post('/signup', authCtrl.signup);
userRouter.post('/login', authCtrl.login);
userRouter.get('/logout', authCtrl.logout);
userRouter.post('/forgotPassword', authCtrl.forgotPassword);
userRouter.patch('/resetPassword/:token', authCtrl.resetPassword);

// Protect all routes after this middleware
userRouter.use(authCtrl.protect);

userRouter.get('/me', userCtrl.getMe, userCtrl.getUser);
userRouter.patch('/updateMyPassword', authCtrl.updatePassword);
userRouter.patch(
  '/updateMe',
  userCtrl.uploadUserPhoto,
  userCtrl.resizeUserPhoto,
  userCtrl.updateMe,
);
userRouter.delete('/deleteMe', userCtrl.deleteMe);

// Allow admin to do all (update, delete, show all ...)
userRouter.use(authCtrl.restrictTo('admin'));
userRouter
  .route('/')
  .get(userCtrl.getAllUsers)
  .post(userCtrl.createUser);

userRouter
  .route('/:id')
  .get(userCtrl.getUser)
  .patch(userCtrl.updateUser)
  .delete(userCtrl.deleteUser);

module.exports = userRouter;
