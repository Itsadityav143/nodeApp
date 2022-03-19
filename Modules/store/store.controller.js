const {
    branchManagerModel
} = require("../../models/branchManager")
const {
    DeliveryModel
} = require("../../models/delivery");
const {
    driverModel
} = require("../../models/driver");
const {
    inventoryModel
} = require("../../models/inventory")
var ar = require('../../languages/ar.json')
var en = require('../../languages/en.json');
let commonFunc = require("../../common/utility")

const languages = {
    ar: ar,
    en: en

}
const {
    NotificationModel
} = require("../../models/Notification")
const {
    groceryDeliveryModel
} = require("../../models/groceryDelivery")

const {
    GroceryOrdersModel
} = require("../../models/groceryOrders");
const {
    UserModel
} = require("../../models/user");
const {
    json
} = require("body-parser");
const {
    superMarketModel
} = require("../../models/superMarketUser");

exports.get_inventory = async (req, res) => {
    try {

        let data = await inventoryModel.find({
            branch_id: req.userData.branch_id
        }).populate("product_id")
        return res.status(200).json({
            data: data,
            message: "success"
        })
    } catch (error) {
        return res.status(401).json({
            message: error.message
        })
    }
}

exports.get_inventory_by_barcode = async (req, res) => {
    try {

        let data = await inventoryModel.findOne({
            barcode_number: req.body.barcode_number
        }).populate("product_id")
        return res.status(200).json({
            data: data,
            message: "success"
        })

    } catch (error) {
        return res.status(401).json({
            message: error.message
        })
    }
}


exports.update_inventory = async (req, res) => {
    try {
        if (!req.body.inventory_id)
            return res.status(401).json({
                message: "inventory_id is missing"
            })

        let data = await inventoryModel.findByIdAndUpdate(req.body.inventory_id, req.body, {
            new: true
        })
        return res.status(200).json({
            data: data,
            message: "success"
        })
    } catch (error) {
        return res.status(401).json({
            message: error.message
        })
    }
}


exports.get_all_orders = async (req, res) => {
    try {
        let query = {
            store_id: req.userData.branch_id
        }
        if (req.query.status)
            query.order_status = req.query.status

        let orderd = await GroceryOrdersModel.find(query).sort({
            _id: -1
        }).populate('user_id').populate('address_id')


        return res.status(200).json({
            data: orderd,
            message: "success"
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

exports.order_accept_reject = async (req, res) => {
    try {

        let query = {
            order_status: req.body.status,

        }
        if (req.body.status === 'ACCPECTBYSTORE') {
            query.accepted_at = new Date()
        } else if (req.body.status === 'REJECTEDBYSTORE')
            query.rejection_reason = req.body.rejection_reason
        else
            return res.status(403).json({
                message: "status should be ACCPECTBYSTORE , REJECTEDBYSTORE"
            })

        let order = await GroceryOrdersModel.findByIdAndUpdate(req.body._id, query, {
            new: true
        })


        let user = await UserModel.findById(order.user_id)
        // user notify 
        let dynamic_sms = order.order_status == "ACCPECTBYSTORE" ? "Accpected" : "Rejected"

        let message = "Your order has been " + dynamic_sms + " By Store";
        let userinfo = {
            deviceToken: user.device_token,
            title: order.order_status == "ACCPECTBYSTORE" ? "Order Accpected By Store" : "Order Rejected By Store",
            message: message,
            order_id: order._id,
            type: "Order"
        }
        commonFunc.sendNotification(userinfo);
        let userobj = {
            notification_type: userinfo.type,
            notification_heading: "Order Accepted",
            order_id: order._id,
            user_id: user._id,
            title: order.order_status == "ACCPECTBYSTORE" ? "Order Accpected By Store" : "Order Rejected By Store",
            body: message,
        }
        await NotificationModel.create(userobj);

        let supermarket = await superMarketModel.findById(order.superMarket_id)
        // supermarket notify 
        message = "Order has been" + dynamic_sms + "By Store"
        let info = {
            deviceToken: supermarket.device_token,
            title: order.order_status == "ACCPECTBYSTORE" ? "Order Accpected By Store" : "Order Rejected By Store",
            message: message,
            order_id: order._id,
            type: "Order"
        }
        commonFunc.sendNotification(info);
        let obj = {
            notification_type: info.type,
            notification_heading: "Order Accepted",
            order_id: order._id,
            user_id: supermarket._id,
            title: order.order_status == "ACCPECTBYSTORE" ? "Order Accpected By Store" : "Order Rejected By Store",
            body: message,
        }
        await NotificationModel.create(obj);

        ///notification part end

        return res.status(200).json({
            data: order,
            message: "success"
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

exports.searchDriver = async (req, res) => {
    try {

        let data = await findDriver(req.body.order_id, 20000)
        if (data.status === 403)
            data = await findDriver(req.body.order_id, 25000)

        return res.status(data.status).json({
            message: data.message,
        });

    } catch (error) {
        res.status(403).error(error);
    }
}


async function findDriver(order_id) {
    let order = await GroceryOrdersModel.findById(order_id).populate('store_id').populate("user_id").populate("address_id").lean(true);
    console.log(order)
    console.log("lat long of store", order.store_id.long, order.store_id.lat);
    let drivers = await driverModel.aggregate([{
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [Number(order.store_id.long), Number(order.store_id.lat)]
                },
                distanceField: "location1",
                spherical: true
            },
        },
        // {
        // 	$match: {
        // 		duty: true
        // 	},
        // },
        {
            $addFields: {
                "distance_between": {
                    $subtract: [30000, "$location1"]
                }
            }
        },
        {
            $lookup: {
                from: 'groceryDelivery',
                let: {
                    "driverId": "$_id"
                },
                pipeline: [{
                    $match: {

                        $expr: {
                            $eq: ["$driver", "$$driverId"]
                        },
                        $or: [{
                                $expr: {
                                    $eq: ["$status", "ONTHEWAY"]
                                },
                            },
                            {
                                $expr: {
                                    $eq: ["$status", "ACCEPTED"]
                                },
                            },
                        ]
                    }
                }],
                as: 'isEngaged'
            }
        },
        {
            $addFields: {
                "isEngaged": {
                    $size: "$isEngaged"
                }
            }
        },
        {
            $match: {
                "distance_between": {
                    $gte: 0
                },
                "isEngaged": {
                    $lte: 0
                }
            }
        },
    ]);

    console.log("drivers found after accpet by store", drivers)

    if (!drivers.length) {
        return {
            status: 403,
            message: "No Driver Available At The Moment"
        }
    } else {
        for (let i = 0; i < drivers.length; i++) {
            await groceryDeliveryModel.create({
                order_details: order,
                groceryOrder: order._id,
                driver: drivers[i]._id,
                created_time: new Date()
            })

            let message = "you have a new delivery";
            let info = {
                deviceToken: drivers[i].device_token,
                title: "New Order",
                message: message,
                order_id: order._id,
                type: "Order"
            }
            commonFunc.sendNotification(info);


            let obj = {
                notification_type: info.type,
                notification_heading: "New Order",
                order_id: order._id,
                user_id: drivers[i]._id,
                title: "New Order",
                body: message,
            }
            await NotificationModel.create(obj);
        }
        return {
            status: 200,
            message: "Driver Find Successfully! Please Wait For Driver Acceptance"
        }
    }
}

exports.update_order_status = async (req, res) => {
    try {

        if (req.body.status != 'PACKED')
            return res.status(403).json({
                message: "status should be PACKED"
            })
        var order = await GroceryOrdersModel.findByIdAndUpdate(req.body._id, {
            order_status: req.body.status
        }, {
            new: true
        })

        let user = await UserModel.findById(order.user_id)
        // user notify 
        message = "Order Status Changed";
        let userinfo = {
            deviceToken: user.device_token,
            title: "Order Status Changed",
            message: message,
            order_id: order._id,
            type: "Order"
        }
        commonFunc.sendNotification(userinfo);
        let userobj = {
            notification_type: userinfo.type,
            notification_heading: "Order Status Changed",
            order_id: order._id,
            user_id: user._id,
            title: "Order Status Changed",
            body: message,
        }
        await NotificationModel.create(userobj);


        return res.status(200).json({
            data: order,
            message: "success"
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}




exports.getMyNotifications = async (req, res) => {
    try {
        let userId = req.userData._id;


        let n2 = await NotificationModel.find({
            user_id: userId
        }).sort({
            "createdAt": -1
        });
        let count = await NotificationModel.count({
            user_id: userId,
            is_read: false
        })

        res.status(200).json({
            message: languages[req.headers.language]['COMMON_SUCCESS'],
            unread_notifications_count: count,
            data: n2
        });



    } catch (error) {
        res.status(403).error(error.message);
    }
}

exports.markNotificationsAsRead = async (req, res) => {
    try {
        let userId = req.userData._id;
        let n1 = await NotificationModel.updateMany({
            user_id: userId
        }, {
            $set: {
                "is_read": true
            }
        });
        return res.status(200).json({
            message: "Notifications read successfully"

        });
    } catch (error) {
        res.status(403).error(error.message);
    }
}

exports.get_store_income = async (req, res) => {
    try {
        if (typeof req.query.dateObject == 'string')
            req.query.dateObject = JSON.parse(req.query.dateObject)

        let data = await GroceryOrdersModel.find({
            store_id: req.userData.branch_id
        }).lean(true)

        let GroceryOrders = await GroceryOrdersModel.find({
            store_id: req.userData.branch_id,
            order_status: "DELIVERED"
        }).lean(true)

        let total_revenue = 0
        for (i = 0; i < GroceryOrders.length; i++) {
            total_revenue += GroceryOrders[i].order_amount
        }
        if (req.query.dateObject) {
            data = await GroceryOrdersModel.find({
                store_id: req.userData.branch_id,
                createdAt: {
                    $gte: new Date(req.query.dateObject.from),
                    $lt: new Date(req.query.dateObject.to) //2012, 7, 15
                }
            }).lean(true)
        }
        return res.status(200).json({
            data: {
                total_revenue: total_revenue,
                orders: data
            },
            message: "success"
        })
    } catch (error) {
        return res.status(401).json({
            message: error.message
        })
    }
}