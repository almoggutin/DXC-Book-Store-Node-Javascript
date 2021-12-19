const express = require('express');

const bookController = require('../controllers/book.controller');
const adminAuth = require('../middleware/auth/admin.auth');
const s3Middleware = require('../middleware/aws/s3.middleware');

const router = new express.Router();

// Ednpoint that gets all the books
router.get('/', bookController.getBooks);

// Endpoint for creating a new book
router.post('/new', adminAuth, bookController.createBook);

// Ednpoints for getting/updating/deleting information of a specific book
router
    .route('/:id')
    .get(bookController.getBook)
    .patch(adminAuth, bookController.updateBook)
    .delete(adminAuth, bookController.deleteBook);

// Endpoint for uploading images to S3 bucket
router.post('/:id/upload-cover', adminAuth, s3Middleware.uploadImagesToS3, bookController.uploadCover);

// Endpoint for deleting images from S3 bucket
router.post('/:id/delete-cover', adminAuth, s3Middleware.deleteImageFromS3, bookController.deleteCover);

module.exports = router;
