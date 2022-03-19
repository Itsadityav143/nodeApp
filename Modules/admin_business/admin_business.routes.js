const express = require('express');

const userManagement = require("./user_management.controller");
const applicattionManagement = require("./application_management.controller")
const bannerManagement = require("./bannercontroller");
const walletManagement = require("./wallet_management.controller")
const cuisineManagement = require("./cuisine_management.controller");
const driverManagement = require("./driver_management.controller");
const superMarketManagement = require("./superMarketController");
const storeManagement = require("./store_management");





const router = express.Router();
router.get('/store/get_grocery_orders', storeManagement.get_grocery_orders);
router.get('/get_user_list', userManagement.get_user_list);
router.post('/delete_user', userManagement.delete_user);
router.post('/block_user', userManagement.block_user);

router.post('/create_module', applicattionManagement.create_module);
router.get('/get_module', applicattionManagement.get_module);
router.post('/delete_module', applicattionManagement.delete_module);
router.post('/update_module', applicattionManagement.update_module);

router.post("/createBanner", bannerManagement.createBanner);
router.post("/updateBanner", bannerManagement.updateBanner);
router.post("/deleteBanner", bannerManagement.deleteBanner);

router.get("/getBanners", bannerManagement.getBanner);

router.get("/transaction_list", walletManagement.transaction_list)
router.get("/get_restaurent_list", applicattionManagement.get_restaurent_list)
router.post('/approve_disapprove_restaurant', applicattionManagement.approve_disapprove_restaurant);


router.post('/create_cuisine', cuisineManagement.create_cuisine);
router.get('/get_cuisine', cuisineManagement.get_cuisine);
router.post('/delete_cuisine', cuisineManagement.delete_cuisine);
router.post('/update_cuisine', cuisineManagement.update_cuisine);

router.post('/block_driver', driverManagement.block_driver);
router.post('/delete_driver', driverManagement.delete_driver);

router.get('/get_drivers_list', driverManagement.get_drivers_list);
router.post('/approve_disapprove_driver', driverManagement.approve_disapprove_driver);

router.post('/block_superMarket', superMarketManagement.block_superMarket);
router.post('/delete_superMarket', superMarketManagement.delete_superMarket);
router.get('/get_superMarkets_list', superMarketManagement.get_superMarkets_list);
router.post('/approve_disapprove_superMarket', superMarketManagement.approve_disapprove_superMarket);

router.post('/add_categories', superMarketManagement.add_category);
router.post('/update_categories', superMarketManagement.update_category);
router.post('/delete_categories', superMarketManagement.delete_category);
router.get('/get_categories', superMarketManagement.get_category);

router.post('/superMarket/create_banner', superMarketManagement.create_banner);
router.post('/superMarket/update_banner', superMarketManagement.update_banner);
router.post('/superMarket/delete_banner', superMarketManagement.delete_banner);
router.get('/superMarket/get_banners', superMarketManagement.get_banners);


router.post('/superMarket/create_offer', superMarketManagement.add_offer);
router.post('/superMarket/update_offer', superMarketManagement.update_offer);
router.post('/superMarket/delete_offer', superMarketManagement.delete_offer);
router.get('/superMarket/get_offers', superMarketManagement.get_offers);
router.post('/create_faq', superMarketManagement.createFaq);
router.post('/update_faq', superMarketManagement.updateFaq);
router.post('/remove_faq', superMarketManagement.removeFaq);
router.get('/get_Faq', superMarketManagement.getFaq);

router.post('/restaurant/add_offer', applicattionManagement.add_offer);
router.post('/restaurant/update_offer', applicattionManagement.update_offer);
router.post('/restaurant/delete_offer', applicattionManagement.delete_offer);
router.get('/restaurant/get_offers', applicattionManagement.get_offers);

router.post('/createContent', superMarketManagement.createContent);
router.get('/readContent', superMarketManagement.readContent);


router.post('/restaurant/create_banner', superMarketManagement.create_banner);
router.post('/restaurant/update_banner', superMarketManagement.update_banner);
router.post('/restaurant/delete_banner', superMarketManagement.delete_banner);
router.get('/restaurant/get_banners', superMarketManagement.get_banners);
exports.Router = router;