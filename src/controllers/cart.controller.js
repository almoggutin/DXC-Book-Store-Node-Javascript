const Cart = require('../models/cart.model');

const getCart = async (req, res) => {
    const user = req.user;

    try {
        const cart = await Cart.findOne({ owner: user._id });
        if (!cart) throw new Error();

        if (cart.length > 0) await cart.populate('books.book');

        res.send({ status: 200, data: { cart } });
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Internal server error.' });
    }
};

const addBookToCart = async (req, res) => {
    const user = req.user;

    const bookID = req.body.bookID;
    const quantity = req.body.quantity;

    try {
        const cart = await Cart.findOne({ owner: user._id });
        if (!cart) throw new Error();

        const books = cart.books;
        if (books.some((bookDoc) => bookDoc.book.toString() === bookID)) {
            for (let bookInCart of books)
                if (bookInCart.book.toString() === bookID) {
                    bookInCart.quantity += quantity;
                    break;
                }
        } else cart.books.unshift({ book: bookID, quantity });

        await cart.save();

        res.send({ status: 200, message: 'The book was added your cart', data: { cart } });
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Internal server error.' });
    }
};

const updateCart = async (req, res) => {
    const user = req.user;

    const bookID = req.body.bookID;
    const quantity = req.body.quantity;

    try {
        const cart = await Cart.findOne({ owner: user._id });
        if (!cart) throw new Error();

        const books = cart.books;
        for (let bookInCart of books)
            if (bookInCart.book.toString() === bookID)
                if (quantity === 0) cart.books = books.filter((bookDoc) => bookDoc.book.toString() !== bookID);
                else bookInCart.quantity = quantity;

        await cart.save();

        res.send({ status: 200, message: 'Your cart has been updated.', data: { cart } });
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Internal server error.' });
    }
};

const checkout = async (req, res) => {
    const user = req.user;

    try {
        if (!user) throw new Error();

        const cart = await Cart.findOne({ owner: user._id });
        if (!cart) throw new Error();
        if (cart.books.length === 0) return res.status(404).send({ status: 404, message: 'Your cart is empty.' });

        cart.books = [];
        await cart.save();

        res.send({ status: 200, message: 'Checkout successful.', data: { cart } });
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Internal server error.' });
    }
};

module.exports = {
    getCart,
    addBookToCart,
    updateCart,
    checkout,
};
