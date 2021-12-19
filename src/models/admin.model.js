const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const { jwtSign } = require('../utils/jwt/jwt.utils');
const { pushTokenToRedis } = require('../utils/redis/redis.utils');
const stringUtils = require('../utils/general/string.utils');

const adminSchema = new mongoose.Schema(
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
                        'Password must contain at least 8 characters including numbers, big and small letters'
                    );
            },
        },
    },
    {
        timestamps: true,
    }
);

// Middleware for hasing a admin's password before it is uploaded to the database
adminSchema.pre('save', async function (next) {
    const admin = this;

    if (admin.isModified('password')) admin.password = await bcrypt.hash(admin.password, 8);

    next();
});

// Static function in order to find an admin account via email and password
adminSchema.statics.findAdminByEmailAndPassowrd = async (email, password) => {
    const admin = await Admin.findOne({ email });

    if (!admin) throw new Error('Unable to login.');

    const isPasswordMatch = await bcrypt.compare(password, admin.password);
    if (!isPasswordMatch) throw new Error('Unable to login.');

    return admin;
};

// Method to generate a token when an admin logges in.
adminSchema.methods.generateAuthToken = async function () {
    const admin = this;
    const adminID = admin._id;

    const token = jwtSign({ _id: adminID }, { expiresIn: '6h' });

    await pushTokenToRedis(adminID, token);

    return token;
};

// Method to parse the admin's data and sending it to the client with the data that we want.
adminSchema.methods.toJSON = function () {
    const admin = this;

    const adminObj = admin.toObject();
    adminObj.firstName = stringUtils.formatString(admin.firstName);
    adminObj.lastName = stringUtils.formatString(admin.lastName);
    delete adminObj.password;

    return adminObj;
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
