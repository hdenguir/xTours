const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
  const message = `Duplicate Field value: ${
    value[0]
  }. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationError = err => {
  const errors = Object.values(err.errors)
    .map(el => el.message)
    .join('. ');

  const message = `Invalid input data. ${errors}`;

  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token please log in again', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again', 401);

const sendErrorDev = (err, req, res) => {
  console.log('=============== DEV ERROR =================');
  // A. API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // B. RENDER website
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong !',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  console.log('=============== PROD ERROR =================');
  // A. API / Operational, trusted error: send message to client
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // 2. SEND GENERIC MESSAGE
    return res.status(500).json({
      status: 'Error',
      message: 'Something went very wrong!',
    });
  }

  // B. RENDERED WEBSITE / Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong !',
      msg: err.message,
    });
  }

  // 2. SEND GENERIC MESSAGE
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong !',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationError(error);
    if (error.name === 'JsonWebTokenError')
      error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError(error);

    sendErrorProd(error, req, res);
  }
};
