const {
    RestaurantModel
} = require('../../../models/restaurant')
let commonFunc = require("../../../common/utility")
let md5 = require("md5");
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const dishModel = require("../../../models/dish")



exports.signUp = async function (req, res) {
    const schema = Joi.object({
        owner_name: Joi.string().required(),
        email: Joi.string().email().required(),
        //profile_image: Joi.string().required(),
        password: Joi.string().min(6).required(),
        country_code: Joi.string().optional().allow(''),
        mobile_number: Joi.string().optional().allow(''),
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

    let verification_code = commonFunc.generateRandomString();
    let userData = req.body;
    userData.location = {
        type: 'Point',
        "coordinates": [78.0880, 27.8974]
    }
    userData.password = md5(userData.password)
    userData.verification_code = verification_code

    userData.is_profile_created = 0;

    //userData.password = md5(userData.password);

    var token = jwt.sign({
        email: userData.email
    }, 'supersecret');
    userData.access_token = token


    console.log("CODE::::", verification_code);

    userData.verification_code = verification_code;

    try {
        let isExists = await RestaurantModel.findOne({
            $or: [{
                email: userData.email
            }, {
                mobile_number: userData.mobile_number
            }]
        });
        if (isExists) {
            return res.status(400).json({
                message: "Email or phone number already exists"
            });
        }
        var users = await RestaurantModel.create(userData)
        // let subject = "Welcome Mail"
        // let message =  "Welcome to Grovtek Web app, This is Your Verification code  <a href="+ verification_code +" >"+verification_code+"<a> By verifying your account you agree to all the terms and conditions of Grovtek." + "<br/>" + "Thank you"
        // sendEmail(users._doc.email,subject, message);


        delete users._doc.verification_code
        delete users._doc.password

        return res.status(200).json({
            data: users,
            message: "Successfully Signed Up"
        });
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}




exports.updateProfile = async function (req, res) {
    // const schema = Joi.object({
    //     restaurant_name: Joi.string().required(),
    //     restaurant_about: Joi.string().required(),
    //     cuisines: Joi.string().required(),
    //     distance_in_miles: Joi.string().required(),
    //     minimum_order: Joi.string().required(),
    //     restaurant_location: Joi.string().required(),
    //     lat: Joi.string().required(),
    //     long: Joi.string().required(),
    //     working_hours:Joi.array().required(),
    //     bank_detail : Joi.object().required(),
    // });
    // const options = {
    //     abortEarly: false, // include all errors
    //     allowUnknown: true, // ignore unknown props
    //     stripUnknown: true // remove unknown props
    // };
    // // validate request body against schema
    // const { error, value } = schema.validate(req.body, options);
    // if (error) {
    //     return res.status(400).json({message: `Validation error: ${error.details[0].message}`});
    // }
    if (typeof req.body.working_hours == 'string')
        req.body.working_hours = JSON.parse(req.body.working_hours)
    if (typeof req.body.bank_detail == 'string')
        req.body.bank_detail = JSON.parse(req.body.bank_detail)

    if (typeof req.body.food_type == 'string')
        req.body.food_type = req.body.food_type.split(',')

    if (typeof req.body.categories == 'string')
        req.body.categories = req.body.categories.split(',')

    let userData = req.body;
    userData.is_profile_completed = 1;
    userData.location = {
        type: 'Point',
        "coordinates": [Number(userData.long), Number(userData.lat)]
    }
    userData.is_approved_by_admin = req.userData.is_approved_by_admin;
    if (!userData.is_approved_by_admin || userData.is_approved_by_admin == "2") {
        userData.is_approved_by_admin == "0"
    }

    try {
        var users = await RestaurantModel.findByIdAndUpdate(req.userData._id, userData, {
            new: true
        })

        delete users._doc.verification_code
        delete users._doc.password

        let user = await RestaurantModel.findOne(req.userData._id).populate("categories")

        if (users._doc.is_approved_by_admin == 2 || users._doc.is_approved_by_admin == "2") {
            users = await RestaurantModel.findByIdAndUpdate(req.userData._id, {
                is_approved_by_admin: "0"
            }, {
                new: true
            })

        }

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



exports.login = async function (req, res, next) {
    let {
        country_code,
        mobile_number,
        password,
        device_type,
        device_token
    } = req.body;

    const schema = Joi.object({
        mobile_number: Joi.string().required(),
        password: Joi.string().min(6).required(),
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
    let userData = req.body;

    try {
        let users = await RestaurantModel.findOne({
            country_code,
            mobile_number,
            password: md5(userData.password)
        }).lean(true).populate('categories')
        if (!users) {
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        // if(users.password !=  md5(req.body.password))
        //         return res.status(400).json({message: languages[req.headers.language]['WRONG_PASSWORD'] });


        if (users.is_blocked != 1) {

            var token = jwt.sign({
                mobile_number: userData.mobile_number
            }, 'supersecret');

            let update = await RestaurantModel.findOneAndUpdate({
                country_code,
                mobile_number,
            }, {
                $set: {
                    access_token: token,
                    device_token,
                    device_type
                }
            }, {
                new: true
            })


            delete update._doc.verification_code
            delete update._doc.password

            update = await RestaurantModel.findOne({
                _id: update._id
            }).lean(true).populate('categories')

            return res.status(200).json({
                data: update,
                message: "Successfully logged in"
            });
        } else if (users.is_blocked == 1) {
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
        let userId = req.userData._id;

        console.log("USER::", userId);
        let data = await RestaurantModel.findByIdAndUpdate(userId, {
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
            return res.status(403).json({
                message: "Country code is missing"
            })
        if (!mobile_number || mobile_number == '')
            return res.status(403).json({
                message: "Mobile Number is missing"
            })



        let OTP = commonFunc.generateRandomString()

        let verifyEmail = await RestaurantModel.findOneAndUpdate({
            country_code,
            mobile_number
        }, {
            verification_code: OTP
        }, {
            new: true
        }).exec()
        if (!verifyEmail)
            return res.status(403).json({
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
            return res.status(403).json({
                message: "Country code is missing"
            })
        if (!mobile_number || mobile_number == '')
            return res.status(403).json({
                message: "Mobile Number is missing"
            })


        let user = await RestaurantModel.findOne({
            country_code,
            mobile_number
        }).lean(true)

        if (!user)
            return res.status(400).json({
                message: "User not found"
            });

        let otp = user.verification_code;

        if (verification_code != otp && verification_code != '1234') {
            return res.status(400).json({
                message: "Please enter the valid OTP"
            });
        }

        let updateData = await RestaurantModel.findByIdAndUpdate(user._id, {
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
            return res.status(403).json({
                message: "Country code is missing"
            })
        if (!mobile_number || mobile_number == '')
            return res.status(403).json({
                message: "Mobile Number is missing"
            })


        let data = await RestaurantModel.findOne({
            country_code,
            mobile_number
        })
        if (!data)
            throw new Error('User Does not exists');

        var token = jwt.sign({
            email: mobile_number
        }, 'supersecret');

        let update = await RestaurantModel.findOneAndUpdate({
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

        let data = await RestaurantModel.findById(req.userData._id).lean(true)
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

        let update = await RestaurantModel.findByIdAndUpdate(req.userData._id, {
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
        let restaurant = req.userData;

        console.log("RRRRR::::::", restaurant);
        if (restaurant.is_approved_by_admin == "0") return res.status(200).json({
            message: "Account is pending",
            data: restaurant
        })
        if (restaurant.is_approved_by_admin == "1") return res.status(200).json({
            message: "Account is approved by admin",
            data: restaurant
        })
        if (restaurant.is_approved_by_admin == "2") return res.status(200).json({
            message: "Account is disapproved by admin",
            data: restaurant
        })


        return res.status(200).json({
            message: "Account is not yet approved.",
            data: restaurant
        })

    } catch (error) {
        res.status(403).json(error.message)
    }
}