const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION.. Shutting down....');
  process.exit(1);
});

const app = require('./app');
const port = process.env.PORT || 3000;

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('DB Connection Successful'));

// console.log(process.env);

// #####################
// ### LISTENING  ######
// #####################
const server = app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});

// Handles promise rejectioins (lik DB Connections) - Safetynet
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION.. Shutting down....');

  //Shuts down the app
  server.close(() => {
    process.exit(1);
  });
});
