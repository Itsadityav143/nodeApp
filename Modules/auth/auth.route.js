const express = require('express');
const router = express.Router();
const userRouter = require('./user/user.routes').Router
const adminRouter = require('./admin/admin.routes').Router
const {
    uploadMedia
} = require('../../common/s3service')
router.use('/admin', adminRouter);
router.use('/user', userRouter);
router.post('/uploadImage',
    uploadMedia,
    (req, res) => {
        try {
            console.log(req.file)
            console.log(req.files)
            res.status(200).send({
                path: req.file.location
            });
        } catch (e) {
            return res.status(400).json({
                message: e.message
            });
        }
    }
)

exports.Router = router;