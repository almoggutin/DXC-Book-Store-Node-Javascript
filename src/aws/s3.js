const multerS3 = require('multer-s3');

const AWS = require('./aws');

const AWS_REGION = process.env.AWS_REGION || 'eu-west-1';

const s3 = new AWS.S3({ region: AWS_REGION });

const bucket = process.env.S3_BUCKET || 'dxc-book-store-bucket';

const fileStorage = multerS3({
    s3,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    contentDisposition: 'inline',
    bucket,
    metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, callback) => {
        const bookID = req.params.id;

        const fileName = `${bookID}/${file.originalname}`;
        callback(null, fileName);
    },
});

module.exports = {
    s3,
    bucket,
    fileStorage,
};
