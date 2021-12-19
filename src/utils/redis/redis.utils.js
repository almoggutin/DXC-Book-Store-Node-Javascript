const redisClient = require('../../databases/redis.database');

const pushTokenToRedis = async (id, token) => {
    await redisClient.rpushAsync(id.toString(), token);
};

const removeTokenListFromRedis = async (id) => {
    await redisClient.delAsync(id.toString());
};

const findTokenInRedis = async (id, token) => {
    const isTokenExists = await redisClient.lposAsync(id.toString(), token);

    return isTokenExists !== null;
};

const removeTokenFromRedis = async (id, token) => {
    await redisClient.lremAsync(id.toString(), 0, token);

    const tokenListLength = await redisClient.llenAsync(id.toString());

    if (tokenListLength === 0) await removeTokenListFromRedis(id);
};

module.exports = {
    pushTokenToRedis,
    removeTokenListFromRedis,
    findTokenInRedis,
    removeTokenFromRedis,
};
