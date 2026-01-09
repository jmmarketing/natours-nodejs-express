const express = require('express');

const router = express.Router();
// Was called userRouter before migrating to own file.
const userController = require('./../controllers/userController');

// ########### USER ROUTES ##########
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// Export Module

module.exports = router;
