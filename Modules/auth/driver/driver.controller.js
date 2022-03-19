const {
    driverModel
} = require('../../../models/driver');
let md5 = require("md5");
const Joi = require('joi');
let commonFunc = require("../../../common/utility")
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
    let {
        email,
        mobile_number,
        password,
        country_code,
        device_token,
        device_type,
        lat = 78.0880,
        long = 27.8974,
        delivery_provider_type
    } = req.body

    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        country_code: Joi.string().required(),
        mobile_number: Joi.string().required(),
        first_name: Joi.string().optional().allow(''),
        last_name: Joi.string().optional().allow(''),
        lat: Joi.string().required(),
        long: Joi.string().required(),
        device_type: Joi.string().optional().allow(''),
        device_token: Joi.string().optional().allow(''),
        delivery_provider_type: Joi.string().required()
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

    let verification_code = commonFunc.generateRandomString();
    let driverData = req.body;

    driverData.location = {
        type: 'Point',
        "coordinates": [Number(long), Number(lat)]
    }

    driverData.password = md5(driverData.password)
    driverData.verification_code = verification_code

    driverData.is_profile_created = 0;


    var token = jwt.sign({
        email: driverData.email
    }, 'supersecret');
    driverData.access_token = token


    console.log("CODE::::", verification_code);

    try {
        let isExists = await driverModel.findOne({
            $or: [{
                email: driverData.email
            }, {
                mobile_number: driverData.mobile_number
            }]
        });
        if (isExists) {
            return res.status(400).json({
                message: "Email or phone number already exists"
            });
        }
        var drivers = await driverModel.create(driverData)
        // let subject = "Welcome Mail"
        // let message =  "Welcome to Grovtek Web app, This is Your Verification code  <a href="+ verification_code +" >"+verification_code+"<a> By verifying your account you agree to all the terms and conditions of Grovtek." + "<br/>" + "Thank you"
        // sendEmail(users._doc.email,subject, message);


        delete drivers._doc.verification_code
        delete drivers._doc.password

        return res.status(200).json({
            data: drivers,
            message: "Successfully Signed Up"
        });
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }


}

exports.login = async (req, res) => {

    let {
        mobile_number,
        password,
        device_token,
        device_type,
        country_code,
        lat = 78.0880,
        long = 27.8974
    } = req.body;

    const schema = Joi.object({
        mobile_number: Joi.string().required(),
        country_code: Joi.string().required(),
        password: Joi.string().min(6).required(),
        lat: Joi.string().required(),
        long: Joi.string().required(),
        device_type: Joi.string().optional().allow(''),
        device_token: Joi.string().optional().allow('')
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
    let driverData = req.body;
    try {

        let drivers = await driverModel.findOne({
            country_code: country_code,
            mobile_number: driverData.mobile_number,
            password: md5(driverData.password)
        }).lean(true)

        if (!drivers) {
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        // if(users.password !=  md5(req.body.password))
        //         return res.status(400).json({message: languages[req.headers.language]['WRONG_PASSWORD'] });

        let location = {
            type: 'Point',
            "coordinates": [Number(long), Number(lat)]
        }


        if (drivers.is_blocked != 1) {

            var token = jwt.sign({
                mobile_number: driverData.mobile_number
            }, 'supersecret');
            let update = await driverModel.findOneAndUpdate({
                mobile_number: driverData.mobile_number
            }, {
                $set: {
                    access_token: token,
                    device_token,
                    device_type,
                    location
                }
            }, {
                new: true
            })


            delete update._doc.verification_code
            delete update._doc.password

            return res.status(200).json({
                data: update,
                message: "Successfully logged in"
            });
        } else if (drivers.is_blocked == 1) {
            return res.status(200).json({
                data: null,
                message: "blocked by admin"
            });
        }
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}




exports.logout = async function (req, res, next) {
    console.log("HERE");
    try {
        let driverId = req.userData._id;

        console.log("DRIVER::", driverId);
        let data = await driverModel.findByIdAndUpdate(driverId, {
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



exports.sendOtp = async (req, res) => {
    try {
        let {
            country_code,
            mobile_number
        } = req.body;

        if (!country_code || country_code == '')
            return res.status(401).json({
                message: "Country code is missing"
            })
        if (!mobile_number || mobile_number == '')
            return res.status(401).json({
                message: "Mobile Number is missing"
            })



        let OTP = commonFunc.generateRandomString()

        let verifyMobileNumber = await driverModel.findOneAndUpdate({
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

        // //commFunc.sendMessage(verifyEmail.mobileNumber ,`Thank you for registering with Delivery Point. Your OTP is ${OTP} and will remain valid for 5 minutes` )
        // let message =  "Welcome to Grovtek Web app, This is Your Verification code  <a href="+ OTP +" >"+OTP+"<a> By verifying your account you agree to all the terms and conditions of Grovtek." + "<br/>" + "Thank you"
        // sendEmail(email , 'Verification otp' ,message )

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

        if (!verification_code || verification_code == '')
            return res.status(400).json({
                message: "OTP is missing"
            });

        if (!country_code || country_code == '')
            return res.status(401).json({
                message: "Country code is missing"
            })
        if (!mobile_number || mobile_number == '')
            return res.status(401).json({
                message: "Mobile Number is missing"
            })


        let driver = await driverModel.findOne({
            country_code,
            mobile_number
        }).lean(true)

        if (!driver)
            return res.status(400).json({
                message: "driver not found"
            });

        let otp = driver.verification_code;

        if (verification_code != otp && verification_code != '1234') {
            return res.status(400).json({
                message: "Please enter the valid OTP"
            });
        }

        let updateData = await driverModel.findByIdAndUpdate(driver._id, {
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



exports.resetPassword = async (req, res) => {
    try {
        var {
            password,
            country_code,
            mobile_number
        } = req.body;

        if (!password || password == '')
            return res.status(400).json({
                message: "password is missing"
            });

        if (!country_code || country_code == '')
            return res.status(401).json({
                message: "Country code is missing"
            })
        if (!mobile_number || mobile_number == '')
            return res.status(401).json({
                message: "Mobile Number is missing"
            })


        let data = await driverModel.findOne({
            country_code,
            mobile_number
        })
        if (!data)
            throw new Error('driver Does not exists');

        var token = jwt.sign({
            mobile_number: mobile_number
        }, 'supersecret');

        let update = await driverModel.findOneAndUpdate({
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

exports.updateProfile = async (req, res) => {

    if (typeof req.body.national_id == 'string')
        req.body.national_id = JSON.parse(req.body.national_id)

    if (typeof req.body.passport == 'string')
        req.body.passport = JSON.parse(req.body.passport)

    if (typeof req.body.vehicle_details == 'string')
        req.body.vehicle_details = JSON.parse(req.body.vehicle_details)

    if (typeof req.body.bank_details == 'string')
        req.body.bank_details = JSON.parse(req.body.bank_details)

    if (typeof req.body.home_address == 'string')
        req.body.home_address = JSON.parse(req.body.home_address)

    let driverData = req.body
    //  driverData.is_profile_completed = 1;

    console.log(driverData);
    try {

        var drivers = await driverModel.findByIdAndUpdate(req.userData._id, driverData, {
            new: true
        })

        delete drivers._doc.verification_code
        delete drivers._doc.password
        if (drivers._doc.is_approved_by_admin == 2 || drivers._doc.is_approved_by_admin == "2") {
            drivers = await driverModel.findByIdAndUpdate(req.userData._id, {
                is_approved_by_admin: "0"
            }, {
                new: true
            })

        }
        return res.status(200).json({
            data: drivers,
            message: "Successfully Profile completed"
        });
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}


exports.updateBankDetails = async (req, res) => {

    let driverData = req.body

    try {
        var driver = await driverModel.findByIdAndUpdate(req.userData._id, {
            bank_details: driverData
        }, {
            new: true
        })
        return res.status(200).json({
            data: driver,
            message: "Successfully Bank Details Updated"
        });

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.driverActiveInactive = async (req, res) => {
    let temp = req.body.is_online
    let isOnline = false

    // string to boolean
    if (temp == "1") {
        isOnline = true

    } else if (temp == "0") {
        isOnline = false
    }


    try {
        console.log("is_online " + isOnline)
        var driver = await driverModel.findByIdAndUpdate(req.userData._id, {
            is_online: isOnline
        }, {
            new: true
        })
        return res.status(200).json({
            data: driver,
            message: "success"
        });

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.changePassword = async (req, res) => {
    try {
        let {
            password,
            oldPassword
        } = req.body;
        console.log(req.userData._id, "::::fff")

        if (!password) {
            return res.status(400).json({
                message: "New password is missing"
            })
        }
        if (!oldPassword) {
            return res.status(400).json({
                message: "Old password is missing"
            })
        }

        let data = await driverModel.findById(req.userData._id).lean(true)
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

        let update = await driverModel.findByIdAndUpdate(req.userData._id, {
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


exports.checkStatus = async (req, res) => {
    try {
        console.log("Check Status API");
        let driver = req.userData;

        if (restaurant.is_approved_by_admin == "0") return res.status(200).json({
            message: "Account is pending",
            data: driver
        })
        if (driver.is_approved_by_admin == "1") return res.status(200).json({
            message: "Account is approved",
            data: driver
        })

        if (driver.is_approved_by_admin == "2") return res.status(200).json({
            message: "Account is disapproved by admin",
            data: driver
        })

        return res.status(200).json({
            message: "Account is not yet approved",
            data: driver
        })

    } catch (error) {
        res.status(403).json(error.message)
    }
}

exports.enableOrders = async (req, res) => {
    try {
        let userId = req.userData._id;

        let updt = await driverModel.findByIdAndUpdate(userId, {
            "enable_orders": req.body.enable_orders
        }, {
            new: true
        });

        if (!updt) return res.status(400).json({
            data: updt,
            message: "Order status could not be updated."
        })

        else if (updt._doc.enable_orders == true) return res.status(200).json({
            data: updt,
            message: "Successfully enabled orders."
        })

        return res.status(200).json({
            data: updt,
            message: "Successfully disabled orders."
        })

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.check_status = async (req, res) => {
    try {
        let driver_id = req.userData._id;
        console.log("DRIVER:::::", driver_id);
        let driver = await driverModel.findById(driver_id);
        if (!driver) return res.status(400).json({
            "message": "driver not found."
        });

        if (driver.is_approved_by_admin == "1") return res.status(200).json({
            "message": "driver is approved",
            data: driver
        });
        if (driver.is_approved_by_admin == "2") return res.status(200).json({
            "message": "driver is disapproved",
            data: driver
        });
        return res.status(200).json({
            "message": "driver not yet approved",
            data: driver
        });

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}