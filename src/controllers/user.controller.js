const bcrypt = require('bcrypt');

const User = require('../models/user.model');
const Cart = require('../models/cart.model');

const redisUtils = require('../utils/redis/redis.utils');

const createUser = async (req, res) => {
    const user = new User(req.body);
    const cart = new Cart({ owner: user._id });

    try {
        await user.save();
        await cart.save();
        await user.populate('cart');

        const token = await user.generateAuthToken();

        console.log('User: New Account was added.');

        res.status(201).send({ status: 201, data: { user, token } });
    } catch (err) {
        res.status(400).send({ status: 400, message: err });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findUserByEmailAndPassowrd(email, password);
        await user.populate('cart');

        const token = await user.generateAuthToken();

        res.send({ status: 200, data: { user, token } });
    } catch (err) {
        res.status(401).send({ status: 401, message: err });
    }
};

const logout = async (req, res) => {
    const user = req.user;
    const token = req.token;

    try {
        if (!user || !token) throw new Error();

        await redisUtils.removeTokenFromRedis(user._id, token);
        await user.save();

        res.send({ status: 200, message: 'Logout successful.' });
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Internal server error.' });
    }
};

const logoutFromAllDevices = async (req, res) => {
    const user = req.user;

    try {
        if (!user) throw new Error();

        await redisUtils.removeTokenListFromRedis(user._id);
        await user.save();

        res.send({ status: 200, message: 'Logout from all devices successful.' });
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Internal server error.' });
    }
};

const getUser = async (req, res) => {
    const user = req.user;

    try {
        if (!user) throw new Error();

        await user.populate('cart');

        res.send({ status: 200, data: { user } });
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Internal server error.' });
    }
};

const updateUser = async (req, res) => {
    const edits = Object.keys(req.body);
    const allowedEdits = ['firstName', 'lastName', 'email'];
    const isEditsValid = edits.every((edit) => allowedEdits.includes(edit));

    if (!isEditsValid) return res.status(406).send({ status: 406, message: 'Edits are not valid.' });

    const user = req.user;

    try {
        if (!user) return res.status(500).send({ status: 500, message: 'Internal server error.' });

        edits.forEach((edit) => (user[edit] = req.body[edit]));
        await user.save();

        res.send({ status: 200, message: 'Account information updated.', data: { user } });
    } catch (err) {
        res.status(501).send({ status: 501, message: err });
    }
};

const updatePassword = async (req, res) => {
    const { currentPassword = '', newPassword = '', repeatedNewPassword = '' } = req.body;
    if (currentPassword === '' || newPassword === '' || repeatedNewPassword === '')
        return res.status(400).send({ status: 400, message: 'Bad request.' });

    const user = req.user;

    try {
        if (!user) return res.status(500).send({ status: 500, message: 'Internal server error.' });

        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordMatch) return res.status(400).send({ status: 400, message: 'Bad request.' });

        if (newPassword === currentPassword || newPassword !== repeatedNewPassword)
            return res.status(400).send({ status: 400, message: 'Bad request.' });

        user.password = newPassword;
        await user.save();

        res.send({ status: 200, message: 'Password updated.' });
    } catch (err) {
        res.status(501).send({ status: 501, message: err });
    }
};

const deleteUser = async (req, res) => {
    const user = req.user;

    try {
        if (!user) throw new Error();

        await Cart.findOneAndRemove({ owner: user._id });
        await redisUtils.removeTokenListFromRedis(user._id);
        await user.remove();

        console.log('User: Account deleted.');

        res.send({ status: 200, message: 'User account deleted.' });
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Internal server error.' });
    }
};

module.exports = {
    createUser,
    login,
    logout,
    logoutFromAllDevices,
    getUser,
    updateUser,
    updatePassword,
    deleteUser,
};
