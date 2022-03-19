const express = require('express');
const router = express.Router();
const userRouter = require('./user/user.routes').Router
const adminRouter = require('./admin/admin.routes').Router
const restaurantRouter = require('./restaurants/restaurants.routes').Router
const superMarketRouter = require('./superMarket/superMarket.router').Router

const storeRouter = require('./store/store.routes').Router

const {
    Router
} = require('./driver/driver.routes')
const {
    uploadMedia
} = require('../../common/s3service')
router.use('/store', storeRouter)
router.use('/admin', adminRouter);
router.use('/restaurant', restaurantRouter);
router.use('/user', userRouter);
router.use('/superMarket', superMarketRouter)

router.use('/driver', Router);
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