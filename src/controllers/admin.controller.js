const bcrypt = require('bcrypt');

const Admin = require('../models/admin.model');

const redisUtils = require('../utils/redis/redis.utils');

const createAdmin = async (req, res) => {
    const admin = new Admin(req.body);

    try {
        await admin.save();

        console.log('Admin: New Account was added.');

        res.status(201).send({ status: 201, data: { admin } });
    } catch (err) {
        res.status(400).send({ status: 400, message: err });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findAdminByEmailAndPassowrd(email, password);
        const token = await admin.generateAuthToken();

        res.send({ status: 200, data: { admin, token } });
    } catch (err) {
        res.status(401).send({ status: 401, message: err });
    }
};

const logout = async (req, res) => {
    const admin = req.admin;
    const token = req.token;

    try {
        if (!admin || !token) throw new Error();

        await redisUtils.removeTokenFromRedis(admin._id, token);
        await admin.save();

        res.send({ status: 200, message: 'Logout successful.' });
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Internal server error.' });
    }
};

const logoutFromAllDevices = async (req, res) => {
    const admin = req.admin;

    try {
        if (!admin) throw new Error();

        await redisUtils.removeTokenListFromRedis(admin._id);
        await admin.save();

        res.send({ status: 200, message: 'Logout from all devices successful.' });
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Internal server error.' });
    }
};

const getAdmin = async (req, res) => {
    const admin = req.admin;

    try {
        if (!admin) throw new Error();

        res.send({ status: 200, data: { admin } });
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Internal server error.' });
    }
};

const updateAdmin = async (req, res) => {
    const edits = Object.keys(req.body);
    const allowedEdits = ['firstName', 'lastName', 'email'];
    const isEditsValid = edits.every((edit) => allowedEdits.includes(edit));

    if (!isEditsValid) return res.status(406).send({ status: 406, message: 'Edits are not valid.' });

    const admin = req.admin;

    try {
        if (!admin) return res.status(500).send({ status: 500, message: 'Internal server error.' });

        edits.forEach((edit) => (admin[edit] = req.body[edit]));
        await admin.save();

        res.send({ status: 200, message: 'Account information updated.' });
    } catch (err) {
        res.status(501).send({ status: 501, message: err });
    }
};

const updatePassword = async (req, res) => {
    const { currentPassword = '', newPassword = '', repeatedNewPassword = '' } = req.body;
    if (currentPassword === '' || newPassword === '' || repeatedNewPassword === '')
        return res.status(400).send({ status: 400, message: 'Bad request.' });

    const admin = req.admin;

    try {
        if (!admin) return res.status(500).send({ status: 500, message: 'Internal server error.' });

        const isPasswordMatch = await bcrypt.compare(currentPassword, admin.password);

        if (!isPasswordMatch) return res.status(400).send({ status: 400, message: 'Bad request.' });

        if (newPassword === currentPassword || newPassword !== repeatedNewPassword)
            return res.status(400).send({ status: 400, message: 'Bad request.' });

        admin.password = newPassword;
        await admin.save();

        res.send({ status: 200, message: 'Password updated.' });
    } catch (err) {
        res.status(501).send({ status: 501, message: err });
    }
};

const deleteAdmin = async (req, res) => {
    const admin = req.admin;

    try {
        if (!admin) throw new Error();

        await redisUtils.removeTokenListFromRedis(admin._id);
        await admin.remove();

        console.log('Admin: Account deleted.');

        res.send({ status: 200, message: 'Admin account deleted.' });
    } catch (err) {
        res.status(500).send({ status: 500, message: 'Internal server error.' });
    }
};

module.exports = {
    createAdmin,
    login,
    logout,
    logoutFromAllDevices,
    getAdmin,
    updateAdmin,
    updatePassword,
    deleteAdmin,
};
