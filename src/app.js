const express = require('express');
const cors = require('cors');

const bookRouter = require('./routers/book.router');
const userRouter = require('./routers/user.router');
const cartRouter = require('./routers/cart.router');
const adminRouter = require('./routers/admin.router');

require('./databases/mongoose.database');
require('./databases/redis.database');

const app = express();

app.use(express.json());

const NODE_ENV = process.env.NODE_ENV || 'development';
const whitelist = [];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) callback(null, true);
        else callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(NODE_ENV === 'development' ? cors() : cors(corsOptions));

app.get('/', (req, res) => res.send());

app.use('/books', bookRouter);
app.use('/users', userRouter);
app.use('/cart', cartRouter);
app.use('/admins', adminRouter);

module.exports = app;
