const express = require('express');

const router = express.Router();
// Was called userRouter before migrating to own file.
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

// ########### USER ROUTES ##########
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);

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
