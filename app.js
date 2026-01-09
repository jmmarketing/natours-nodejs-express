const express = require('express');
// const fs = require('fs');
const morgan = require('morgan');

const app = express();

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// ++++++++++++++++++++
// ++++ Middleware ++++
// ++++++++++++++++++++
app.use(morgan('dev'));

app.use(express.json()); //Middleware - Function that can modify incoming request data.

app.use((req, res, next) => {
  console.log('Hello from the middlewar 🤭');

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
