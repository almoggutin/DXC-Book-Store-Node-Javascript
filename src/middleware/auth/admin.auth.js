const Admin = require('../../models/admin.model');

const { jwtVerify } = require('../../utils/jwt/jwt.utils');
const { findTokenInRedis } = require('../../utils/redis/redis.utils');

const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new Error();

        const data = jwtVerify(token);

        const admin = await Admin.findOne({ _id: data._id });
        const isTokenExists = await findTokenInRedis(data._id, token);

        if (!admin || !isTokenExists) throw new Error();

        req.admin = admin;
        req.token = token;

        next();
    } catch (err) {
        res.status(400).send({ status: 400, message: 'Admin was not authorized.' });
    }
};

module.exports = adminAuth;
