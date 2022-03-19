const {
    UserModel
} = require('../../models/user')
const {
    WalletModel
} = require('../../models/wallet')
let commonFunc = require("../../common/utility")
let md5 = require("md5");
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const moment = require('moment');

exports.addMoneyToWallet = async function (req, res) {
    let {
        amount
    } = req.body
    const schema = Joi.object({
        amount: Joi.string().required(),
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
    try {

        let wallet = await WalletModel.create({
            receiver_id: req.userData._id,
            sender_id: req.userData._id,
            payment_type: "Credit",
            user_id: req.userData._id,
            amount: amount,
            payment_on: moment.utc()
        })
        console.log(amount)

        await UserModel.findByIdAndUpdate(req.userData._id, {
            $inc: {
                wallet_amount: Number(amount)
            }
        })

        res.status(200).json({
            data: wallet,
            message: "Successfully Add Money"
        });
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            message: e.message
        });
    }
}




exports.sendMoney = async function (req, res) {
    let {
        sender_id,
        mobile_number,
        amount,
        transaction_type
    } = req.body
    const schema = Joi.object({
        sender_id: Joi.string().optional().allow(''),
        mobile_number: Joi.string().optional().allow(''),
        amount: Joi.string().required(),
        transaction_type: Joi.string().required()
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
    try {
        if (!mobile_number && !sender_id)
            return res.status(400).json({
                message: "Please send sender id or mobile number"
            });
        if (req.userData.wallet_amount < amount)
            return res.status(400).json({
                message: "Insufficient funds in your wallet"
            });

        let query = {
            _id: sender_id
        }
        if (mobile_number)
            query = {
                mobile_number: mobile_number
            }

        let receiver = await UserModel.findOneAndUpdate(query, {
            $inc: {
                wallet_amount: Number(amount)
            }
        })
        await WalletModel.create({
            receiver_id: receiver._id,
            sender_id: req.userData._id,
            user_id: receiver._id,
            payment_type: "Credit",
            amount: amount,
            transaction_type: transaction_type,
            payment_on: moment.utc()
        })

        await UserModel.findByIdAndUpdate(req.userData._id, {
            $inc: {
                wallet_amount: -Number(amount)
            }
        })
        await WalletModel.create({
            receiver_id: receiver._id,
            sender_id: req.userData._id,
            user_id: req.userData._id,
            payment_type: "Debit",
            amount: amount,
            transaction_type: req.body.transaction_type,
            payment_on: moment.utc()
        })

        res.status(200).json({
            message: "Successfully Transfer Money"
        });
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            message: e.message
        });
    }
}


exports.getWalletAmount = async function (req, res) {
    try {

        res.status(200).json({
            data: {
                wallet_amount: req.userData.wallet_amount
            },
            message: "Wallet amount"
        });
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            message: e.message
        });
    }
}


exports.searchNumber = async function (req, res) {
    try {
        req.body.mobile_number = req.body.mobile_number.trim()
        let search = req.body.mobile_number
        if (!/^\d+$/.test(req.body.mobile_number))
            search = new RegExp(req.body.mobile_number, "i")

        // let user = await UserModel.find({
        //     $or: [{
        //             mobile_number: search
        //         }, {
        //             first_name: search
        //         },
        //         {
        //             last_name: search
        //         }
        //     ]
        // })
        let user = await UserModel.aggregate([{
                $project: {
                    "name": {
                        $concat: ["$first_name", " ", "$last_name"]
                    },
                    "mobile_number": "$mobile_number",
                    "profile_image": "$profile_image",
                    "email": "$email",
                    "first_name": "$first_name",
                    "last_name": "$last_name"


                }
            },
            {
                $match: {
                    $or: [{
                        name: search
                    }, {
                        mobile_number: search
                    }, ]
                }
            }
        ])

        res.status(200).json({
            data: user,
            message: "user"
        });
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            message: e.message
        });
    }
}


exports.recentUsers = async function (req, res) {
    try {

        let friends = await WalletModel.find({
            $or: [{
                receiver_id: req.userData._id
            }, {
                sender_id: req.userData._id
            }]
        }).lean(true)
        let ids = []
        for (let i = 0; i < friends.length; i++) {
            if (friends[i].receiver_id.toString != req.userData._id.toString())
                ids.push(friends[i].receiver_id)
            if (friends[i].sender_id.toString != req.userData._id.toString())
                ids.push(friends[i].sender_id)
        }

        let users = await UserModel.find({
            _id: {
                $in: ids,
                $ne: req.userData._id
            }
        })

        res.status(200).json({
            data: users,
            message: "user"
        });
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            message: e.message
        });
    }
}


exports.getUserById = async function (req, res) {
    try {
        let user = await UserModel.findOne({
            _id: req.body.user_id
        })

        res.status(200).json({
            data: user,
            message: "user"
        });
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            message: e.message
        });
    }
}



exports.getWalletHistory = async function (req, res) {
    try {

        let query = {
            user_id: req.userData._id
        }
        if (req.query.transaction_type)
            query.transaction_type = req.query.transaction_type;


        let walletData = await WalletModel.find(query).populate('receiver_id', 'first_name last_name')
            .populate('sender_id', 'first_name last_name').sort({
                _id: -1
            })

        res.status(200).json({
            data: walletData,
            message: "wallet history"
        });
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            message: e.message
        });
    }
}