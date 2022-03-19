const e = require('express');
const {
    find
} = require('lodash');
const {
    branchManagerModel
} = require("../../models/branchManager")
const {
    AddressModel
} = require("../../models/address");

const {
    restaurantRatingModel
} = require("../../models/restaurantRating");
const {
    restaurantItemRatingModel
} = require("../../models/restaurantItemRating");
const {
    superMarketCategoryModel
} = require("../../models/superMarketCategory")
var ar = require('../../languages/ar.json')
var en = require('../../languages/en.json');

const monthNames = ["", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];


const languages = {
    ar: ar,
    en: en

}
const {
    superMarketCartModel
} = require("../../models/superMarketCartModel")


const {
    superMarketBannerModel
} = require('../../models/superMarketBanner')

const {
    cuisineModel
} = require("../../models/cuisine");


const {
    superMarketOfferModel
} = require("../../models/superMarketOffer");

const {
    inventoryModel
} = require("../../models/inventory")

const {
    NotificationModel
} = require("../../models/Notification")

let {
    OrderModel
} = require("../../models/orderModel");

const {
    RestaurantModel
} = require("../../models/restaurant");

let commonFunc = require("../../common/utility")


const {
    MenuModel
} = require("../../models/menu");
const {
    dishModel
} = require('../../models/dish');
const {
    FavouriteModel
} = require('../../models/favouriteRestaurant');
const {
    offerModel
} = require('../../models/offer');
const {
    CartModel
} = require('../../models/cartModel');
const {
    truncate
} = require('fs/promises');
const {
    createSecretKey
} = require('crypto');

const {
    branchModel
} = require("../../models/branch")

const {
    superMarketSubcategoryModel
} = require("../../models/superMarketSubcategory");
const {
    GroceryOrdersModel
} = require('../../models/groceryOrders');


exports.addAddress = async (req, res) => {
    try {
        let user_id = req.userData._id;
        if (!req.body.address_type || !req.body.address_name)
            return res.status(403).json({
                message: "Key Is Missing",
            });

        console.log("user id::::", user_id);

        let {
            house_number,
            building_tower,
            society,
            pincode,
            location_address,
            address_type,
            address_name,
            lat = 0,
            long = 0
        } = req.body;


        let location = {
            type: 'Point',
            "coordinates": [Number(long), Number(lat)]
        };

        let newAdd = await AddressModel.create({
            house_number,
            building_tower,
            society,
            pincode,
            address_type,
            lat,
            long,
            address_name,
            location,
            user_id,
            location_address
        });
        if (!newAdd) return res.status(400).json({
            message: "Could Not Create New Address"
        });

        return res.status(200).json({
            message: "Successfully Added New Address.",
            data: newAdd
        });




    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.updateAddress = async (req, res) => {
    try {
        let address_id = req.body.address_id;
        let trustedData = req.body;
        if (trustedData.lat && trustedData.long) {
            trustedData.location = {
                type: 'Point',
                "coordinates": [Number(trustedData.long), Number(trustedData.lat)]
            };
        }

        let newAdd = await AddressModel.findByIdAndUpdate(address_id, trustedData, {
            new: true
        });
        if (!newAdd) return res.status(400).json({
            message: "Could Not Update Address"
        });

        return res.status(200).json({
            message: "Successfully Updated Address.",
            data: newAdd
        });


    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.removeAddress = async (req, res) => {
    try {
        let user_id = req.userData._id;
        let address_id = req.body.address_id;
        console.log("user id::::", user_id);

        let newAdd = await AddressModel.findOneAndRemove({
            _id: address_id
        })
        if (!newAdd) return res.status(400).json({
            message: "Could Not Remove Address"
        });

        return res.status(200).json({
            message: "Successfull Removed Address.",
            data: newAdd
        });




    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.getAddress = async (req, res) => {
    try {
        let user_id = req.userData._id;
        let address_id = req.query.address_id;
        console.log("user id::::", user_id);

        let newAdd = await AddressModel.findOne({
            _id: address_id,
            user_id: user_id
        })
        if (!newAdd) return res.status(400).json({
            message: "Could Not Find This Address"
        });

        return res.status(200).json({
            message: "Successfully Fetched.",
            data: newAdd
        });




    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.getAddressList = async (req, res) => {
    try {
        let user_id = req.userData._id;
        console.log("user id::::", user_id);

        let newAdd = await AddressModel.find({
            user_id: user_id
        })
        if (!newAdd) return res.status(400).json({
            message: "Could Not Fetch Addresses List"
        });

        return res.status(200).json({
            message: "Successfully Fetched.",
            data: newAdd
        });
    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}


async function isFav(data, user_id) {
    for (i = 0; i < data.length; i++) {
        let is_fav = await FavouriteModel.findOne({
            $and: [{
                restaurant_id: data[i]._id
            }, {
                user_id: user_id
            }]
        })
        data[i].is_fav = is_fav ? true : false
        data[i].rating = 1
        data[i].distance = 2
    }

    return data
}

async function ItemQuantityInCart(user_id, dish_id) {
    let cart = await CartModel.findOne({
        user_id: user_id
    }).lean(true)

    let item = cart.items_in_cart.find(x => x.item_id.toString() === dish_id.toString())


    return {
        item_quantity: item ? item.selected_quantity : 0,
        cart_item_id: item ? item._id : null
    }
}


exports.get_home_screen = async (req, res) => {
    try {
        let {
            lat,
            long
        } = req.body

        let data = await RestaurantModel.find({
            is_approved_by_admin: "1",
            restaurant_on: true
        }).lean(true).populate('categories')

        let latestRest = await RestaurantModel.find({
            is_approved_by_admin: "1",
            restaurant_on: true
        }).sort({
            _id: -1
        }).limit(4).lean(true).populate('categories')

        let offers_restaurants = await RestaurantModel.find({
            offer_count: {
                $gte: 1
            },
            is_approved_by_admin: "1",
            restaurant_on: true
        }).sort({
            offer_count: -1
        }).lean(true).populate('categories')

        let cuisine = await cuisineModel.find({})


        res.status(200).json({
            message: "Success",
            data: {
                cuisine: cuisine,
                offers_restaurants: await isFav(offers_restaurants),
                restaurants: await isFav(data, req.userData._id),
                latest_restaurants: await isFav(latestRest, req.userData._id)
            },
        });


    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

exports.get_restaurant_list = async (req, res) => {
    try {
        let query = {
            is_approved_by_admin: "1",
            restaurant_on: true
        }
        if (req.query.search)
            query.restaurant_name = new RegExp(req.query.search, 'i')

        if (req.query.cuisine)
            query.categories = req.query.cuisine

        let data = await RestaurantModel.find(query).lean(true).populate('categories').sort({
            _id: -1
        })
        for (i = 0; i < data.length; i++) {
            data[i].rating = await ratingOfRestaurant(data[i]._id)
        }

        if (data) return res.status(200).json({
            message: "Success",
            data: await isFav(data, req.userData._id),
        });
        else return res.status(403).json({
            message: "empty",
        });


    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
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

exports.get_restaurant_details = async (req, res) => {
    try {
        if (!req.query.restaurant_id)
            return res.status(403).json({
                message: "restaurant_id is missing",
            });


        let data = await RestaurantModel.findOne({
            _id: req.query.restaurant_id
        }).lean(true).populate('categories')

        let menu = await MenuModel.find({
            restaurant_id: req.query.restaurant_id
        }).lean(true)


        for (let i = 0; i < menu.length; i++) {
            let query = {
                menu_id: menu[i]._id,
            }
            if (req.query.dish_type)
                query.dish_type = req.query.dish_type

            let dish_data = await dishModel.find(query).lean(true)
            menu[i].dish = dish_data

            for (let x = 0; x < menu[i].dish.length; x++) {
                let item_details = await ItemQuantityInCart(req.userData._id, menu[i].dish[x]._id)
                menu[i].dish[x].cart_quantity = item_details.item_quantity
                menu[i].dish[x].cart_item_id = item_details.cart_item_id
            }
        }

        let is_fav = await FavouriteModel.findOne({
            $and: [{
                restaurant_id: data._id
            }, {
                user_id: req.userData._id
            }]
        })


        data.is_fav = is_fav ? true : false


        if (data) return res.status(200).json({
            message: "Success",
            data: {
                menu: menu,
                restaurant_details: data,
                offers: await offerModel.find({
                    restaurant_id: data._id
                })
            },
        });
        return res.status(403).json({
            message: "Empty",
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }

}


exports.add_fav_restaurant = async (req, res) => {
    try {
        if (!req.body.restaurant_id)
            return res.status(403).json({
                message: "restaurant_id is missing",
            });

        let is_fav = await FavouriteModel.findOne({
            user_id: req.userData._id,
            restaurant_id: req.body.restaurant_id
        })
        if (!is_fav) {
            let data = await FavouriteModel.create({
                user_id: req.userData._id,
                restaurant_id: req.body.restaurant_id
            })
            if (data) {
                return res.status(200).json({
                    data: data,
                    message: "Success"
                });
            } else return res.status(403).json({
                message: "Something Is Missing",
            });
        }
        return res.status(403).json({
            message: "Already Exist",
        });

    } catch (error) {
        return res.status(200).json({
            data: data,
            message: "Success"
        });
    }
}

exports.remove_fav_restaurant = async (req, res) => {
    try {

        if (!req.body.restaurant_id)
            return res.status(403).json({
                message: "restaurant_id is missing",
            });

        let data = await FavouriteModel.findOneAndDelete({
            user_id: req.userData._id,
            restaurant_id: req.body.restaurant_id
        })
        if (data) {
            return res.status(200).json({
                data: data,
                message: "success"
            });
        } else return res.status(403).json({
            message: "not found",
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });

    }
}

exports.get_fav_restaurants = async (req, res) => {
    try {

        let data = await FavouriteModel.find({
            user_id: req.userData._id,
        }).populate('restaurant_id').lean(true)


        //*********for populate categories inside restrooo */
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].restaurant_id.categories.length; j++) {
                let cuisine = await cuisineModel.findOne({
                    _id: data[i].restaurant_id.categories[j]
                })
                data[i].restaurant_id.categories[j] = cuisine
            }
        }
        ///************************************* */

        if (data) {
            return res.status(200).json({
                message: "Success",
                data: data
            });
        } else return res.status(403).json({
            message: "not found"
        });

    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}






//********************cart management***************/

async function updateGrandTotal(user_id) {
    let cart = await CartModel.findOne({
        user_id: user_id
    }).lean(true).populate("restaurant_id")

    let items = cart.items_in_cart;
    cart.grand_total_of_cart = 0;
    cart.total_items_in_cart = 0;
    if (items.length > 0) {
        cart.total_items_in_cart = items.length;
        for (var i = 0; i < items.length; i++)
            cart.grand_total_of_cart = cart.grand_total_of_cart + items[i].item_total_price;
    }
    if (items.length == 0) {
        cart.grand_total_of_cart = 0
        items = []
        cart.total_items_in_cart = 0
        cart.restaurant_id = null
    }
    let update = await CartModel.findOneAndUpdate({
        user_id: user_id
    }, {
        grand_total_of_cart: cart.grand_total_of_cart,
        total_items_in_cart: cart.total_items_in_cart,
        items_in_cart: items,
        restaurant_id: cart.restaurant_id
    }, {
        new: true
    });
    cart = await CartModel.findOne({
        user_id: user_id
    }).lean(true).populate("restaurant_id")
    return cart;
}

exports.addItemToCart = async (req, res) => {
    try {
        let cart_item_data = req.body

        let check_item = await dishModel.findById(cart_item_data.item_id)

        if (!check_item) return res.status(403).json({
            message: "Dish Item Not Found"
        });

        cart_item_data.item_unit_price = check_item.dish_price;
        let is_user_cart_exist = await CartModel.findOne({
            user_id: req.userData._id
        });

        if (!is_user_cart_exist) return res.status(403).json({
            message: "Cart Not Found."
        });

        if (is_user_cart_exist.restaurant_id)
            if (is_user_cart_exist.restaurant_id.toString() != cart_item_data.restaurant_id.toString()) {
                await CartModel.findOneAndUpdate({
                    user_id: req.userData._id
                }, {
                    grand_total_of_cart: 0,
                    total_items_in_cart: 0,
                    items_in_cart: [],
                    restaurant_id: null
                }, {
                    new: true
                });
                // return res.status(400).json({
                //     message: "You can only add items from same restaurant at time in cart."
                // })
            }
        cart_item_data.item_unit_price = Number(cart_item_data.item_total_price) / Number(cart_item_data.selected_quantity)
        let cart = await CartModel.findOneAndUpdate({
            user_id: req.userData._id
        }, {
            restaurant_id: cart_item_data.restaurant_id,
            $push: {
                items_in_cart: cart_item_data
            }
        }, {
            new: true
        })

        if (!cart) return res.status(400).json({
            message: "Cart Could Not Be Updated"
        });

        let result = await updateGrandTotal(req.userData._id);

        return res.status(200).json({
            message: "Cart Updated Successfully",
            data: result
        });


    } catch (e) {
        return res.status(400).json({
            message: e.message
        })
    }
}

exports.increaseQuantity = async (req, res) => {
    try {
        let cart = await CartModel.findOne({
            user_id: req.userData._id
        })

        for (var i = 0; i < cart.items_in_cart.length; i++) {
            if (req.body.cart_item_id.toString() == cart.items_in_cart[i]._id.toString()) {
                cart.items_in_cart[i].selected_quantity = cart.items_in_cart[i].selected_quantity + 1;
                cart.items_in_cart[i].item_total_price = cart.items_in_cart[i].selected_quantity * cart.items_in_cart[i].item_unit_price;
            }
        }
        cart = await cart.save();
        let result = await updateGrandTotal(req.userData._id);

        res.status(200).json({
            message: "Successfully Increased Quantity",
            data: result
        });

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.decreaseQuantity = async (req, res) => {
    try {
        let cart = await CartModel.findOne({
            user_id: req.userData._id
        });

        for (var i = 0; i < cart.items_in_cart.length; i++) {
            if (req.body.cart_item_id.toString() == cart.items_in_cart[i]._id.toString()) {
                if (cart.items_in_cart[i].selected_quantity == 1) {
                    return res.status(400).json({
                        message: "Cannot Decrease Quantity, Need To Delete The Item"
                    });
                }
                cart.items_in_cart[i].selected_quantity = cart.items_in_cart[i].selected_quantity - 1;
                cart.items_in_cart[i].item_total_price = cart.items_in_cart[i].selected_quantity * cart.items_in_cart[i].item_unit_price;
            }
        }
        cart = await cart.save();
        let result = await updateGrandTotal(req.userData._id);

        res.status(200).json({
            message: "Successfully Decreased Quantity",
            data: result
        });

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.getCart = async (req, res) => {
    try {

        let cart = await CartModel.findOne({
            user_id: req.userData._id
        }).populate("items_in_cart.item_id").populate("items_in_cart.menu_id").populate("restaurant_id")

        if (cart.items_in_cart.length == 0)
            cart = null

        return res.status(200).json({
            message: "Success.",
            data: cart
        })

    } catch (error) {
        res.status(403).json(error.message)
    }

}

exports.removeItemFromCart = async (req, res) => {
    try {
        let cart = await CartModel.findOne({
            user_id: req.userData._id
        })
        for (var i = 0; i < cart.items_in_cart.length; i++) {
            if (req.body.cart_item_id.toString() == cart.items_in_cart[i]._id.toString()) {
                var is_deleted = cart.items_in_cart.splice(i, 1);
            }
        }
        if (!is_deleted) return res.status(400).json({
            message: "Item Not Found In Cart"
        });
        cart = await cart.save();

        let result = await updateGrandTotal(req.userData._id);

        res.status(200).json({
            message: "Successfully Removed From Cart",
            data: result
        });

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}



//******************order management*************** */


exports.placeOrder = async (req, res) => {
    try {
        let cart = await CartModel.findOne({
            user_id: req.userData._id
        }).lean(true).populate("items_in_cart.item_id").populate("items_in_cart.menu_id");
        if (!cart) return res.status(400).json({
            message: "Cart Not Found."
        })
        if (!cart.items_in_cart) return res.status(400).json({
            message: "Cart Is Empty"
        })

        let randomId = commonFunc.randomString()
        let item_orderd = []
        for (i = 0; i < cart.items_in_cart.length; i++) {
            item_orderd.push(cart.items_in_cart[i])
        }
        let order_object = {
            item_orderd: item_orderd,
            restaurant_id: cart.restaurant_id,
            user_id: req.userData._id,
            order_id: randomId,
            order_amount: req.body.order_amount,
            tax_amount: req.body.tax_amount,
            discount_amount: req.body.discount_amount,
            shipping_charge: req.body.shipping_charge,
            promo_code_applied: req.body.promo_code_applied,
            order_status: "PENDING",
            payment_method: req.body.payment_method,
            address_id: req.body.address_id
        }


        let order = await OrderModel.create(order_object);

        if (order) {
            let cartUpdated = await CartModel.findOneAndUpdate({
                user_id: req.userData._id
            }, {
                total_items_in_cart: 0,
                grand_total_of_cart: 0,
                restaurant_id: null,
                items_in_cart: []
            }, {
                new: true
            });
        }

        ///notification part start

        let restaurant = await RestaurantModel.findById(order.restaurant_id).lean(true)

        let message = "you have a new order";
        let info = {
            deviceToken: restaurant.device_token,
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
            user_id: restaurant._id,
            title: "New Order",
            body: message,
        }
        await NotificationModel.create(obj);


        // user notify 
        message = "Your Order Has Been Placed Successfully";
        let userinfo = {
            deviceToken: req.userData.device_token,
            title: "Order Placed",
            message: message,
            order_id: order._id,
            type: "Order"
        }
        commonFunc.sendNotification(userinfo);
        let userobj = {
            notification_type: userinfo.type,
            notification_heading: "Order Placed",
            order_id: order._id,
            user_id: req.userData._id,
            title: "Order Placed",
            body: message,
        }
        await NotificationModel.create(userobj);

        ///notification part end

        res.status(200).json({
            message: "Successfully Placed Order.",
            data: order
        });

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}


exports.getMyOrders = async (req, res) => {
    try {

        let order = await OrderModel.find({
            user_id: req.userData._id
        }).sort({
            _id: -1
        }).populate("restaurant_id").lean(true)
        if (!order) return res.status(400).json({
            message: "No Orders found"
        })

        res.status(200).json({
            message: "Successfully Fetched Order's List",
            data: order
        });

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}




exports.grocery_home_screen = async (req, res) => {
    try {
        let banners = await superMarketBannerModel.find().sort({
            _id: -1
        })
        let categories = await superMarketCategoryModel.find().sort({
            _id: -1
        })

        res.status(200).json({
            message: "Success",
            data: {
                banners: banners,
                categories: categories,
            },
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

exports.get_stores = async (req, res) => {
    try {
        let query = {}
        if (req.body.category)
            query.categories = req.body.category

        let branches = await branchModel.find(query).sort({
            _id: -1
        }).populate('categories')

        res.status(200).json({
            message: "Success",
            data: branches
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
async function inventoryQuantityInCart(user_id, inventory_id) {
    let cart = await superMarketCartModel.findOne({
        user_id: user_id
    }).lean(true)

    let item = cart.items_in_cart.find(x => x.inventory_id.toString() === inventory_id.toString())


    return {
        item_quantity: item ? item.selected_quantity : 0,
        cart_inventory_id: item ? item._id : null
    }
}
exports.get_inventory_items = async (req, res) => {
    try {
        if (typeof req.query.priceFilter == 'string')
            req.query.priceFilter = JSON.parse(req.query.priceFilter)
        let user_id = req.userData._id
        let query = {
            is_active: true
        }
        if (req.query.branch_id)
            query.branch_id = req.query.branch_id
        if (req.query.category)
            query.category = req.query.category

        if (req.query.subCategory)
            query.subCategory = req.query.subCategory

        if (req.query.search) {
            query.product_details = {}
            query.product_details.product_name = new RegExp(req.query.search, 'i')
        }

        console.log(query)
        let inventories = await inventoryModel.find(query).sort({
            _id: -1
        }).populate("product_id").lean(true)

        for (i = 0; i < inventories.length; i++) {
            let inventory_details = await inventoryQuantityInCart(user_id, inventories[i]._id)
            inventories[i].cart_inventory_quantity = inventory_details.item_quantity
            inventories[i].cart_inventory_id = inventory_details.cart_inventory_id
        }
        if (req.query.priceFilter) {
            let filter = []
            for (i = 0; i < inventories.length; i++) {
                if (Number(inventories[i].price) >= Number(req.query.priceFilter.min) && Number(inventories[i].price) <= Number(req.query.priceFilter.max)) {
                    filter.push(inventories[i])
                }
            }
            inventories = filter
        }
        if (req.query.sorting_option == '0')
            inventories.sort((a, b) => {
                return a.price - b.price;
            });
        if (req.query.sorting_option == '1')
            inventories.sort((a, b) => {
                return b.price - a.price;
            });
        if (req.query.sorting_option == '2')
            inventories.sort((a, b) => a.product_details.product_name.localeCompare(b.product_details.product_name));

        if (req.query.sorting_option == '3')
            inventories.sort((a, b) => {
                return b.sold_count - a.sold_count;
            });

        res.status(200).json({
            message: "Success",
            data: inventories
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

exports.search_products_getInventory = async (req, res) => {
    try {

        let ProductFound = await inventoryModel.find({
            "product_details.product_name": new RegExp(req.query.search, 'i')
        })
        if (!ProductFound) return res.status(200).json({
            message: "No search result found."
        });

        return res.status(200).json({
            data: ProductFound,
            message: "Successful."
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

exports.get_subcategories = async (req, res) => {
    try {
        if (!req.body.branch_id) {
            let query = {}
            if (req.body.category)
                query.category = req.body.category
            let subcategories = await superMarketSubcategoryModel.find(query).lean(true)
            return res.status(200).json({
                message: "Success",
                data: subcategories
            });
        } else {
            let branch = await branchModel.findById(req.body.branch_id).populate('subCategories').lean(true)
            let category = branch.categories

            if (req.body.category)
                category = [req.body.category]

            let subcategories = await superMarketSubcategoryModel.find({
                category: {
                    $in: category
                },
                superMarket_id: branch.superMarket_id
            }).lean(true)

            if (!branch)
                throw new Error("invalid store id")

            return res.status(200).json({
                message: "Success",
                data: subcategories
            });
        }

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


//*****************supermarket cart ******* */
async function updateGrandTotal_for_supermarket(user_id) {
    let cart = await superMarketCartModel.findOne({
        user_id: user_id
    }).lean(true).populate("superMarket_id")
    let items = cart.items_in_cart;
    console.log(cart)
    console.log(items)
    cart.grand_total_of_cart = 0;
    cart.total_items_in_cart = 0;
    if (items.length > 0) {
        cart.total_items_in_cart = items.length;
        for (var i = 0; i < items.length; i++)
            cart.grand_total_of_cart = cart.grand_total_of_cart + items[i].item_total_price;
    }
    if (items.length == 0) {
        cart.grand_total_of_cart = 0
        items = []
        cart.total_items_in_cart = 0
        cart.superMarket_id = null
    }
    let update = await superMarketCartModel.findOneAndUpdate({
        user_id: user_id
    }, {
        grand_total_of_cart: cart.grand_total_of_cart,
        total_items_in_cart: cart.total_items_in_cart,
        items_in_cart: items,
        superMarket_id: cart.superMarket_id
    }, {
        new: true
    });
    cart = await superMarketCartModel.findOne({
        user_id: user_id
    }).lean(true).populate("superMarket_id").populate("items_in_cart.inventory_id")
    return cart;
}



exports.addItemToSuperMarketCart = async (req, res) => {
    try {
        if (!req.body.selected_quantity)
            req.body.selected_quantity = 1
        let cart_item_data = req.body

        let inventory = await inventoryModel.findById(cart_item_data.inventory_id)

        if (!inventory) return res.status(403).json({
            message: "inventory Not Found"
        });

        cart_item_data.item_unit_price = inventory.price; // to get real price of product

        let is_user_cart_exist = await superMarketCartModel.findOne({
            user_id: req.userData._id
        });

        // ************ if same item increase quantity ***********
        let indexOfItem = is_user_cart_exist.items_in_cart.findIndex(x => x.inventory_id.toString() === req.body.inventory_id.toString())
        let is_same_item = is_user_cart_exist.items_in_cart.find(x => x.inventory_id.toString() === req.body.inventory_id.toString())

        if (is_same_item) {

            is_same_item.selected_quantity = is_same_item.selected_quantity + Number(req.body.selected_quantity);

            is_same_item.item_total_price = is_same_item.selected_quantity * is_same_item.item_unit_price;
            is_user_cart_exist.items_in_cart[indexOfItem] = is_same_item

            let update = await superMarketCartModel.findOneAndUpdate({
                user_id: req.userData._id
            }, {
                items_in_cart: is_user_cart_exist.items_in_cart
            }, {
                new: true
            }).lean(true);

            let result = await updateGrandTotal_for_supermarket(req.userData._id);

            return res.status(200).json({
                message: "Successfully Increased Quantity",
                data: result
            });
        }

        // ************ if same item increase quantity ***********


        if (!is_user_cart_exist) return res.status(403).json({
            message: "Cart Not Found."
        });

        cart_item_data.item_total_price = Number(cart_item_data.item_unit_price) * Number(cart_item_data.selected_quantity) // totall price

        if (is_user_cart_exist.store_id)
            if (is_user_cart_exist.store_id.toString() != cart_item_data.store_id.toString()) {
                await superMarketCartModel.findOneAndUpdate({
                    user_id: req.userData._id
                }, {
                    grand_total_of_cart: 0,
                    total_items_in_cart: 0,
                    items_in_cart: [],
                    superMarket_id: null
                }, {
                    new: true
                });

            }
        let cart = await superMarketCartModel.findOneAndUpdate({
            user_id: req.userData._id
        }, {
            store_id: cart_item_data.store_id,
            $push: {
                items_in_cart: cart_item_data
            }
        }, {
            new: true
        })

        if (!cart) return res.status(400).json({
            message: "Cart Could Not Be Updated"
        });

        let result = await updateGrandTotal_for_supermarket(req.userData._id);

        return res.status(200).json({
            message: "Cart Updated Successfully",
            data: result
        });


    } catch (e) {
        return res.status(400).json({
            message: e.message
        })
    }
}




exports.increaseQuantityOfSuperMarketCart = async (req, res) => {
    try {
        let cart = await superMarketCartModel.findOne({
            user_id: req.userData._id
        })

        for (var i = 0; i < cart.items_in_cart.length; i++) {
            if (req.body.cart_item_id.toString() == cart.items_in_cart[i]._id.toString()) {
                cart.items_in_cart[i].selected_quantity = cart.items_in_cart[i].selected_quantity + 1;
                cart.items_in_cart[i].item_total_price = cart.items_in_cart[i].selected_quantity * cart.items_in_cart[i].item_unit_price;
            }
        }
        cart = await cart.save();
        let result = await updateGrandTotal_for_supermarket(req.userData._id);

        res.status(200).json({
            message: "Successfully Increased Quantity",
            data: result
        });

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.decreaseQuantityOfSuperMarketCart = async (req, res) => {
    try {
        let cart = await superMarketCartModel.findOne({
            user_id: req.userData._id
        });

        for (var i = 0; i < cart.items_in_cart.length; i++) {
            if (req.body.cart_item_id.toString() == cart.items_in_cart[i]._id.toString()) {
                if (cart.items_in_cart[i].selected_quantity == 1) {
                    return res.status(400).json({
                        message: "Cannot Decrease Quantity, Need To Delete The Item"
                    });
                }
                cart.items_in_cart[i].selected_quantity = cart.items_in_cart[i].selected_quantity - 1;
                cart.items_in_cart[i].item_total_price = cart.items_in_cart[i].selected_quantity * cart.items_in_cart[i].item_unit_price;
            }
        }
        cart = await cart.save();
        let result = await updateGrandTotal_for_supermarket(req.userData._id);

        res.status(200).json({
            message: "Successfully Decreased Quantity",
            data: result
        });

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}

exports.getCartOfSuperMarketCart = async (req, res) => {
    try {

        let cart = await superMarketCartModel.findOne({
            user_id: req.userData._id
        }).populate("items_in_cart.inventory_id").populate("superMarket_id")

        if (cart.items_in_cart.length == 0)
            cart = null

        return res.status(200).json({
            message: "Success.",
            data: cart
        })

    } catch (error) {
        res.status(403).json(error.message)
    }

}

exports.removeItemFromSuperMarketCartCart = async (req, res) => {
    try {
        let cart = await superMarketCartModel.findOne({
            user_id: req.userData._id
        })
        for (var i = 0; i < cart.items_in_cart.length; i++) {
            if (req.body.cart_item_id.toString() == cart.items_in_cart[i]._id.toString()) {
                var is_deleted = cart.items_in_cart.splice(i, 1);
            }
        }
        if (!is_deleted) return res.status(400).json({
            message: "Item Not Found In Cart"
        });
        cart = await cart.save();

        let result = await updateGrandTotal_for_supermarket(req.userData._id);

        res.status(200).json({
            message: "Successfully Removed From Cart",
            data: result
        });

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}






exports.PlaceGroceryOrder = async (req, res) => {
    try {
        let cart = await superMarketCartModel.findOne({
            user_id: req.userData._id
        }).lean(true).populate("items_in_cart.inventory_id").populate("items_in_cart.inventory_id");
        if (!cart) return res.status(400).json({
            message: "Cart Not Found."
        })
        if (!cart.items_in_cart) return res.status(400).json({
            message: "Cart Is Empty"
        })

        let randomId = commonFunc.randomString()
        let item_orderd = []
        for (i = 0; i < cart.items_in_cart.length; i++) {

            await inventoryModel.findByIdAndUpdate(cart.items_in_cart[i].inventory_id, {
                $inc: {
                    "sold_count": 1
                }
            })

            item_orderd.push(cart.items_in_cart[i])
        }
        let branchs = await branchModel.findById(cart.store_id)

        let order_object = {
            item_orderd: item_orderd,
            superMarket_id: branchs.superMarket_id,
            store_id: cart.store_id,
            user_id: req.userData._id,
            order_id: randomId,
            order_amount: req.body.order_amount,
            tax_amount: req.body.tax_amount,
            discount_amount: req.body.discount_amount,
            shipping_charge: req.body.shipping_charge,
            promo_code_applied: req.body.promo_code_applied,
            order_status: "PENDING",
            payment_method: req.body.payment_method,
            address_id: req.body.address_id
        }


        let order = await GroceryOrdersModel.create(order_object);

        if (order) {
            let cartUpdated = await superMarketCartModel.findOneAndUpdate({
                user_id: req.userData._id
            }, {
                total_items_in_cart: 0,
                grand_total_of_cart: 0,
                store_id: null,
                items_in_cart: []
            }, {
                new: true
            });
        }

        //manager
        message = "Order Found";
        let manager = await branchManagerModel.findOne({
            branch_id: order.store_id
        })
        info = {
            deviceToken: manager.device_token,
            title: "Order Found",
            message: message,
            order_id: order._id,
            type: "Order"
        }
        commonFunc.sendNotification(info);
        obj = {
            notification_type: info.type,
            notification_heading: "Order Found",
            order_id: order._id,
            user_id: manager._id,
            title: "Order Found",
            body: message,
        }
        await NotificationModel.create(obj);


        //user

        let userinfo = {
            deviceToken: req.userData.device_token,
            title: "Order Placed",
            message: message,
            order_id: order._id,
            type: "Order"
        }
        commonFunc.sendNotification(userinfo);
        let userobj = {
            notification_type: userinfo.type,
            notification_heading: "Order Placed",
            order_id: order._id,
            user_id: req.userData._id,
            title: "Order Placed",
            body: message,
        }
        await NotificationModel.create(userobj);

        ///notification part end



        res.status(200).json({
            message: "Successfully Placed Order.",
            data: order
        });

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
    }
}


exports.MyGroceryOrders = async (req, res) => {
    try {

        // let query1 = {
        //     order_status: {
        //         $ne: 'CANCELLEDBYUSER'
        //     },
        //     order_status: {
        //         $ne: 'DELIVERED'
        //     },
        // }

        // let onGoingOrder = await GroceryOrdersModel.find(query1)

        let order = await GroceryOrdersModel.find({
            user_id: req.userData._id
        }).sort({
            _id: -1
        }).populate("store_id").populate("user_id").populate('address_id').lean(true)

        res.status(200).json({
            message: "Successfully Fetched Order's List",
            data: order
        });

    } catch (e) {
        return res.status(400).json({
            message: e.message
        });
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


exports.get_offers_restro = async (req, res) => {
    try {
        let offer = await offerModel.find({
            $or: [{
                restaurant_id: req.query.restaurant_id
            }, {
                created_by: "ADMIN"
            }]
        })

        if (offer) return res.status(200).json({
            data: offer,
            message: "success"
        })
        else return res.status(403).json({
            message: "offer not found"
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

exports.get_offers_supermarket = async (req, res) => {
    try {
        let offer = await superMarketOfferModel.find({
            $or: [{
                superMarket_id: req.query.superMarket_id
            }, {
                created_by: "ADMIN"
            }]
        })

        if (offer) return res.status(200).json({
            data: offer,
            message: "success"
        })
        else return res.status(403).json({
            message: "offer not found"
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

exports.cancel_order_store = async (req, res) => {
    try {
        let order = await GroceryOrdersModel.findById(req.body._id)
        console.log(order.order_status)
        if (order.order_status != "PENDING")
            return res.status(403).json({
                message: "order can not be cancel"
            })
        order = await GroceryOrdersModel.findByIdAndUpdate(req.body._id, {
            order_status: "CANCELLEDBYUSER"
        }, {
            new: true
        })
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

exports.cancel_order_restaurant = async (req, res) => {
    try {
        let order = await OrderModel.findById(req.body._id)
        if (order.order_status != "PENDING")
            return res.status(403).json({
                message: "order can not be cancel"
            })
        order = await OrderModel.findByIdAndUpdate(req.body._id, {
            order_status: "CANCELLEDBYUSER"
        }, {
            new: true
        })
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


exports.rating_restaurant = async (req, res) => {
    try {
        if (typeof req.body.item_rating_obj == 'string')
            req.body.item_rating_obj = JSON.parse(req.body.item_rating_obj)

        let ratingData_for_restro = {
            order_id: req.body.order_id,
            rate: req.body.rate,
            review: req.body.review,
            restaurant_id: req.body.restaurant_id,
            user_id: req.userData._id
        }
        for (i = 0; i < req.body.item_rating_obj.length; i++) {
            let ratingData_for_item = {
                order_id: req.body.order_id,
                item_id: item_rating_obj[i].item_id,
                rate: item_rating_obj[i].rate,
                review: item_rating_obj[i].review,
                restaurant_id: req.body.restaurant_id,
                user_id: req.userData._id
            }
            await restaurantItemRatingModel.create(ratingData_for_item)
        }

        let rating = await restaurantRatingModel.create(ratingData_for_restro)

        return res.status(200).json({
            message: "Success"
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}