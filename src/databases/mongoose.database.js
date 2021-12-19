const mongoose = require('mongoose');

const NODE_ENV = process.env.NODE_ENV || 'development';
const MONGODB_URL = NODE_ENV === 'production' ? process.env.MONGODB_URL_PROD : process.env.MONGODB_URL_DEV;

const connectToMongoDB = async () => {
    try {
        await mongoose.connect(MONGODB_URL);

        console.log('MongoDB database connected!');
    } catch (err) {
        console.log('MongoDB database connection error!');

        process.exit(1);
    }
};

connectToMongoDB();
