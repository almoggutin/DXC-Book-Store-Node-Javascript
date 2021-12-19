const User = require('../../models/user.model');

const { jwtVerify } = require('../../utils/jwt/jwt.utils');
const { findTokenInRedis } = require('../../utils/redis/redis.utils');

const userAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) throw new Error();

        const data = jwtVerify(token);

        const user = await User.findOne({ _id: data._id });
        const isTokenExists = await findTokenInRedis(data._id, token);

        if (!user || !isTokenExists) throw new Error();

        req.user = user;
        req.token = token;

        next();
    } catch (err) {
        res.status(400).send({ status: 400, message: 'User was not authorized.' });
    }
};

module.exports = userAuth;
