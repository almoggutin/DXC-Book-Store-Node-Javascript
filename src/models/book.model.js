const mongoose = require('mongoose');
const validator = require('validator');

const dateUtils = require('../utils/general/date.utils');
const stringUtils = require('../utils/general/string.utils');

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            lowercase: true,
            required: true,
        },
        author: {
            type: String,
            trim: true,
            lowercase: true,
            required: true,
        },
        bookCover: {
            type: String,
            trim: true,
            required: true,
            validate(value) {
                if (!validator.isURL(value)) throw new Error('Invalid URL.');
            },
        },
        description: {
            type: String,
            trim: true,
            required: true,
        },
        publisher: {
            type: String,
            trim: true,
            lowercase: true,
            required: true,
        },
        publicationDate: {
            type: Date,
            required: true,
        },
        pages: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Method to parse the book data and sending it to the client with the data that we want.
bookSchema.methods.toJSON = function () {
    const book = this;

    const bookObj = book.toObject();
    bookObj.title = stringUtils.formatString(book.title);
    bookObj.author = stringUtils.formatString(book.author);
    bookObj.publisher = stringUtils.formatString(book.publisher);
    bookObj.publicationDate = dateUtils.formatDate(book.publicationDate);

    return bookObj;
};

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
