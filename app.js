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

// ######################
// ### POST REQUEST #####
// ######################

app.post('/api/v1/tours', (req, res) => {
  //By default express does not include the data with the request. Need middleware. (see above).
  //   console.log(req.body);
  const newId = toursData[toursData.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  toursData.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(toursData),
    (err) => {
      res.status(201).json({ status: 'success', data: { tour: newTour } });
    }
  );
});

// #####################
// ### LISTENING  ######
// #####################
app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});
