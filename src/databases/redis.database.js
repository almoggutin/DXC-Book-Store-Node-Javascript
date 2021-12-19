const redis = require('redis');
const { promisifyAll } = require('bluebird');

promisifyAll(redis);

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const redisClient = redis.createClient({ host: REDIS_HOST, port: REDIS_PORT });

redisClient.on('ready', () => {
    console.log('Redis client connected!');
});

redisClient.on('error', () => {
    console.log('Redis client connection error!');

    process.exit(1);
});

module.exports = redisClient;
