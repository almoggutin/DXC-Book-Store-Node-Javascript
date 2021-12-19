const express = require('express');

const adminController = require('../controllers/admin.controller');
const adminAuth = require('../middleware/auth/admin.auth');

const router = express.Router();

// Endpoint for creating a new admin account
router.post('/new', adminAuth, adminController.createAdmin);

// Endpoint for logging in to an admin account
router.post('/login', adminController.login);

// Endpoint for logging out of an admin account
router.post('/logout', adminAuth, adminController.logout);

// Endpoint for logging out of an admin account from all devices
router.post('/logout-all', adminAuth, adminController.logoutFromAllDevices);

// Ednpoints for getting/updating/deleting information of a specific admin account
router
    .route('/me')
    .get(adminAuth, adminController.getAdmin)
    .patch(adminAuth, adminController.updateAdmin)
    .delete(adminAuth, adminController.deleteAdmin);

// Endpoint to update an admin accounts password
router.patch('/me/change-password', adminAuth, adminController.updatePassword);

module.exports = router;
