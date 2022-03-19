const superMarketController = require("./supermarket.controller")
const auth = require("./../auth/middleware")
const express = require("express")
const router = express.Router()

router.post('/add_branch', auth.superMarketVerifyToken, superMarketController.add_branch);
router.post('/update_branch', superMarketController.update_branch);
router.post('/delete_branch', superMarketController.delete_branch);
router.get('/get_branches', auth.superMarketVerifyToken, superMarketController.get_branches);

router.post('/add_branch_manager', auth.superMarketVerifyToken, superMarketController.add_branch_manager);
router.post('/update_branch_manager', superMarketController.update_branch_manager);
router.post('/delete_branch_manager', superMarketController.delete_branch_manager);
router.get('/get_branch_managers', auth.superMarketVerifyToken, superMarketController.get_branch_managers);

router.post('/add_subCategories', superMarketController.add_subCategories);
router.post('/update_subCategories', superMarketController.update_subCategories);
router.post('/delete_subCategories', superMarketController.delete_subCategories);
router.get('/get_subCategories', auth.superMarketVerifyToken, superMarketController.get_subCategories);

router.post('/add_product', superMarketController.add_product);
router.post('/update_product', superMarketController.update_product);
router.post('/delete_product', superMarketController.delete_product);
router.get('/get_product', auth.superMarketVerifyToken, superMarketController.get_product);
router.get('/get_inventory', superMarketController.get_inventory);
router.post('/update_inventory', superMarketController.update_inventory);
router.get('/get_orders', auth.superMarketVerifyToken, superMarketController.get_orders);

router.post('/create_offer', auth.superMarketVerifyToken, superMarketController.add_offer);
router.post('/update_offer', superMarketController.update_offer);
router.post('/delete_offer', superMarketController.delete_offer);
router.get('/get_offers', auth.superMarketVerifyToken, superMarketController.get_offers);

router.get('/getMyNotifications', auth.superMarketVerifyToken, superMarketController.getMyNotifications);
router.post('/markNotificationsAsRead', auth.superMarketVerifyToken, superMarketController.markNotificationsAsRead);
router.get('/get_reports', auth.superMarketVerifyToken, superMarketController.get_reports);
router.get('/get_Dashboard', auth.superMarketVerifyToken, superMarketController.get_Dashboard);



exports.Router = router;