const express = require('express');

const cartController = require('../controllers/cart.controller');
const userAuth = require('../middleware/auth/user.auth');

const router = express.Router();

// Endpoints for getting/updating the users cart
router.route('').get(userAuth, cartController.getCart).patch(userAuth, cartController.updateCart);

// Ednpoint to add a book to the users cart
router.post('/add-to-cart', userAuth, cartController.addBookToCart);

// Endpoint for checkout
router.post('/checkout', userAuth, cartController.checkout);

module.exports = router;
