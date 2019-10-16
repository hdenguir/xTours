const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1.Get tours data from collection
  const tours = await Tour.find();
  // 2. Build template

  // 3. Render that template using tour data
  res.status(200).render('overview', {
    title: 'Overview: All tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const slug = req.params.slug;
  const tour = await Tour.findOne({ slug: slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('The is no tour with that name', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'Sign In',
  });
});

exports.signup = catchAsync(async (req, res) => {
  res.status(200).render('account', {
    title: 'Sign Up',
    user: {},
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1. Find All Bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2. Find tours with the returned IDs
  const toursIDs = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: toursIDs } });

  res.status(200).render('overview', { title: 'My Tours', tours });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name,
      email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).render('account', {
    title: 'Your Account',
    user: updatedUser,
  });
});

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'booking') {
    res.locals.alert =
      "Your booking wa successful! Please check your email for a confirmation. If your booking doens't show up here immediatly, please come back later.";
  }
  next();
};
