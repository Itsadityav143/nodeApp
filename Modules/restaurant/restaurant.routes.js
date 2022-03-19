const express = require('express');

const restaurantManagement = require("./restaurant.controller");
const auth = require("../auth/middleware");
// const driverManagement = require("./driver_management.controller");

const router = express.Router();

router.post('/create_menu', auth.restaurantVerifyToken, restaurantManagement.createMenu);
router.post('/update_menu', auth.restaurantVerifyToken, restaurantManagement.updateMenu);
router.post('/remove_menu', auth.restaurantVerifyToken, restaurantManagement.removeMenu);
router.get('/get_menu_list', auth.restaurantVerifyToken, restaurantManagement.getMenuList);
router.get('/get_revenue', auth.restaurantVerifyToken, restaurantManagement.get_revenue);
router.post('/add_dish', restaurantManagement.add_dish);
router.post('/update_dish', restaurantManagement.update_dish);
router.post('/remove_dish', restaurantManagement.remove_dish);
router.get('/get_all_dish', auth.restaurantVerifyToken, restaurantManagement.get_all_dish);
router.post('/dish_status', auth.restaurantVerifyToken, restaurantManagement.dish_status);
router.post('/restaurant_on_off', auth.restaurantVerifyToken, restaurantManagement.restaurant_on_off);


router.post('/add_offer', auth.restaurantVerifyToken, restaurantManagement.add_offer);
router.post('/update_offer', restaurantManagement.update_offer);
router.post('/delete_offer', restaurantManagement.delete_offer);
router.get('/get_offers', auth.restaurantVerifyToken, restaurantManagement.get_offers);

router.post('/order_accept_reject', restaurantManagement.order_accept_reject);
router.get('/get_all_orders', auth.restaurantVerifyToken, restaurantManagement.get_all_orders);
router.post('/update_order_status', restaurantManagement.update_order_status);

router.post('/create_promotion', auth.restaurantVerifyToken, restaurantManagement.create_promotion);
router.post('/update_promotion', restaurantManagement.update_promotion);
router.post('/delete_promotion', restaurantManagement.delete_promotion);
router.get('/get_promotion', auth.restaurantVerifyToken, restaurantManagement.get_promotion);

router.get('/getMyNotifications', auth.restaurantVerifyToken, restaurantManagement.getMyNotifications);
router.post('/markNotificationsAsRead', auth.restaurantVerifyToken, restaurantManagement.markNotificationsAsRead);

exports.Router = router;
