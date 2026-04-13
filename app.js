const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// const qs = require('qs');

const app = express();

// ++++++++++++++++++++
// ++++ GLOBAL Middleware ++++
// ++++++++++++++++++++
//Sets custom query parser using qs -- so /?difficulty[gt]=5 gets parsed to {difficulty: {gt: 5}}
app.set('query parser', 'extended');

//Checks if we are in dev or production. Only runs when in Development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  limit: 100,
  windowMs: 60 * 60 * 1000, // 1hr window
  message: 'Too many requests, please try again in an hour',
});

app.use('/api', limiter); // Limits only API routes.

app.use(express.json()); //Middleware - Function that can modify incoming request data.

app.use(express.static(`${__dirname}/public`)); // For serving static files in public directory

app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  // console.log(req.headers);

  next();
});

// ++++++++++++++++++++
// ++++ Routes ++++
// ++++++++++++++++++++

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// ++++++++++++++++++++++++++++++++++++++
// ++++ Unhandle Route Error Handler ++++
// ++++++++++++++++++++++++++++++++++++++
//Should always be last since app.js runs in order.

app.all('/{*wildcard}', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//Express error handling middleware always takes 4 arguments, starting with error.
app.use(globalErrorHandler);

module.exports = app;
