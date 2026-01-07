const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json()); //Middleware - Function that can modify incoming request data.

const port = 3000;

// app.get('/', (req, res) => {
//   //   res.status(200).send('Hello from the server!');
//   res.status(200).json({ message: 'Hello from the server', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can send to this Post');
// });

// const toursData = fs.createReadStream(`${__dirname}/dev-data/data/tours.json`);

// #####################
// ### GET REQUEST #####
// #####################
const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    // Using JSend formatting
    status: 'success',
    results: toursData.length,
    data: {
      tours: toursData,
    },
  });
});

// GET Request with URL Parameters
// {/:y} - Express v5+ updated optional paramaters
//:id parameter declaration
app.get('/api/v1/tours/:id{/:y}', (req, res) => {
  //Parameters accessible in req.params
  const paramID = +req.params.id;

  //Error catch
  if (paramID > toursData.length) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'Invalid tour ID.' });
  }

  // Find tour with ID
  const tour = toursData.find((t) => t.id == paramID);

  //Success
  console.log(tour);
  res.status(200).json({
    // Using JSend formatting
    status: 'success',
    data: {
      tours: tour,
    },
  });
});

// ######################
// ### POST REQUEST #####
// ######################

app.post('/api/v1/tours', (req, res) => {
  //By default express does not include the data with the request. Need middleware. (see above).
  //   console.log(req.body);
  const newId = toursData[toursData.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body); // req.body is only available becasue of above middleware

  toursData.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(toursData),
    (err) => {
      res.status(201).json({ status: 'success', data: { tour: newTour } });
    }
  );
});

// #######################
// ### PATCH REQUEST #####
// #######################

// Note; PUT Request is the same, but the way we manipulate the data is modified. We replace the whole tour entry instead of just a piece.
app.patch('/api/v1/tours/:id', (req, res) => {
  const paramID = +req.params.id;
  const tour = toursData.find((t) => t.id == paramID);
  const tourIndex = toursData.findIndex((t) => t.id == paramID);

  console.log(tourIndex);

  //Error catch
  if (paramID > toursData.length) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'Invalid tour ID.' });
  }

  // Merge Updates
  Object.assign(tour, req.body);
  toursData[tourIndex] = tour;

  /* If PUT request, we would use someting like this..
  toursData[tourIndex] = {
            id: paramID,
            ...req.body  
  }
  */

  // Update File
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(toursData),
    (err) => {
      res.status(201).json({ status: 'success', data: { tour } });
    }
  );
});

// #####################
// ### DELETE REQ  ######
// #####################
app.delete('/api/v1/tours/:id', (req, res) => {
  //Parameters accessible in req.params
  const paramID = +req.params.id;

  //Error catch
  if (paramID > toursData.length) {
    return res
      .status(404)
      .json({ status: 'fail', message: 'Invalid tour ID.' });
  }

  // INSERT MODIFICATION LOGIC (TOUR REMOVAL)

  //Success
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// #####################
// ### LISTENING  ######
// #####################
app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});
