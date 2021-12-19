const jwt = require('jsonwebtoken');

const jwtSign = (object, options) => {
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    if (!PRIVATE_KEY) throw new Error();

    const token = jwt.sign(object, PRIVATE_KEY, {
        ...(options && options),
        algorithm: 'RS256',
    });

    return token;
};

const jwtVerify = (token) => {
    const PUBLIC_KEY = process.env.PUBLIC_KEY;
    if (!PUBLIC_KEY) throw new Error();

    const decodedData = jwt.verify(token, PUBLIC_KEY);

    return decodedData;
};

module.exports = {
    jwtSign,
    jwtVerify,
};
