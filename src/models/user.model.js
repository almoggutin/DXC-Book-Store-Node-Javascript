const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const { jwtSign } = require('../utils/jwt/jwt.utils');
const { pushTokenToRedis } = require('../utils/redis/redis.utils');
const stringUtils = require('../utils/general/string.utils');

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            trim: true,
            lowercase: true,
            required: true,
        },
        lastName: {
            type: String,
            trim: true,
            lowercase: true,
            required: true,
        },
        birthDate: {
            type: Date,
            required: true,
            validate(value) {
                const today = new Date();

                let age = today.getFullYear() - value.getFullYear();
                const m = today.getMonth() - value.getMonth();

                if (m < 0 || (m === 0 && today.getDate() < value.getDate())) age--;

                if (age < 16) throw new Error('You must be at least 16 years old.');
            },
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: true,
            validate(value) {
                if (!validator.isEmail(value)) throw new Error('Invalid email.');
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            validate(value) {
                const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

                if (!passRegex.test(value))
                    throw new Error(
                        'Password must contain at least 8 characters including numbers, big and small letters.'
                    );
            },
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
    }
);

// Middleware for hasing a user's password before it is uploaded to the database
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) user.password = await bcrypt.hash(user.password, 8);

    next();
});

// Static function in order to find an user account via email and password
userSchema.statics.findUserByEmailAndPassowrd = async (email, password) => {
    const user = await User.findOne({ email: email });

    if (!user) throw new Error('Unable to login.');

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new Error('Unable to login.');

    return user;
};

// Method to generate a token when an user logges in
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const userID = user._id;

    const token = jwtSign({ _id: userID }, { expiresIn: '6h' });

    await pushTokenToRedis(userID, token);

    return token;
};

// Method to parse the user's data and sending it to the client with the data that we want
userSchema.methods.toJSON = function () {
    const user = this;

    const userObj = user.toObject();
    userObj.firstName = stringUtils.formatString(user.firstName);
    userObj.lastName = stringUtils.formatString(user.lastName);
    delete userObj.password;

    return userObj;
};

// Virtual Field for the users cart
userSchema.virtual('cart', {
    ref: 'Cart',
    localField: '_id',
    foreignField: 'owner',
});

const User = mongoose.model('User', userSchema);

module.exports = User;
