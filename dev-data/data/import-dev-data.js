const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../models/tourModel');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('DB Connection Successful'));

//Read File
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

//Import data into DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data Successfully Loaded');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

//Delete All Data From Collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Deleted Successfully');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] == '--import') {
  importData();
} else if (process.argv[2] == '--delete') {
  deleteData();
}

console.log(process.argv);
