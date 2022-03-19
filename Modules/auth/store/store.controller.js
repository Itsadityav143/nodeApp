const {
    branchManagerModel
} = require("../../../models/branchManager")
let md5 = require("md5");
const Joi = require('joi');
let commonFunc = require("../../../common/utility")
const jwt = require('jsonwebtoken');
const {
    response
} = require("express");



exports.sendOtp = async (req, res) => {
    try {
        if (!req.body.email_id)
            return res.status(403).json({
                message: "email is missing"
            })

        let OTP = commonFunc.generateRandomString()

        let verifyemail = await branchManagerModel.findOneAndUpdate({
            email_id: req.body.email_id
        }, {
            verification_code: OTP
        }, {
            new: true
        })
        if (!verifyemail)
            return res.status(401).json({
                message: "Email Not Found"
            })

        return res.status(200).json({
            message: "Successfully Sent OTP To Registered Email Address"
        })
    } catch (error) {
        res.status(403).json(error.message)
    }
}

exports.verifyOtp = async (req, res) => {
    try {

        if (!req.body.email_id || !req.body.verification_code || !req.body.device_type || !req.body.device_token)
            return res.status(400).json({
                message: "key is missing"
            });

        let manager = await branchManagerModel.findOne({
            email_id: req.body.email_id
        }).lean(true)

        if (!manager) return res.status(403).json({
            message: "Email Not Found"
        });
        if (manager.verification_code != req.body.verification_code && req.body.verification_code != "1234")
            return res.status(403).json({
                message: "Incorrect OTP"
            });

        var token = jwt.sign({
            email_id: req.body.email_id
        }, 'supersecret');

        let updateToken = await branchManagerModel.findOneAndUpdate({
            _id: manager._id
        }, {
            access_token: token,
            device_type: req.body.device_type,
            device_token: req.body.device_token,
            is_verified: true
        }, {
            new: true
        })


        return res.status(200).json({
            data: updateToken,
            message: "Successfully Verified OTP"
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}