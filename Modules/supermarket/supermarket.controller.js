const {
    superMarketProductsModel
} = require("../../models/superMarketProducts")
const {
    NotificationModel
} = require("../../models/Notification")
const {
    branchModel
} = require("../../models/branch")
var ar = require('../../languages/ar.json')
var en = require('../../languages/en.json');

const languages = {
    ar: ar,
    en: en

}

const {
    FaqModel
} = require('../../models/faqModel')
const {
    superMarketOfferModel
} = require("../../models/superMarketOffer")

const {
    GroceryOrdersModel
} = require("../../models/groceryOrders")

const {
    inventoryModel
} = require("../../models/inventory")

const {
    branchManagerModel
} = require("../../models/branchManager")

const {
    superMarketSubcategoryModel
} = require("../../models/superMarketSubcategory")
const {
    superMarketCategoryModel
} = require("../../models/superMarketCategory")
const {
    query
} = require("express")

exports.add_branch = async (req, res) => {
    let branchData = req.body
    branchData.superMarket_id = req.userData._id
    if (!branchData.branchId || !branchData.name || !branchData.address) return res.status(403).json({
        message: "key is missing"
    })


    if (typeof branchData.categories == 'string')
        branchData.categories = JSON.parse(branchData.categories)
    if (typeof branchData.subCategories == 'string')
        branchData.subCategories = JSON.parse(branchData.subCategories)

    let is_exist = await branchModel.findOne({
        branchId: branchData.branchId,
        superMarket_id: req.userData._id
    })
    if (is_exist) return res.status(403).json({
        message: "BranchId Already Exist"
    })
    let data = await branchModel.create(branchData)
    let popu = await branchModel.findOne({
        _id: data._id
    }).populate("categories").populate("subCategories")

    return res.status(200).json({
        data: popu,
        message: "success"
    })
}

exports.update_branch = async (req, res) => {
    let branchData = req.body

    if (typeof branchData.categories == 'string')
        branchData.categories = JSON.parse(branchData.categories)
    if (typeof branchData.subCategories == 'string')
        branchData.subCategories = JSON.parse(branchData.subCategories)

    let data = await branchModel.findByIdAndUpdate(branchData._id, branchData, {
        new: true
    })

    return res.status(200).json({
        data: data,
        message: "success"
    })
}

exports.delete_branch = async (req, res) => {
    let data = await branchModel.findByIdAndDelete(req.body._id)

    return res.status(200).json({
        data: data,
        message: "success"
    })
}

exports.get_branches = async (req, res) => {
    let query = {
        superMarket_id: req.userData._id
    }
    if (req.query.is_active)
        query.is_active = req.query.is_active
    if (req.query.name)
        query.name = req.query.name

    let data = await branchModel.find(query).populate("categories").populate("subCategories")

    return res.status(200).json({
        data: data,
        message: "success"
    })
}

exports.add_branch_manager = async (req, res) => {
    try {
        let branchManager = req.body
        branchManager.superMarket_id = req.userData._id
        if (!branchManager.branch_id || !branchManager.branch_name || !branchManager.manager_name || !branchManager.email_id || !branchManager.contact_number || !branchManager.location) return res.status(403).json({
            message: "key is missing"
        })
        let is_exist = await branchManagerModel.findOne({
            superMarket_id: req.userData._id,
            branch_id: req.body.branch_id
        })

        if (is_exist) return res.status(403).json({
            message: "Manager Already Exist"
        })
        let data = await branchManagerModel.create(branchManager)

        return res.status(200).json({
            data: data,
            message: "Success"
        })
    } catch (error) {
        return res.status(401).json({
            message: error.message
        })
    }
}


exports.update_branch_manager = async (req, res) => {
    try {
        let branchManager = req.body


        let data = await branchManagerModel.findByIdAndUpdate(branchManager._id, branchManager, {
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

exports.delete_branch_manager = async (req, res) => {
    try {
        let data = await branchManagerModel.findByIdAndDelete(req.body._id)

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

exports.get_branch_managers = async (req, res) => {
    try {
        let query = {
            superMarket_id: req.userData._id
        }
        if (req.query.is_active)
            query.is_active = req.query.is_active
        if (req.query.branch_id)
            query.branch_id = req.query.branch_id
        if (req.query.manager_name)
            query.manager_name = req.query.manager_name

        let data = await branchManagerModel.find(query).populate("branch_id")

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


//******************subcategories*** */

exports.add_subCategories = async (req, res) => {
    try {
        let exist = await superMarketSubcategoryModel.findOne({
            superMarket_id: req.body.superMarket_id,
            category: req.body.category,
            subcategory_name: req.body.subcategory_name
        })
        if (exist) return res.status(200).json({
            message: "Subcategory Already Exist"
        })
        let data = await superMarketSubcategoryModel.create(req.body)
        return res.status(200).json({
            data: data,
            message: "success"
        })
    } catch (e) {
        return res.status(403).json({
            message: e.message
        })
    }
}

exports.update_subCategories = async (req, res) => {
    try {

        let data = await superMarketSubcategoryModel.findOneAndUpdate({
            _id: req.body._id
        }, req.body, {
            new: true
        })
        return res.status(200).json({
            data: data,
            message: "success"
        })
    } catch (e) {
        return res.status(403).json({
            message: e.message
        })
    }
}

exports.delete_subCategories = async (req, res) => {
    try {
        let data = await superMarketSubcategoryModel.findByIdAndDelete(req.body._id)

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

exports.get_subCategories = async (req, res) => {
    try {
        let query = {
            superMarket_id: req.userData._id
        }

        if (req.query.category)
            query.category = req.query.category

        if (req.query.category_name) {
            let searchStr = new RegExp(req.query.category_name, 'i')
            let category = await superMarketCategoryModel.findOne({
                category: searchStr
            })
            query.category = category._id
        }

        let data = await superMarketSubcategoryModel.find(query).populate("category")

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



exports.add_product = async (req, res) => {
    try {
        if (typeof req.body.images == 'string')
            req.body.images = JSON.parse(req.body.images)
        let exist = await superMarketProductsModel.findOne({
            product_name: req.body.product_name,
            category: req.body.category,
            subCategory: req.body.subCategory,
            superMarket_id: req.body.superMarket_id
        })
        if (exist) return res.status(200).json({
            message: "Product Already Exist"
        })
        let data = await superMarketProductsModel.create(req.body)

        //***inventory add ****/
        let inventoryData = {
            superMarket_id: data.superMarket_id,
            product_id: data._id,
            quantity: data.quantity,
            unit: data.unit,
            price: data.price,
            selling_price: data.selling_price,
            discount_price: data.discount_price,
            category: data.category,
            subCategory: data.subCategory,
            barcode_number: data.barcode_number,
            unit_measurement: data.unit_measurement,
            product_details: {
                product_name: req.body.product_name,
                images: req.body.images
            }
        }
        let branches = await branchModel.find({
            superMarket_id: data.superMarket_id
        })
        for (i = 0; i < branches.length; i++) {
            inventoryData.branch_id = branches[i]._id
            await inventoryModel.create(inventoryData)
        }
        //////added////////////////////////
        return res.status(200).json({
            data: data,
            message: "success"
        })
    } catch (e) {
        return res.status(403).json({
            message: e.message
        })
    }
}
exports.update_product = async (req, res) => {
    try {
        if (typeof req.body.images == 'string')
            req.body.images = JSON.parse(req.body.images)

        let data = await superMarketProductsModel.findOneAndUpdate({
            _id: req.body._id
        }, req.body, {
            new: true
        })
        return res.status(200).json({
            data: data,
            message: "success"
        })
    } catch (e) {
        return res.status(403).json({
            message: e.message
        })
    }
}

exports.delete_product = async (req, res) => {
    try {
        let data = await superMarketProductsModel.findByIdAndDelete(req.body._id)

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

exports.get_product = async (req, res) => {
    try {
        let query = {
            superMarket_id: req.userData._id
        }

        if (req.query.product_name) {
            query.product_name = req.query.product_name
        }
        let data = await superMarketProductsModel.find(query).lean(true).populate("subCategory").populate("category")
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

exports.get_inventory = async (req, res) => {
    try {

        let data = await inventoryModel.find({
            branch_id: req.query.branch_id
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

exports.get_orders = async (req, res) => {
    try {
        let query = {
            superMarket_id: req.userData._id
        }
        if (req.query.status)
            query.order_status = req.query.status
        let orderd = await GroceryOrdersModel.find(query).sort({
            _id: -1
        }).populate('user_id').populate('address_id').populate('driver', 'country_code mobile_number').populate('store_id', 'name')
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


//*************************offer management*************** */

exports.add_offer = async (req, res) => {
    try {
        if (typeof req.body.offer_validity == 'string')
            req.body.offer_validity = JSON.parse(req.body.offer_validity)

        let bodyData = req.body
        bodyData.created_by = "SUPERMARKET"
        bodyData.superMarket_id = req.userData._id

        let is_exist = await superMarketOfferModel.findOne({
            offer_code: req.body.offer_code,
            superMarket_id: req.userData._id
        })
        if (is_exist)
            return res.status(403).json({
                message: "Offer Code Already Exist"
            })

        let offer = await superMarketOfferModel.create(bodyData)
        return res.status(200).json({
            data: offer,
            message: "Success"
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

        let offer = await superMarketOfferModel.findByIdAndUpdate(req.body._id, req.body, {
            new: true
        })
        return res.status(200).json({
            data: offer,
            message: "Success"
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

exports.delete_offer = async (req, res) => {
    try {
        let offer = await superMarketOfferModel.findByIdAndDelete(req.body._id)
        return res.status(200).json({
            data: offer,
            message: "Deleted"
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
            superMarket_id: req.userData._id
        }
        if (req.query.is_active)
            query.is_active = req.query.is_active
        let offer = await superMarketOfferModel.find(query)
        return res.status(200).json({
            data: offer,
            message: "Success"
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

exports.get_reports = async (req, res) => {
    try {
        if (typeof req.query.dateObject == 'string') // for filter
            req.query.dateObject = JSON.parse(req.query.dateObject)
        let query = {
            store_id: req.query.store_id,
        }
        if (req.query.dateObject) {
            query.createdAt = {
                $gte: new Date(req.query.dateObject.from),
                $lt: new Date(req.query.dateObject.to) //2012, 7, 15
            }
        }
        let GroceryOrders = await GroceryOrdersModel.find(query).lean(true)

        let structure = []
        for (i = 0; i < GroceryOrders.length; i++) {
            let obj = {}
            let ongoingOrder = 0
            let deliverdOrder = 0
            let cancelledOrder = 0
            let total_revenue = 0
            let items = []
            let date = GroceryOrders[i].createdAt.toISOString().substring(0, 10)
            for (p = 0; p < structure.length; p++) {
                if (structure[p].date == date) {
                    var check = date
                    break
                }
            }
            if (structure[p]) {
                if (structure[p].date == check)
                    continue
            }
            for (j = 0; j < GroceryOrders.length; j++) {
                if (date == GroceryOrders[j].createdAt.toISOString().substring(0, 10)) {
                    if (GroceryOrders[j].order_status != "DELIVERED" && GroceryOrders[j].order_status != "CANCELLEDBYUSER" && GroceryOrders[j].order_status != "PENDING")
                        ongoingOrder += 1
                    if (GroceryOrders[j].order_status == "DELIVERED") {
                        deliverdOrder += 1
                        total_revenue += GroceryOrders[j].order_amount
                        for (it = 0; it < GroceryOrders[j].item_orderd.length; it++) {
                            items.push(GroceryOrders[j].item_orderd[it].inventory_id)
                        }
                    }
                    if (GroceryOrders[j].order_status == "CANCELLEDBYUSER")
                        cancelledOrder += 1

                }
            }
            obj.ongoingOrder = ongoingOrder
            obj.deliverdOrder = deliverdOrder
            obj.cancelledOrder = cancelledOrder
            obj.total_revenue = total_revenue
            obj.total_revenue = total_revenue
            obj.totalOrder = ongoingOrder + deliverdOrder + cancelledOrder
            if (deliverdOrder >= 1)
                obj.mostSold = await sold_count(items)
            else
                obj.mostSold = []
            obj.date = date
            structure.push(obj)
        }
        return res.status(200).json({
            data: structure,
            message: "Success"
        })
    } catch (error) {
        res.status(403).error(error.message);
    }
}

async function sold_count(items) {
    console.log(items)
    let obj = items.reduce((val, cur) => {
        val[cur._id] = val[cur._id] ? val[cur._id] + 1 : 1;
        return val;
    }, {});

    let res = Object.keys(obj).map((key) => ({
        _id: key,
        count: obj[key],
        product_details: obj.product_details
    }));

    let most_sold = {}
    
    if(res){
         topx=await inventoryModel.findById(res[0])
         most_sold.top1 = topx.product_details
    if(res.length>=2){
        topy=await inventoryModel.findById(res[1])
        most_sold.top2 = topy.product_details
    }}

    
    return most_sold
}

exports.get_Dashboard = async (req, res) => {
    try {
        if (typeof req.query.dateObject == 'string')
            req.query.dateObject = JSON.parse(req.query.dateObject)


        let query1 = {
            order_status: {
                $ne: 'PENDING'
            },
            order_status: {
                $ne: 'CANCELLEDBYUSER'
            },
            order_status: {
                $ne: 'DELIVERED'
            },
            superMarket_id: req.userData._id
        }
        let query2 = {
            superMarket_id: req.userData._id
        }
        let query3 = {
            superMarket_id: req.userData._id,
            order_status: "DELIVERED"
        }
        let query4 = {
            superMarket_id: req.userData._id,
            order_status: "CANCELLEDBYUSER",
        }

        if (req.query.dateObject) {
            query1.createdAt = {
                $gte: new Date(req.query.dateObject.from),
                $lt: new Date(req.query.dateObject.to) //2012, 7, 15
            }
            query2.createdAt = {
                $gte: new Date(req.query.dateObject.from),
                $lt: new Date(req.query.dateObject.to) //2012, 7, 15
            }
            query3.createdAt = {
                $gte: new Date(req.query.dateObject.from),
                $lt: new Date(req.query.dateObject.to) //2012, 7, 15
            }
            query4.createdAt = {
                $gte: new Date(req.query.dateObject.from),
                $lt: new Date(req.query.dateObject.to) //2012, 7, 15
            }
        }
        let ongoingOrder = await GroceryOrdersModel.find(query1)
        let totalOrder = await GroceryOrdersModel.find(query2)
        let completedOrder = await GroceryOrdersModel.find(query3)
        let cancelOrder = await GroceryOrdersModel.find(query4)

        let totalRevenue = 0
        for (i = 0; i < completedOrder.length; i++) {
            totalRevenue += completedOrder[i].order_amount
        }
        return res.status(200).json({
            data: {
                totalOrder: totalOrder.length,
                ongoingOrder: ongoingOrder.length,
                completedOrder: completedOrder.length,
                cancelOrder: cancelOrder.length,
                totalRevenue: totalRevenue
            },
            message: "Success"
        })
    } catch (error) {
        res.status(403).error(error.message);
    }
}
