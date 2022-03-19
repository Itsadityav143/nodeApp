const {
    MenuModel
} = require("../../models/menu");
const {
    UserModel
} = require("../../models/user");
const {
    dishModel
} = require("../../models/dish");
const {
    NotificationModel
} = require("../../models/Notification")
var ar = require('../../languages/ar.json')
var en = require('../../languages/en.json');

const languages = {
    ar: ar,
    en: en

}
const {
        restaurantRatingModel
        } = require("../../models/restaurantRating");
const {
    offerModel
} = require("../../models/offer");
const {
    RestaurantModel
} = require('../../models/restaurant');

const {
    BannerModel
} = require('../../models/promotion')

let {
    DeliveryModel
} = require("../../models/delivery");
let {
    OrderModel
} = require("../../models/orderModel");
const {
    driverModel
} = require('../../models/driver');

exports.createMenu = async (req, res) => {
    try {
        let userId = req.userData._id;

        let is_exist = await MenuModel.findOne({
            menu_title: req.body.menu_title,
            restaurant_id: userId
        })
        if (is_exist)
            return res.status(200).json({
                message: is_exist.menu_title + "Already Exist"
            })
        let menuCreate = await MenuModel.create({
            "menu_title": req.body.menu_title,
            "menu_image": req.body.menu_image,
            "restaurant_id": userId
        });

        return res.status(200).json({
            data: menuCreate,
            message: "Successful."
        })

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.updateMenu = async (req, res) => {
    try {
        let userId = req.userData._id;

        let updt = await MenuModel.findByIdAndUpdate(req.body.menu_id, req.body, {
            new: true
        })

        return res.status(200).json({
            data: updt,
            message: "Successful."
        })

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.removeMenu = async (req, res) => {
    try {
        let userId = req.userData._id;

        let updt = await MenuModel.findByIdAndRemove(req.body.menu_id);

        return res.status(200).json({
            data: updt,
            message: "Successful."
        })

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.getMenuList = async (req, res) => {
    try {
        let userId = req.userData._id;

        let updt = await MenuModel.find({
            "restaurant_id": userId
        });

        return res.status(200).json({
            data: updt,
            message: "Successful."
        })

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}





//***********************dish management**** *//


exports.add_dish = async (req, res) => {
    try {
        if (typeof req.body.dish_images == 'string')
            req.body.dish_images = JSON.parse(req.body.dish_images)

        if (typeof req.body.ingredient == 'string')
            req.body.ingredient = JSON.parse(req.body.ingredient)

        if (typeof req.body.search_keywords == 'string')
            req.body.search_keywords = JSON.parse(req.body.search_keywords)

        let temp = await dishModel.findOne({
            dish_name: req.body.dish_name,
            menu_id: req.body.menu_id,
            restaurant_id: req.body.restaurant_id,
        })
        if (temp) return res.status(403).json({
            message: "Dish Already Exist"
        })
        else {
            let dishData = await dishModel.create(req.body)
            if (dishData) {
                return res.status(200).json({
                    data: dishData,
                    message: "Success"
                })
            } else
                return res.status(403).json({
                    message: "Something Is Missing"
                })

        }
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}


exports.update_dish = async (req, res) => {
    try {

        if (typeof req.body.dish_images == 'string')
            req.body.dish_images = JSON.parse(req.body.dish_images)

        if (typeof req.body.ingredient == 'string')
            req.body.ingredient = JSON.parse(req.body.ingredient)

        if (typeof req.body.search_keywords == 'string')
            req.body.search_keywords = JSON.parse(req.body.search_keywords)

        let dishData = await dishModel.findOneAndUpdate({
            _id: req.body._id
        }, req.body, {
            new: true
        })
        if (dishData) return res.status(200).json({
            data: dishData,
            message: "Success"
        })
        else return res.status(403).json({
            message: "Something is wrong"
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


exports.remove_dish = async (req, res) => {
    try {
        let dishData = await dishModel.findOneAndDelete({
            _id: req.body._id
        })
        if (dishData) return res.status(200).json({
            data: dishData,
            message: "deleted"
        })
        else return res.status(403).json({
            message: "not found"
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

exports.get_all_dish = async (req, res) => {
    try {
        let query = {
            restaurant_id: req.userData._id
        }
        if (req.query.menu_id)
            query.menu_id = req.query.menu_id

        let dishData = await dishModel.find(query).populate('menu_id').populate('restaurant_id')

        if (dishData) return res.status(200).json({
            data: dishData,
            message: "success"
        })
        else return res.status(403).json({
            message: "Empty"
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

exports.dish_status = async (req, res) => {
    try {
        let data = await dishModel.findByIdAndUpdate({
            _id: req.body._id
        }, {
            dish_status: req.body.dish_status
        }, {
            new: true
        })
        if (data) {
            return res.status(200).json({
                data: data,
                message: "success"
            })

        } else return res.status(403).json({
            message: "not found"
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

//*************************offer management*************** */

exports.add_offer = async (req, res) => {
    try {
        let exist = await offerModel.findOne({
            offer_name: req.body.offer_name,
            restaurant_id: req.userData._id
        })
        if (typeof req.body.offer_validity == 'string')
            req.body.offer_validity = JSON.parse(req.body.offer_validity)

        if (!exist) {
            req.body.restaurant_id = req.userData._id
            req.body.created_by = "RESTAURANT"
            let offer = await offerModel.create(req.body)

            let offer_count = await offerModel.count({
                restaurant_id: req.userData._id
            })

            await RestaurantModel.findByIdAndUpdate(req.userData._id, {
                offer_count
            })

            if (offer) return res.status(200).json({
                data: offer,
                message: "success"
            })
            else return res.status(403).json({
                message: "something is wrong"
            })
        } else return res.status(403).json({
            message: "Offer Already Exist"
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


exports.update_offer = async (req, res) => {
    try {
        if (typeof req.body.offer_validity == 'string')
            req.body.offer_validity = JSON.parse(req.body.offer_validity)

        let offer = await offerModel.findOneAndUpdate({
            _id: req.body._id
        },
            req.body, {
            new: true
        })
        if (offer) return res.status(200).json({
            data: offer,
            message: "updated"
        })
        else return res.status(403).json({
            message: "Not Found"
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


exports.delete_offer = async (req, res) => {
    try {
        let offer = await offerModel.findOneAndDelete({
            _id: req.body._id
        })
        if (offer) return res.status(200).json({
            data: offer,
            message: "Deleted"
        })
        else return res.status(403).json({
            message: "Not Found"
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


exports.get_offers = async (req, res) => {
    try {
        let query = {
            restaurant_id: req.userData._id
        }
        if (req.query.is_active)
            query.is_active = req.query.is_active
        let offer = await offerModel.find(query)
        if (offer) return res.status(200).json({
            data: offer,
            message: "success"
        })
        else return res.status(403).json({
            message: "Offer Not Found"
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}



exports.restaurant_on_off = async (req, res) => {
    try {

        let is_on = await MenuModel.find({
            restaurant_id: req.userData._id
        })
        console.log(is_on.length)
        if (is_on.length != 0) {
            let restro = await RestaurantModel.findOneAndUpdate({
                _id: req.userData._id
            }, {
                restaurant_on: req.body.restaurant_on
            }, {
                new: true
            })
            if (restro)
                return res.status(200).json({
                    data: restro,
                    message: "success"
                })
            return res.status(403).json({
                message: "not found"
            })
        }
        return res.status(403).json({
            message: "Please Add Menu Before On Restaurant"
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

exports.get_all_orders = async (req, res) => {
    try {
        let query = {
            restaurant_id: req.userData._id
        }
        if (req.query.status)
            query.order_status = req.query.status

        let orderd = await OrderModel.find(query).sort({
            _id: -1
        })


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
        if (req.body.status === 'ACCPECTBYRESTAURANT') {
            query.preparation_time = req.body.preparation_time
            query.accepted_at = new Date()
        } else if (req.body.status === 'REJECTEDBYRESTAURANT')
            query.rejection_reason = req.body.rejection_reason
        else
            return res.status(403).json({
                message: "status should be ACCPECTBYRESTAURANT , REJECTEDBYRESTAURANT"
            })
        let order = await OrderModel.findByIdAndUpdate(req.body._id, query, {
            new: true
        })

        await findDriver(order._id)
        // user notify
        let user = await UserModel.findById(order.user_id).lean(true)
        let dynamis_sms = order.order_status == "ACCPECTBYRESTAURANT" ? "Accpected" : "Rejected"
        message = "Your order has been" + dynamis_sms + " By Restaurant";
        let userinfo = {
            deviceToken: user.device_token,
            title: order.order_status == "ACCPECTBYRESTAURANT" ? "Order Accpected By Restaurant" : "Order Rejected By Restaurant",
            message: message,
            order_id: order._id,
            type: "Order"
        }
        commonFunc.sendNotification(userinfo);
        let userobj = {
            notification_type: userinfo.type,
            notification_heading: "Order " + dynamis_sms,
            order_id: order._id,
            user_id: user._id,
            title: order.order_status == "ACCPECTBYRESTAURANT" ? "Order Accpected By Restaurant" : "Order Rejected By Restaurant",
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
exports.update_order_status = async (req, res) => {
    try {

        if (req.body.status === 'READY') {
            var order = await OrderModel.findByIdAndUpdate(req.body._id, {
                order_status: req.body.status
            }, {
                new: true
            })
        } else
            return res.status(403).json({
                message: "status should be READY"
            })


        let user = await UserModel.findById(order.user_id).lean(true)

        let message = "Order status has been changed to" + req.body.status;
        let info = {
            deviceToken: user.device_token,
            title: "Order Status Changed",
            message: message,
            order_id: order._id,
            type: "Order"
        }
        commonFunc.sendNotification(info);


        let obj = {
            notification_type: info.type,
            notification_heading: "Order Status Changed",
            order_id: order._id,
            user_id: user._id,
            title: "Order Status Changed",
            body: message,
        }
        await NotificationModel.create(obj);

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







async function findDriver(order_id) {
    let order = await OrderModel.findById(order_id).populate('restaurant_id').populate("user_id").populate("address_id").lean(true);
    console.log("lat long of resturant", order.restaurant_id.long, order.restaurant_id.lat);
    let drivers = await driverModel.aggregate([{
        $geoNear: {
            near: {
                type: "Point",
                coordinates: [Number(order.restaurant_id.long), Number(order.restaurant_id.lat)]
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
            from: 'deliveries',
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

    console.log("drivers found after accpet by resturant", drivers)

    if (!drivers.length) {
        return {
            status: 403,
            message: "No Driver Available At The Moment"
        }
    } else {
        for (let i = 0; i < drivers.length; i++) {
            await DeliveryModel.create({
                order_details: order,
                order: order._id,
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




var cron = require('node-cron');

// cron.schedule('* * * * *', async () => {
//   console.log('running a task every minute');

//   let data = await OrderModel.update({ 
//       accepted_at : { $lte : new Date(new Date().setMinutes( new Date().getMinutes() - 8)) },
//       driver : null
//     },{
//         order_status : "ORDERDEXPIRED"
//     },{multi : true})

//     console.log('Expired Orders due to driver not found', data);

// });



cron.schedule('*/30 * * * * *', async () => {
    //console.log('running  every 30 second');
    let unAssingeOrders = await OrderModel.find({
        order_status: "ACCPECTBYRESTAURANT"
    })

    for (let i = 0; i < unAssingeOrders.length; i++) {
        console.log('unAssingeOrders ', unAssingeOrders[i]._id.toString());
        let isAnydeliveryInDb = await DeliveryModel.find({
            order: unAssingeOrders[i]._id,
            status: "PENDING"
        })
        if (!isAnydeliveryInDb.length) {
            console.log('againg try to assigne for order ', unAssingeOrders[i]._id.toString());
            findDriver(unAssingeOrders[i]._id)
        }
    }
});



//*************************promotion management*************** */

exports.create_promotion = async (req, res) => {
    try {
        if (typeof req.body.promotion_duration == 'string')
            req.body.promotion_duration = JSON.parse(req.body.promotion_duration)
        let promotionData = req.body
        promotionData.restaurant_id = req.userData._id

        if (!promotionData.promotion_title || !promotionData.offer || !promotionData.chargesForAMonth || !promotionData.ChargingFeature)
            return res.status(403).json({
                message: "key is missing"
            })
        let is_exist = await BannerModel.findOne({
            restaurant_id: req.userData._id,
            promotion_title: req.body.promotion_title
        })
        if (is_exist) return res.status(403).json({
            message: "Promotion Title Already Exist"
        })
        let data = await BannerModel.create(promotionData)

        let popu = await BannerModel.findOne({
            _id: data._id
        }).populate("offer")

        return res.status(200).json({
            data: popu,
            message: "success"
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

exports.update_promotion = async (req, res) => {
    try {
        if (typeof req.body.promotion_duration == 'string')
            req.body.promotion_duration = JSON.parse(req.body.promotion_duration)
        let promotionData = req.body

        let data = await BannerModel.findByIdAndUpdate(promotionData._id, promotionData, {
            new: true
        })
        data = await BannerModel.findById(promotionData._id).populate("offer")
        return res.status(200).json({
            data: data,
            message: "success"
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

exports.get_promotion = async (req, res) => {
    try {
        let data = await BannerModel.find({
            restaurant_id: req.userData._id
        }).sort({
            _id: -1
        }).populate("offer")

        return res.status(200).json({
            data: data,
            message: "success"
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

exports.delete_promotion = async (req, res) => {
    try {

        let data = await BannerModel.findByIdAndDelete(req.body._id)

        return res.status(200).json({
            data: data,
            message: "Deleted"
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


exports.get_revenue = async (req, res) => {
    try {
        if (typeof req.query.dateObject == 'string')
            req.query.dateObject = JSON.parse(req.query.dateObject)
        let restaurant = await RestaurantModel.findById(req.userData._id)
        let rating = await ratingOfRestaurant(req.userData._id)

        let orders = await OrderModel.find({
            restaurant_id: req.userData._id
        })
        let total_revenue = 0
        for (i = 0; i < orders.length; i++) {
            total_revenue += orders[i].order_amount
        }
        let query = {
            order_status: "DELIVERED"
        }
        if (req.query.dateObject) {
            query.createdAt = {
                $gte: new Date(req.query.dateObject.from),
                $lt: new Date(req.query.dateObject.to) //2012, 7, 15
            }
        }

        let delivered_order = await OrderModel.find(query)
        query.order_status = "CANCELLEDBYUSER"
        let cancelled_order = await OrderModel.find(query)
        query.order_status = {
            $ne: 'PENDING'
        }
        let total_order = await OrderModel.find(query)
        delete query['order_status']
        let total_review = await restaurantRatingModel.find(query)
        let positive_review = 0
        let negetive_review = 0
        for (j = 0; j < total_review.length; j++) {
            if (total_review.rate < 3) {
                positive_review += 1
            }
            if (total_review.rate >= 3) {
                negetive_review += 1
            }
        }


        let graphDbData = await OrderModel.aggregate([{
            $match: {
                restaurant_id: req.userData._id
            }
        }, {
            $addFields: {
                OrderMonth: {
                    $month: "$createdAt"
                }
            }
        },
        {
            $group: {
                _id: "$OrderMonth",
                total_sale: {
                    $sum: "$order_amount"
                },
                total_order: {
                    $sum: 1
                }
            }
        }
    ])

    let graphData = []

    for (let index = 1; index <= 12; index++) {
        let isExist = graphDbData.find((data) => data._id == index)
        graphData.push({
            OrderMonth: monthNames[index],
            total_sale: isExist ? isExist.total_sale : 0,
            total_order: isExist ? isExist.total_order : 0
        })
    }


        return res.status(200).json({
            data: {
                restaurant: restaurant,
                rating: rating,
                total_revenue: total_revenue,
                delivered_order: delivered_order.length,
                cancelled_order: cancelled_order.length,
                total_order: total_order.length,
                total_review: total_review.length,
                positive_review: positive_review,
                negetive_review: negetive_review ,
                graphData : graphData
            },
            message: "Success"
        })
    } catch (e) {
        res.status(403).error(e.message)
    }
}


async function ratingOfRestaurant(restaurant_id) {

    let sum_of_rating = 0
    let ratingData = await restaurantRatingModel.find({
        restaurant_id: restaurant_id
    })
    let total_rating_found = ratingData.length
    for (j = 0; j < total_rating_found; j++) {
        sum_of_rating += ratingData[j].rate
    }
    let rating = sum_of_rating / total_rating_found
    return rating
}
