const AWS = require('aws-sdk');

const AWS_REGION = process.env.AWS_REGION || 'eu-west-1';

AWS.config.update({ region: AWS_REGION });

module.exports = AWS;
