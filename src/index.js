const dotenv = require('dotenv');

const NODE_ENV = process.env.NODE_ENV || 'development';
if (NODE_ENV === 'development') dotenv.config({ path: './config/dev.env' });

const PORT = process.env.PORT || 3000;

const app = require('./app');
app.listen(PORT, () => console.log(`Server is running in ${NODE_ENV} mode on port: ${PORT}`));
