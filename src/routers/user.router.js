const express = require('express');

const userController = require('../controllers/user.controller');
const userAuth = require('../middleware/auth/user.auth');

const router = express.Router();

// Endpoint for creating a new user account
router.post('/new', userController.createUser);

// Endpoint for logging in to an user account
router.post('/login', userController.login);

// Endpoint for logging out of an user account
router.post('/logout', userAuth, userController.logout);

// Endpoint for logging out of an user account from all devices
router.post('/logout-all', userAuth, userController.logoutFromAllDevices);

// Ednpoints for getting/updating/deleting information of a specific user account
router
    .route('/me')
    .get(userAuth, userController.getUser)
    .patch(userAuth, userController.updateUser)
    .delete(userAuth, userController.deleteUser);

// Endpoint to update an user accounts password
router.patch('/me/change-password', userAuth, userController.updatePassword);

module.exports = router;
