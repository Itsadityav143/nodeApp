const storeController = require("./store.controller")
const auth = require("./../auth/middleware")
const express = require("express")
const router = express.Router()

router.get('/get_inventory', auth.managerToken, storeController.get_inventory);
router.post('/get_inventory_by_barcode', storeController.get_inventory_by_barcode);
router.get('/get_all_orders', auth.managerToken, storeController.get_all_orders);
router.post('/update_inventory', storeController.update_inventory);
router.post('/order_accept_reject', storeController.order_accept_reject);
router.post('/findDriver', storeController.searchDriver);
router.post('/change_order_status', storeController.update_order_status);
router.get('/getMyNotifications', auth.managerToken, storeController.getMyNotifications);
router.post('/markNotificationsAsRead', auth.managerToken, storeController.markNotificationsAsRead);
router.get('/get_store_income', auth.managerToken, storeController.get_store_income);




exports.Router = router;