const Book = require('../models/book.model');

const { getImageURL } = require('../utils/general/image.utils');

const bookCoverPlaceholder =
    'https://dxc-book-store-bucket.s3.eu-west-1.amazonaws.com/cover-placeholder/book-cover-placeholder.jpeg';

const getBooks = async (req, res) => {
    try {
        const books = await Book.find({});

        res.send({ status: 200, data: { books } });
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Internal server error.' });
    }
};

const createBook = async (req, res) => {
    const book = new Book(req.body);
    book.bookCover = bookCoverPlaceholder;

    try {
        await book.save();

        console.log('Book: New book was added.');

        res.status(201).send({ status: 201, data: { book } });
    } catch (err) {
        res.status(400).send({ status: 400, message: err });
    }
};

const uploadCover = async (req, res) => {
    const bookID = req.params.id;
    const file = req.file;

    if (file == null) return res.status(400).send({ status: 400, message: 'Please upload an image.' });

    try {
        const book = await Book.findById(bookID);
        if (!book) throw new Error();

        book.bookCover = getImageURL(file);

        await book.save();

        res.send({ status: 200, message: 'Book cover uploaded.', data: { book } });
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Internal server error.' });
    }
};

const getBook = async (req, res) => {
    const bookID = req.params.id;
    if (!bookID) return res.status(400).send({ status: 400, message: 'Bad request.' });

    try {
        const book = await Book.findById(bookID);
        if (!book) throw new Error();

        res.send({ status: 200, data: { book } });
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Internal server error.' });
    }
};

const updateBook = async (req, res) => {
    const edits = Object.keys(req.body);
    const allowedEdits = [
        'title',
        'author',
        'bookCover',
        'description',
        'publisher',
        'publicationDate',
        'pages',
        'price',
    ];
    const isEditsValid = edits.every((edit) => allowedEdits.includes(edit));

    if (!isEditsValid) return res.status(406).send({ status: 406, message: 'Edits are not valid.' });

    const bookID = req.params.id;
    if (!bookID) return res.status(500).send({ status: 500, message: 'Internal server error.' });

    try {
        const book = await Book.findById(bookID);
        if (!book) throw new Error();

        edits.forEach((edit) => (book[edit] = req.body[edit]));
        await book.save();

        res.send({ status: 200, message: 'Book information updated.' });
    } catch (err) {
        res.status(501).send({ status: 501, message: err });
    }
};

const deleteBook = async (req, res) => {
    const bookID = req.params.id;

    try {
        if (!bookID) throw new Error();

        const book = await Book.findByIdAndDelete(bookID);
        if (!book) throw new Error();

        res.send({ status: 200, message: 'Book deleted.' });
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Internal server error.' });
    }
};

const deleteCover = async (req, res) => {
    const bookID = req.params.id;

    try {
        if (!bookID) throw new Error();

        const book = await Book.findById(bookID);
        if (!book) throw new Error();

        book.bookCover =
            'https://dxc-book-store-bucket.s3.eu-west-1.amazonaws.com/cover-placeholder/book-cover-placeholder.jpeg';

        await book.save();

        res.send({ status: 200, message: 'Book cover deleted.', data: { book } });
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Internal server error.' });
    }
};

module.exports = {
    getBooks,
    createBook,
    uploadCover,
    getBook,
    updateBook,
    deleteBook,
    deleteCover,
};
