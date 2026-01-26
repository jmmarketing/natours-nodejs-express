const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const qs = require('qs');

const app = express();

// ++++++++++++++++++++
// ++++ Middleware ++++
// ++++++++++++++++++++
//Sets custom query parser using qs -- so /?difficulty[gt]=5 gets parsed to {difficulty: {gt: 5}}
app.set('query parser', 'extended');

//Checks if we are in dev or production. Only runs when in Development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); //Middleware - Function that can modify incoming request data.

app.use(express.static(`${__dirname}/public`)); // For serving static files in public directory

app.use((req, res, next) => {
  console.log('Hello from the middleware 🤭');

  next();
});

app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();

  next();
});

// ++++++++++++++++++++
// ++++ Routes ++++
// ++++++++++++++++++++

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
