const fs = require('fs');
const userData = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
);

// <<<<<<<<< USER ROUTE HANDLERS >>>>>>>>>

exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    userCount: userData.length,
    data: {
      users: userData,
    },
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'No Route. Try again later',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'No Route. Try again later',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'No Route. Try again later',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'No Route. Try again later',
  });
};
