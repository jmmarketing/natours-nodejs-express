const app = require('./app');
const port = 3000;

// #####################
// ### LISTENING  ######
// #####################
app.listen(port, () => {
  console.log(`Running on port: ${port}`);
});
