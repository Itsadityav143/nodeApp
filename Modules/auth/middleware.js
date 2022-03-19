const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const {
    UserModel
} = require('../../models/user')
const {
    branchManagerModel
} = require("../../models/branchManager")

const {
    RestaurantModel
} = require('../../models/restaurant');
const {
    driverModel
} = require('../../models/driver')
const {
    superMarketModel
} = require('../../models/superMarketUser')

exports.verifyToken = (req, res, next) => {

    console.log("access_token", req.headers)

    // check header or url parameters or post parameters for token
    const token = req.headers.access_token;

    console.log("language=========", req.headers.language)

    if (!token) return res.status(401).json({
        auth: false,
        message: 'No token provided'
    });

    // verifies secret and check expiration
    jwt.verify(token, 'supersecret', async function (err, decoded) {
        if (err)
            return res.status(401).json({
                auth: false,
                message: 'unauthorized'
            });

        let user = await UserModel.findOne({
            access_token: token
        }).lean(true)
        // if everything is good, save to request for use in other routes
        if (!user)
            return res.status(401).json({
                auth: false,
                message: 'unauthorized'
            });
        req.userData = user
        next();
    });
};

exports.adminVerifyToken = (req, res, next) => {

    console.log("access_token", req.headers)

    // check header or url parameters or post parameters for token
    const token = req.headers.access_token;

    console.log("language=========", req.headers.language)

    if (!token) return res.status(401).json({
        auth: false,
        message: 'No token provided'
    });

    // verifies secret and check expiration
    jwt.verify(token, 'supersecret', async function (err, decoded) {
        if (err)
            return res.status(401).json({
                auth: false,
                message: 'unauthorized'
            });

        let user = await adminModel.findOne({
            access_token: token
        }).lean(true)
        // if everything is good, save to request for use in other routes
        if (!user)
            return res.status(401).json({
                auth: false,
                message: 'unauthorized'
            });
        req.userData = user
        next();
    });
};

exports.driverVerifyToken = (req, res, next) => {

    console.log("access_token", req.headers)

    // check header or url parameters or post parameters for token
    const token = req.headers.access_token;

    console.log("language=========", req.headers.language)

    if (!token) return res.status(401).json({
        auth: false,
        message: 'No token provided'
    });

    // verifies secret and check expiration
    jwt.verify(token, 'supersecret', async function (err, decoded) {
        if (err)
            return res.status(401).json({
                auth: false,
                message: 'unauthorized'
            });

        let user = await driverModel.findOne({
            access_token: token
        }).lean(true)
        // if everything is good, save to request for use in other routes
        if (!user)
            return res.status(401).json({
                auth: false,
                message: 'unauthorized'
            });
        req.userData = user
        next();
    });
};

exports.restaurantVerifyToken = (req, res, next) => {

    console.log("access_token", req.headers)

    // check header or url parameters or post parameters for token
    const token = req.headers.access_token;

    console.log("language=========", req.headers.language)

    if (!token) return res.status(401).json({
        auth: false,
        message: 'No token provided'
    });

    // verifies secret and check expiration
    jwt.verify(token, 'supersecret', async function (err, decoded) {
        if (err)
            return res.status(401).json({
                auth: false,
                message: 'unauthorized'
            });

        let user = await RestaurantModel.findOne({
            access_token: token
        }).lean(true).populate("categories")
        // if everything is good, save to request for use in other routes
        if (!user)
            return res.status(401).json({
                auth: false,
                message: 'unauthorized'
            });
        req.userData = user
        next();
    });
};



exports.superMarketVerifyToken = (req, res, next) => {

    console.log("access_token", req.headers)

    // check header or url parameters or post parameters for token
    const token = req.headers.access_token;

    console.log("language=========", req.headers.language)

    if (!token) return res.status(401).json({
        auth: false,
        message: 'No token provided'
    });

    // verifies secret and check expiration
    jwt.verify(token, 'supersecret', async function (err, decoded) {
        if (err)
            return res.status(401).json({
                auth: false,
                message: 'unauthorized'
            });

        let user = await superMarketModel.findOne({
            access_token: token
        }).lean(true)
        // if everything is good, save to request for use in other routes
        if (!user)
            return res.status(401).json({
                auth: false,
                message: 'unauthorized'
            });
        req.userData = user
        next();
    });
};



exports.managerToken = (req, res, next) => {

    console.log("access_token", req.headers)

    // check header or url parameters or post parameters for token
    const token = req.headers.access_token;

    console.log("language=========", req.headers.language)

    if (!token) return res.status(401).json({
        auth: false,
        message: 'No token provided'
    });

    // verifies secret and check expiration
    jwt.verify(token, 'supersecret', async function (err, decoded) {
        if (err)
            return res.status(401).json({
                auth: false,
                message: 'unauthorized'
            });

        let user = await branchManagerModel.findOne({
            access_token: token
        }).lean(true)
        // if everything is good, save to request for use in other routes
        if (!user)
            return res.status(401).json({
                auth: false,
                message: 'unauthorized'
            });
        req.userData = user
        next();
    });
};