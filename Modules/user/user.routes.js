const express = require('express');

// const userManagement = require("./user_management.controller");
const auth = require("../auth/middleware");
const userManagement = require("../user/user.controller");
// const driverManagement = require("./driver_management.controller");

const router = express.Router();

router.post('/add_address', auth.verifyToken, userManagement.addAddress);
router.post('/update_address', userManagement.updateAddress);
router.post('/remove_address', auth.verifyToken, userManagement.removeAddress);
router.get('/get_address_details', auth.verifyToken, userManagement.getAddress);
router.get('/my_addresses', auth.verifyToken, userManagement.getAddressList);
router.get('/get_restaurant_list', auth.verifyToken, userManagement.get_restaurant_list);
router.get('/get_restaurant_details', auth.verifyToken, userManagement.get_restaurant_details);
router.post('/add_fav_restaurant', auth.verifyToken, userManagement.add_fav_restaurant);
router.post('/remove_fav_restaurant', auth.verifyToken, userManagement.remove_fav_restaurant);
router.get('/get_fav_restaurants', auth.verifyToken, userManagement.get_fav_restaurants);
router.post("/get_home_screen", auth.verifyToken, userManagement.get_home_screen);
router.post('/restaurant/addItemToCart', auth.verifyToken, userManagement.addItemToCart);
router.post('/restaurant/increaseQuantity', auth.verifyToken, userManagement.increaseQuantity);
router.post('/restaurant/decreaseQuantity', auth.verifyToken, userManagement.decreaseQuantity);
router.post('/restaurant/removeItemFromCart', auth.verifyToken, userManagement.removeItemFromCart);
router.get('/restaurant/getCart', auth.verifyToken, userManagement.getCart);
router.post('/restaurant/placeOrder', auth.verifyToken, userManagement.placeOrder);
router.get('/restaurant/getMyOrders', auth.verifyToken, userManagement.getMyOrders);
router.post('/restaurant/getOffers', auth.verifyToken, userManagement.get_offers_restro);
router.post('/restaurant/cancel_order', userManagement.cancel_order_store);
router.post('/restaurant/rating_item_and_restaurant', auth.verifyToken, userManagement.rating_restaurant);


router.post("/grocery/home_screen", auth.verifyToken, userManagement.grocery_home_screen);
router.post("/grocery/get_stores", auth.verifyToken, userManagement.get_stores);
router.get("/grocery/get_inventory_items", auth.verifyToken, userManagement.get_inventory_items);
router.post('/grocery/cancel_order', userManagement.cancel_order_store);
router.get('/grocery/search_products_getInventory',userManagement.search_products_getInventory)

router.post("/grocery/get_subcategories", auth.verifyToken, userManagement.get_subcategories);

router.post('/superMarket/addItemToCart', auth.verifyToken, userManagement.addItemToSuperMarketCart);
router.post('/superMarket/increaseQuantity', auth.verifyToken, userManagement.increaseQuantityOfSuperMarketCart);
router.post('/superMarket/decreaseQuantity', auth.verifyToken, userManagement.decreaseQuantityOfSuperMarketCart);
router.post('/superMarket/removeItemFromCart', auth.verifyToken, userManagement.removeItemFromSuperMarketCartCart);
router.get('/superMarket/getCart', auth.verifyToken, userManagement.getCartOfSuperMarketCart);

router.post('/superMarket/PlaceGroceryOrder', auth.verifyToken, userManagement.PlaceGroceryOrder);

router.get('/superMarket/MyGroceryOrders', auth.verifyToken, userManagement.MyGroceryOrders);
router.get('/superMarket/getOffers', userManagement.get_offers_supermarket);

router.get('/getMyNotifications', auth.verifyToken, userManagement.getMyNotifications);
router.post('/markNotificationsAsRead', auth.verifyToken, userManagement.markNotificationsAsRead);



exports.Router = router;
