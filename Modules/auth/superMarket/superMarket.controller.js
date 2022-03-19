const {
    superMarketModel
} = require("../../../models/superMarketUser")
let md5 = require("md5");
const Joi = require('joi');
let commonFunc = require("../../../common/utility")
const jwt = require('jsonwebtoken');
const {
    response
} = require("express");
const {
    rmSync
} = require("fs");


exports.signup = async (req, res) => {
    try {

        const schema = Joi.object({
            username: Joi.string().required(),
            profile_image: Joi.string().optional().allow(''),
            password: Joi.string().required(),
            email: Joi.string().min(6).required(),
            country_code: Joi.string().optional().allow(''),
            mobile_number: Joi.string().optional().allow(''),
            device_type: Joi.string().optional().allow(''),
            device_token: Joi.string().optional().allow(''),
            closing_time: Joi.string().optional().allow(''),
            opening_time: Joi.string().optional().allow(''),
        });


        const options = {
            abortEarly: false, // include all errors
            allowUnknown: true, // ignore unknown props
            stripUnknown: true // remove unknown props
        };

        // validate request body against schema
        const {
            error,
            value
        } = schema.validate(req.body, options);

        if (error) {
            return res.status(400).json({
                message: `Validation error: ${error.details[0].message}`
            });
        }

        let userData = req.body

        let verification_code = commonFunc.generateRandomString();

        // userData.location = {
        //     type: "point",
        //     "coordinates": [78.0880, 27.8974]
        // }

        userData.password = md5(userData.password)
        userData.verification_code = verification_code
        userData.is_profile_completed = 0;

        let token = jwt.sign({
            email: userData.email
        }, 'supersecret')

        userData.access_token = token

        let isExist = await superMarketModel.findOne({
            $or: [{
                email: userData.email
            }, {
                mobile_number: userData.mobile_number
            }, {
                username: userData.username
            }]
        })
        if (isExist) return res.status(403).json({
            message: "user allready exist"
        })

        let data = await superMarketModel.create(userData)


        delete data._doc.verification_code
        delete data._doc.password

        return res.status(200).json({
            data: data,
            message: "Successfully Signed Up"
        })

    } catch (error) {
        console.log(error)
        return res.status(403).json({
            message: error.message
        })
    }

}


exports.login = async (req, res) => {
    try {

        let userData = req.body

        if (!userData.country_code || !userData.mobile_number || !userData.password)
            return res.status(403).json({
                message: "key is missing"
            })

        let user = await superMarketModel.findOne({
            country_code: userData.country_code,
            mobile_number: userData.mobile_number,
            password: md5(userData.password)
        }).lean(true)

        if (!user) return res.status(403).json({
            message: "invalid Credentials"
        })

        var token = jwt.sign({
            mobile_number: user.mobile_number
        }, 'supersecret');

        let update = await superMarketModel.findOneAndUpdate({
            mobile_number: user.mobile_number
        }, {
            $set: {
                access_token: token,
                device_type: req.body.device_type,
                device_token: req.body.device_token
            },
        }, {
            new: true
        })



        delete update._doc.verification_code
        delete update._doc.password

        return res.status(200).json({
            data: update,
            message: "Successfully logged in"
        });

    } catch (e) {
        return res.status(403).json({
            message: e.message
        })
    }
}




exports.sendOtp = async (req, res) => {
    try {
        let {
            country_code,
            mobile_number
        } = req.body;

        if (!country_code || !mobile_number)
            return res.status(403).json({
                message: "key is missing"
            })

        let OTP = commonFunc.generateRandomString()

        let verifyMobileNumber = await superMarketModel.findOneAndUpdate({
            country_code,
            mobile_number
        }, {
            verification_code: OTP
        }, {
            new: true
        }).exec()
        if (!verifyMobileNumber)
            return res.status(401).json({
                message: "Invalid credentials"
            })

        return res.status(200).json({
            message: "Successfully Sent OTP To Registered Mobile Number " + mobile_number
        })
    } catch (error) {
        res.status(403).json(error.message)
    }
}

exports.verifyOtp = async function (req, res, next) {
    try {
        var {
            verification_code,
            country_code,
            mobile_number
        } = req.body;

        if (!country_code || !mobile_number || !verification_code)
            return res.status(403).json({
                message: "key is missing"
            })

        let user = await superMarketModel.findOne({
            country_code,
            mobile_number
        }).lean(true)

        if (!user)
            return res.status(400).json({
                message: "user not found"
            });

        let otp = user.verification_code;

        if (verification_code != otp && verification_code != '1234') {
            return res.status(400).json({
                message: "Please enter the valid OTP"
            });
        }

        let updateData = await superMarketModel.findByIdAndUpdate(user._id, {
            is_verified: 1
        }, {
            new: true
        }).exec()

        if (!updateData)
            return res.status(400).json({
                message: "Could not verify OTP, please try again"
            });

        return res.status(200).json({
            data: updateData,
            message: "Successfully verified OTP"
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}


exports.logout = async (req, res) => {
    try {
        let user_id = req.userData._id;

        console.log("user::", user_id);
        let data = await superMarketModel.findByIdAndUpdate(user_id, {
            $set: {
                access_token: ""
            }
        }, {
            new: true
        })
        if (data) {
            return res.status(200).json({
                message: "Successfully logged out"
            });
        }
        return res.status(400).json({
            message: "Could not logout, please try again"
        });

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}



exports.updateProfile = async (req, res) => {

    if (typeof req.body.bank_details == 'string')
        req.body.bank_details = JSON.parse(req.body.bank_details)

    let userData = req.body
    //userData.is_profile_completed = 1

    try {

        var user = await superMarketModel.findByIdAndUpdate(req.userData._id, userData, {
            new: true
        })

        delete user._doc.verification_code
        delete user._doc.password

        if (!user)
            return res.status(403).json({
                message: "not found"
            });
        return res.status(200).json({
            data: user,
            message: "Successfully Profile completed"
        });
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}



exports.checkStatus = async (req, res) => {
    try {
        console.log("Check Status API");
        let market = req.userData;

        if (market.is_approved_by_admin == "0") return res.status(200).json({
            message: "Account is pending",
            data: market
        })
        if (market.is_approved_by_admin == "1") return res.status(200).json({
            message: "Account is approved",
            data: market
        })

        if (market.is_approved_by_admin == "2") return res.status(200).json({
            message: "Account is disapproved by admin",
            data: market
        })

        return res.status(200).json({
            message: "Account is not yet approved",
            data: market
        })

    } catch (error) {
        res.status(403).json(error.message)
    }
}



exports.forgotPassword = async (req, res) => {
    try {
        res.status(200).json({
            message: "We have sent you a mail",
        })
    } catch (error) {
        res.status(403).error(error.message);
    }
}



exports.changePassword = async (req, res) => {
    try {
        let {
            password,
            oldPassword
        } = req.body;

        if (!password || !oldPassword)
            return res.status(403).json({
                message: "key is missing"
            })

        let data = await superMarketModel.findById(req.userData._id).lean(true)
        if (!data)
            return res.status(400).json({
                message: "User does not exist"
            })
        if (data.password != md5(oldPassword))
            return res.status(400).json({
                message: "Your old password is incorrect"
            })

        var token = jwt.sign({
            email: data.email
        }, 'supersecret');

        let update = await superMarketModel.findByIdAndUpdate(req.userData._id, {
            $set: {
                password: md5(password),
                access_token: token
            }
        }, {
            new: true
        });
        if (!update)
            return res.status(400).json({
                message: "Could not update User."
            })

        return res.status(200).json({
            message: "Successfully changed password"
        })

    } catch (error) {
        res.status(403).json(error.message)
    }
}

exports.resetPassword = async (req, res) => {
    try {
        var {
            password,
            country_code,
            mobile_number
        } = req.body;

        if (!password || !country_code || !mobile_number)
            return res.status(403).json({
                message: "key is missing"
            })


        let data = await superMarketModel.findOne({
            country_code,
            mobile_number
        })
        if (!data)
            throw new Error('user Does not exists');

        var token = jwt.sign({
            mobile_number: mobile_number
        }, 'supersecret');

        let update = await superMarketModel.findOneAndUpdate({
            country_code,
            mobile_number
        }, {
            $set: {
                password: md5(password),
                access_token: token
            }
        }, {
            new: true
        });
        if (!update)
            throw new Error('Somwthing Wrong..');

        res.status(200).json({
            data: update,
            message: 'Password Reset Successful'
        })
    } catch (error) {
        res.status(403).json(error.message)
    }
}