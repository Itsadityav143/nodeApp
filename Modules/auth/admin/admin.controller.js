const {
    adminModel
} = require('../../../models/admin');

exports.login = async function (req, res, next) {
    let {
        email,
        password,
        device_type,
        device_token
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


    console.log(userData);
    try {
        let users = await adminModel.findOne({
            email: userData.email,
            password: md5(req.body.password)
        });

        console.log("A::::::, ", userData, "llll:::::::::", md5(req.body.password));
        if (!users) {
            return res.status(403).json({
                message: "Incorrect email or password"
            });
        }
        // if(users.isProfileCreated == false){
        //     return res.status(400).json({message: "Please complete your profile before logging in" });
        // }
        var token = jwt.sign({
            email: userData.email
        }, 'supersecret');
        let update = await adminModel.findOneAndUpdate({
            email: userData.email
        }, {
            $set: {
                access_token: token,
                device_type,
                device_token
            }
        }, {
            new: true
        })

        //    delete update._doc.verificationCode
        delete users.password

        return res.status(200).json({
            data: update,
            message: "Successfully logged in"
        });
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        res.status(200).json({
            message: "We have sent you a mail",
            response: null
        })
    } catch (error) {
        res.status(403).error(error.message);
    }
}

exports.changePassword = async (req, res) => {
    try {
        let {
            oldPassword,
            newPassword,
            email
        } = req.body;

        if (!oldPassword) { //must
            return res.status(403).json({
                message: "old password is missing"
            })
        }
        if (!newPassword) { //must
            return res.status(403).json({
                message: "new password is missing"
            })
        }
        if (oldPassword == newPassword) //should not match
        {
            return res.status(403).json({
                message: "old password and new password should not match"
            })
        }


        let admin = await adminModel.findOne({
            email: email
        })

        if (!admin) {
            return res.status(403).json({
                message: "email not found",
            })
        }
        if (admin.password == md5(oldPassword)) {
            let isUpdated = await adminModel.findByIdAndUpdate({
                _id: admin.id
            }, {
                password: md5(newPassword)
            })
            //delete isUpdated._doc.verificationCode
            delete isUpdated._doc.password
            return res.status(200).json({
                message: "Successfully Changed",
                data: isUpdated
            })
        } else
            return res.status(403).json({
                message: "Incorrect Password",
            })

    } catch (error) {
        res.status(403).json(error.message)
    }
}