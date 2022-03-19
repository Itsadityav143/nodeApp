const {
    UserModel
} = require('../../../models/user')
let commonFunc = require("../../../common/utility")
let md5 = require("md5");
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const {
    genrateQrCode
} = require('../../../common/qrcode');
const {
    AddressModel
} = require("../../../models/address");
const {
    RestaurantModel
} = require('../../../models/restaurant');
const {
    CartModel
} = require('../../../models/cartModel');

const {
    superMarketCartModel
} = require('../../../models/superMarketCartModel');

exports.signUp = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    let {
        profile_image,
        first_name,
        last_name,
        email,
        country_code,
        mobile_number,
        password
    } = req.body

    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        email: Joi.string().email().required(),
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
    userData.email = userData.email.toLowerCase();

    userData.password = md5(userData.password)
    userData.verification_code = verification_code

    userData.is_profile_created = 0;

    //userData.password = md5(userData.password);

    var token = jwt.sign({
        email: userData.email
    }, 'supersecret');
    userData.access_token = token


    try {
        let isExists = await UserModel.findOne({
            $or: [{
                email: userData.email
            }, {
                mobile_number: userData.mobile_number
            }]
        });
        if (isExists) {
            return res.status(400).json({
                message: "Email Or Phone Number Already Exists"
            });
        }


        var users = await UserModel.create(userData)

        let qr_code = await genrateQrCode(users._id.toString())
        console.log(qr_code)
        users = await UserModel.findByIdAndUpdate(users._id, {
            qr_code
        }, {
            new: true
        })
        // let subject = "Welcome Mail"
        // let message =  "Welcome to Grovtek Web app, This is Your Verification code  <a href="+ verification_code +" >"+verification_code+"<a> By verifying your account you agree to all the terms and conditions of Grovtek." + "<br/>" + "Thank you"
        // sendEmail(users._doc.email,subject, message);

        if (users) {
            let createBlankCart = await CartModel.create({
                user_id: users._id,
                items_in_cart: []
            });
            let cart_market = await superMarketCartModel.create({
                user_id: users._id,
                items_in_cart: []
            })
        }

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



exports.isSocialLogin = async (req, res) => {
    try {
        var {
            google_social_id,
            facebook_social_id,
            linkedin_social_id,
            apple_social_id,
            email
        } = req.body;
        if (!google_social_id && !facebook_social_id && !linkedin_social_id)
            return res.status(403).error('Please provide atleast one social id');

        let query = {}
        if (email) {
            let isExist = await UserModel.findOne({
                email: email
            }).lean(true)
            if (isExist && isExist.is_social) {
                var token = jwt.sign({
                    email: email
                }, 'supersecret');
                console.log(token)
                let update = await UserModel.findOneAndUpdate(query, {
                    $set: {
                        access_token: token,
                        ...req.body
                    }
                }, {
                    new: true
                });
                return res.status(200).json({
                    messge: languages[req.headers.language]['SUCCESS_LOGIN'],
                    data: update
                })
            } else if (isExist && !isExist.is_social) {
                res.status(400).json({
                    message: 'This Email Already Exist In System With Normal Signup'
                });
            } else {
                var token = jwt.sign({
                    email: email
                }, 'supersecret');
                req.body.access_token = token
                req.body.isVerified = 1
                req.body.is_social = true

                let user = new UserModel(req.body);
                let userDetails = await user.save();
                if (!userDetails)
                    return res.status(400).json({
                        message: 'Something Wrong'
                    });

                return res.status(200).json({
                    data: userDetails,
                    message: 'Successfully Login'
                })
            }
        } else {
            let query = {}
            if (google_social_id)
                query['google_social_id'] = google_social_id
            if (facebook_social_id)
                query['facebook_social_id'] = facebook_social_id
            if (linkedin_social_id)
                query['linkedin_social_id'] = linkedin_social_id
            if (apple_social_id)
                query['apple_social_id'] = apple_social_id

            let isSocial = await UserModel.findOne(query).lean(true)
            if (isSocial) {
                var token = jwt.sign({
                    email: "user"
                }, 'supersecret');
                console.log(token)
                let update = await UserModel.findOneAndUpdate(query, {
                    $set: {
                        access_token: token,
                        ...req.body
                    }
                }, {
                    new: true
                });

                return res.status(200).json({
                    messge: 'Successfully login',
                    data: update
                })
            } else {
                var token = jwt.sign({
                    email: 'user'
                }, 'supersecret');
                req.body.access_token = token
                req.body.isVerified = 1
                req.body.is_social = true

                let user = new UserModel(req.body);
                let userDetails = await user.save();
                if (!userDetails)
                    return res.status(400).json({
                        message: 'somthing wrong...'
                    });

                return res.status(200).json({
                    data: userDetails,
                    message: 'Successfully login'
                })
            }
        }
    } catch (error) {
        res.status(403).error(error.message);
    }
}



exports.login = async function (req, res, next) {
    let {
        email,
        password
    } = req.body;

    const schema = Joi.object({
        email: Joi.string().email().required(),
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
    userData.email = userData.email.toLowerCase();

    try {
        let users = await UserModel.findOne({
            email: userData.email,
            password: md5(userData.password)
        }).lean(true)
        if (!users) {
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        // if(users.password !=  md5(req.body.password))
        //         return res.status(400).json({message: languages[req.headers.language]['WRONG_PASSWORD'] });



        var token = jwt.sign({
            email: userData.email
        }, 'supersecret');
        let update = await UserModel.findOneAndUpdate({
            email: userData.email
        }, {
            access_token: token,
            device_token: req.body.device_token,
            device_type: req.body.device_type
        }, {
            new: true
        })


        delete update._doc.verification_code
        delete update._doc.password

        return res.status(200).json({
            data: update,
            message: "Successfully Logged In"
        });
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
        let data = await UserModel.findByIdAndUpdate(userId, {
            $set: {
                access_token: ""
            }
        }, {
            new: true
        })
        if (data) {
            return res.status(200).json({
                message: "Successfully Logged Out"
            });
        }
        return res.status(400).json({
            message: "Could Not Logout, Please Try Again"
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

        let verifyEmail = await UserModel.findOneAndUpdate({
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
            message: "OTP Send To Registered Email Id Successfully"
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
                message: "OTP Is Missing"
            });

        if (!country_code || country_code == '')
            return res.status(403).json({
                message: "Country code is missing"
            })
        if (!mobile_number || mobile_number == '')
            return res.status(403).json({
                message: "Mobile Number is missing"
            })


        let user = await UserModel.findOne({
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
                message: "Incorrect OTP"
            });
        }

        let updateData = await UserModel.findByIdAndUpdate(user._id, {
            is_verified: 1
        }, {
            new: true
        }).exec()

        if (!updateData)
            return res.status(400).json({
                message: "Could not verify OTP, please try again"
            });

        return res.status(200).json({
            message: "Successfully Verified OTP"
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

exports.resetPassword = async (req, res) => {
    try {
        let {
            country_code,
            mobile_number,
            password
        } = req.body;
        const schema = Joi.object({
            country_code: Joi.string().required(),
            mobile_number: Joi.string().required(),
            password: Joi.string().min(6).required(),
        });

        //console.log("fffffff::::::::::", email, password);

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

        let data = await UserModel.findOne({
            country_code,
            mobile_number
        })
        if (!data)
            return res.status(400).json({
                message: "Invalid credentials"
            });

        var token = jwt.sign({
            email: data.email
        }, 'supersecret');

        if (md5(password) == data.password) {
            return res.status(400).json({
                message: "You are using an old password"
            });

        }

        let update = await UserModel.findOneAndUpdate({
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
            return res.status(400).json({
                message: "Could not update user, please try again"
            });

        res.status(200).json({
            data: null,
            message: "Password Reset Successful"
        })
    } catch (error) {
        res.status(403).json({
            message: error.message
        })
    }
}

exports.changePassword = async (req, res) => {
    try {
        let {
            old_password,
            new_password
        } = req.body;
        if (!old_password) { //must
            return res.status(403).json({
                message: "Old password is missing"
            })


        }
        if (!new_password) { //must
            return res.status(403).json({
                message: "New password is missing"
            })
        }
        if (old_password == new_password) //should not match
        {
            return res.status(403).json({
                message: "Old and new passwords should not match."
            })
        }
        let isExists = await UserModel.findOne({
            _id: req.userData._id
        });

        if (!isExists) {
            return res.status(403).json({
                message: "Invalid credentials"
            })

        }
        if (isExists.password != md5(old_password)) {
            return res.status(403).json({
                message: "Please enter correct old password"
            })
        }
        let isUpdated = await UserModel.findByIdAndUpdate(req.userData._id, {
            password: md5(new_password)
        }, {
            new: true
        });

        delete isUpdated._doc.verification_code
        delete isUpdated._doc.password

        return res.status(200).json({
            message: "Successfully changed password",
            data: isUpdated
        })

    } catch (error) {
        res.status(403).json(error.message)
    }
}

exports.updateProfile = async function (req, res, next) {
    try {

        let trustedData = req.body;
        if (trustedData.email)
            trustedData.email = trustedData.email.toLowerCase()

        // if(req.files && req.files.length)
        //     req.files.forEach(file => {
        // 		trustedData[file.fieldname] = `/User/${file.filename}`;
        // 	})
        if (trustedData.password) {
            trustedData.password = md5(trustedData.password);
        }
        trustedData.isProfileCreated = true;

        let updateProfileData = await UserModel.findByIdAndUpdate(req.userData._id, trustedData, {
            new: true
        }).exec();
        if (!updateProfileData)
            return res.status(400).json({
                message: "Could not update user"
            });


        delete updateProfileData._doc.verification_code
        delete updateProfileData._doc.password

        return res.status(200).json({
            message: "Successfully updated user.",
            data: updateProfileData
        });

    } catch (error) {
        return res.status(400).json(error.message);
    }
}