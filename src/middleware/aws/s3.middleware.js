const multer = require('multer');

const { s3, bucket, fileStorage } = require('../../aws/s3');

const uploadImagesToS3 = multer({
    limits: { fileSize: 10000000 },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) return cb(new Error('Please upload an image.'));
        cb(null, true);
    },
    storage: fileStorage,
}).single('image');

const deleteImageFromS3 = async (req, res, next) => {
    const Key = req.params.id + '/';

    try {
        await s3
            .deleteObject({
                Key,
                Bucket: bucket,
            })
            .promise();

        next();
    } catch (err) {
        res.status(404).send({
            status: 404,
            message: 'File not found',
        });
    }
};

module.exports = {
    uploadImagesToS3,
    deleteImageFromS3,
};
