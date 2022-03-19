let {
	DeliveryModel
} = require("../../models/delivery");

let {
	groceryDeliveryModel
} = require("../../models/groceryDelivery");
const {
	NotificationModel
} = require("../../models/Notification")
const {
	driverModel
} = require("../../models/driver");
const {
	UserModel
} = require("../../models/user");
const {
	superMarketModel
} = require("../../models/superMarketUser");
let {
	OrderModel
} = require("../../models/orderModel");
var ar = require('../../languages/ar.json')
var en = require('../../languages/en.json');
let commonFunc = require("../../common/utility")
const {
	RestaurantModel
} = require("../../models/restaurant");

const {
	branchManagerModel
} = require("../../models/branchManager");

const languages = {
	ar: ar,
	en: en

}
let {
	GroceryOrdersModel
} = require("../../models/groceryOrders");

exports.getOrders = async (req, res) => {
	try {
		let filter = req.query.filter;

		if (!filter) {
			return res.status(400).json({
				message: "Missing key filter in query"
			});
		}
		let myCurrentOrder = [];
		//////query order-types 0--> new 1---> ongoing 3-->past

		if (filter == "0") {
			myCurrentOrder = await DeliveryModel.find({
				"driver": req.userData._id,
				"status": 'PENDING'
			})

		}
		if (filter == "1") {
			myCurrentOrder = await DeliveryModel.find({
				"driver": req.userData._id,
				"status": {
					$in: ['ONTHEWAY']
				}
			});

		}
		if (filter == "2") {
			myCurrentOrder = await DeliveryModel.find({
				"driver": req.userData._id,
				"status": {
					$in: ['DELIVERED', 'NOTDELIVERED', 'RETURNED']
				}
			});

		}

		// let myCurrentOrder = await OrderModel.find({"driver_details._id": req.userData._id});
		if (!myCurrentOrder.length) {
			return res.status(400).json({
				message: "No Orders Found"
			});

		}
		console.log("my::::", myCurrentOrder);

		return res.status(200).json({
			message: "Orders Successfully Fetched.",
			data: myCurrentOrder
		});

	} catch (error) {
		res.status(403).error(error);
	}
}

exports.changeOrdersStatus = async (req, res) => {
	try {

		let delivery_id = req.body.delivery_id;
		let status = req.body.status;
		let delivery_found = await DeliveryModel.findById(delivery_id).lean(true)
		if (!delivery_found) return res.status(403).json({
			message: "Order Has Expired."
		});
		let update = {
			status: status
		}

		let updateDelivery = await DeliveryModel.findByIdAndUpdate(delivery_id, update, {
			new: true
		});

		let updatedOrder = await OrderModel.findOneAndUpdate({
			_id: delivery_found.order
		}, {
			order_status: status
		}, body, {
			new: true
		});


		// ********* notification 
		let user = await UserModel.findById(updateDelivery.order_details.user_id._id).lean(true)

		let message = "Order status has been changed to" + status;
		let info = {
			deviceToken: user.device_token,
			title: "Order Status Changed",
			message: message,
			order_id: updatedOrder._id,
			type: "Order"
		}
		commonFunc.sendNotification(info);


		let obj = {
			notification_type: info.type,
			notification_heading: "Order Status Changed",
			order_id: updatedOrder._id,
			user_id: user._id,
			title: "Order Status Changed",
			body: message,
		}
		await NotificationModel.create(obj);




		let Restaurant = await RestaurantModel.findById(updatedOrder.restaurant_id).lean(true)

		info = {
			deviceToken: Restaurant.device_token,
			title: "Order Status Changed",
			message: message,
			order_id: updatedOrder._id,
			type: "Order"
		}
		commonFunc.sendNotification(info);


		obj = {
			notification_type: info.type,
			notification_heading: "Order Status Changed",
			order_id: updatedOrder._id,
			user_id: Restaurant._id,
			title: "Order Status Changed",
			body: message,
		}
		await NotificationModel.create(obj);
		//notification

		res.status(200).json({
			message: "Successfully Changed Order Status",
			data: updatedOrder
		})

	} catch (error) {
		res.status(403).json(error.message)
	}
}
exports.acceptRejectOrder = async (req, res) => {
	try {
		let driver_id = req.userData._id;
		let delivery_id = req.body.delivery_id;
		let delivery_found = await DeliveryModel.findById(delivery_id).lean(true)
		if (!delivery_found) return res.status(403).json({
			message: "Order Has Expired."
		});

		if (req.body.status == "ACCEPTED") {
			let updateDelivery = await DeliveryModel.findByIdAndUpdate(delivery_id, {
				status: "ACCEPTED",
			}, {
				new: true
			});

			let updatedOrder = await OrderModel.findByIdAndUpdate(delivery_found.order, {
				order_status: "DRIVERASSIGNED",
				driver: driver_id
			}, {
				new: true
			});

			await DeliveryModel.remove({
				order: delivery_found.order,
				status: {
					$ne: 'ACCEPTED'
				}
			})


			// ********* notification 
			let user = await UserModel.findById(updateDelivery.order_details.user_id._id).lean(true)

			let message = "Driver Assigned to your order";
			let info = {
				deviceToken: user.device_token,
				title: "Driver Assigned",
				message: message,
				order_id: updatedOrder._id,
				type: "Order"
			}
			commonFunc.sendNotification(info);


			let obj = {
				notification_type: info.type,
				notification_heading: "Driver Assigned",
				order_id: updatedOrder._id,
				user_id: user._id,
				title: "Driver Assigned",
				body: message,
			}
			await NotificationModel.create(obj);




			let Restaurant = await RestaurantModel.findById(updatedOrder.restaurant_id).lean(true)

			info = {
				deviceToken: Restaurant.device_token,
				title: "Order Status Changed",
				message: message,
				order_id: updatedOrder._id,
				type: "Order"
			}
			commonFunc.sendNotification(info);


			obj = {
				notification_type: info.type,
				notification_heading: "Order Status Changed",
				order_id: updatedOrder._id,
				user_id: Restaurant._id,
				title: "Order Status Changed",
				body: message,
			}
			await NotificationModel.create(obj);

			//notification





		} else {
			await DeliveryModel.findByIdAndUpdate(delivery_id, {
				status: "REJECTED",
				rejection_reason: req.body.rejection_reason
			}, {
				new: true
			});
		}

		return res.status(200).json({
			message: "Successfully Accepted Delivery",
		});

	} catch (error) {
		res.status(403).json(error.message)
	}
}


exports.get_orders_store = async (req, res) => {
	try {
		let query = {
			driver: req.userData._id
		}
		if (req.query.status)
			query.status = req.query.status
		let orderd = await groceryDeliveryModel.find(query).sort({
			_id: -1
		}).populate("order")

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


exports.changeOrdersStatus_store = async (req, res) => {
	try {

		let delivery_id = req.body.delivery_id;
		let driver_id = req.userData._id;
		let status = req.body.status
		let update = {
			status: req.body.status,
			order_status: req.body.status
		}

		let updateDelivery = await groceryDeliveryModel.findByIdAndUpdate(delivery_id, update, {
			new: true
		});

		if (!updateDelivery) return res.status(400).json({
			message: "Could not update delivery."
		})


		let updatedOrder = await GroceryOrdersModel.findByIdAndUpdate(updateDelivery.groceryOrder, update, {
			new: true
		});
		if (!updatedOrder) {
			return res.status(400).json({
				message: "Could not change order."
			})
		}


		// ********* notification 
		let user = await UserModel.findById(updateDelivery.order_details.user_id._id).lean(true)

		let message = "Order status has been changed to" + status;
		let info = {
			deviceToken: user.device_token,
			title: "Order Status Changed",
			message: message,
			order_id: updatedOrder._id,
			type: "Order"
		}
		commonFunc.sendNotification(info);


		let obj = {
			notification_type: info.type,
			notification_heading: "Order Status Changed",
			order_id: updatedOrder._id,
			user_id: user._id,
			title: "Order Status Changed",
			body: message,
		}
		await NotificationModel.create(obj);
		//supermarket
		let supermarket = await superMarketModel.findById(updatedOrder.superMarket_id)
		info = {
			deviceToken: supermarket.device_token,
			title: "Order Status Changed",
			message: message,
			order_id: updatedOrder._id,
			type: "Order"
		}
		commonFunc.sendNotification(info);
		obj = {
			notification_type: info.type,
			notification_heading: "Order Status Changed",
			order_id: updatedOrder._id,
			user_id: supermarket._id,
			title: "Order Status Changed",
			body: message,
		}
		await NotificationModel.create(obj);

		//manager
		let manager = await branchManagerModel.findOne({
			branch_id: updatedOrder.store_id
		})
		info = {
			deviceToken: manager.device_token,
			title: "Order Status Changed",
			message: message,
			order_id: updatedOrder._id,
			type: "Order"
		}
		commonFunc.sendNotification(info);
		obj = {
			notification_type: info.type,
			notification_heading: "Order Status Changed",
			order_id: updatedOrder._id,
			user_id: manager._id,
			title: "Order Status Changed",
			body: message,
		}
		await NotificationModel.create(obj);

		//notification



		return res.status(200).json({
			message: "Successfully changed order status",
			data: updatedOrder
		})


	} catch (error) {
		res.status(403).json(error.message)
	}
}
exports.order_accept_reject_store = async (req, res) => {
	try {

		let query = {
			status: req.body.status,

		}
		if (req.body.status === 'ACCEPTED') {
			query.created_time = new Date()
		} else if (req.body.status === 'REJECTED')
			query.rejection_reason = req.body.rejection_reason
		else
			return res.status(403).json({
				message: "status should be ACCEPTED , REJECTED"
			})

		let order = await groceryDeliveryModel.findByIdAndUpdate(req.body.delivery_id, query, {
			new: true
		})
		if (order.status === 'ACCEPTED') {
			await groceryDeliveryModel.remove({
				groceryOrder: order.groceryOrder,
				status: {
					$ne: 'ACCEPTED'
				}
			})
			await driverModel.findByIdAndUpdate(order.driver, {
				currently_assigned_order: true
			}, {
				new: true
			})
			let updatedOrder = await GroceryOrdersModel.findByIdAndUpdate(order.groceryOrder, {
				order_status: order.status,
				driver: order.driver,
			}, {
				new: true
			});


			// ********* notification 
			let user = await UserModel.findById(order.order_details.user_id._id).lean(true)

			let message = "Driver Assigned to your order";
			let info = {
				deviceToken: user.device_token,
				title: "Driver Assigned",
				message: message,
				order_id: updatedOrder._id,
				type: "Order"
			}
			commonFunc.sendNotification(info);


			let obj = {
				notification_type: info.type,
				notification_heading: "Driver Assigned",
				order_id: updatedOrder._id,
				user_id: user._id,
				title: "Driver Assigned",
				body: message,
			}
			await NotificationModel.create(obj);

			//manager
			let manager = await branchManagerModel.findOne({
				branch_id: updatedOrder.store_id
			})
			info = {
				deviceToken: manager.device_token,
				title: "Driver Assigned",
				message: message,
				order_id: order._id,
				type: "Order"
			}
			commonFunc.sendNotification(info);
			obj = {
				notification_type: info.type,
				notification_heading: "Driver Assigned",
				order_id: order._id,
				user_id: manager._id,
				title: "Driver Assigned",
				body: message,
			}
			await NotificationModel.create(obj);

		}


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