const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
aws.config.update({
    // Your SECRET ACCESS KEY from AWS should go here,
    // Never share it!
    // Setup Env Variable, e.g: process.env.SECRET_ACCESS_KEY
    secretAccessKey: "f/AAokFUTixyz0B9AWKC1DHnoZa3Zu+rJSODGT6j",
   
    // Not working key, Your ACCESS KEY ID from AWS should go here,
    // Never share it!
    // Setup Env Variable, e.g: process.env.ACCESS_KEY_ID
    accessKeyId: "AKIAVHGO4MUSELAEFOGX",
    region: 'me-south-1' // region of your bucket
});

const s3 = new aws.S3();

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'haydiis3',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {
                fieldName: file.fieldname
            });
        },
        key: function (req, file, cb) {
            let extArray = file.originalname.split(".");
            let extension = extArray[extArray.length - 1];

            cb(null, Date.now().toString()+ '.' +extension)
        }
    })
});

exports.uploadMedia = function (req, res, next) {
    upload.single('media')(req, res, function (err, some) {
        if (err) {
            return res.status(422).send({
                errors: [{
                    title: 'Image Upload Error',
                    detail: err.message
                }]
            });
        }

        next();
    });
}

exports.s3bucket  = s3

