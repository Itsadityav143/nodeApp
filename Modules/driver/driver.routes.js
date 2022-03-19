const express = require('express');

const driver = require("./driver.controller");
const auth = require("../auth/middleware");
// const driverManagement = require("./driver_management.controller");

const router = express.Router();
router.get("/restaurant/getOrders", auth.driverVerifyToken, driver.getOrders);

router.post("/restaurant/changeOrderStatus", auth.driverVerifyToken, driver.changeOrdersStatus);
router.post("/restaurant/acceptRejectOrder", auth.driverVerifyToken, driver.acceptRejectOrder);


router.get("/store/getOrders", auth.driverVerifyToken, driver.get_orders_store);
router.post("/store/changeOrderStatus", auth.driverVerifyToken, driver.changeOrdersStatus_store);
router.post("/store/acceptRejectOrder", auth.driverVerifyToken, driver.order_accept_reject_store);


router.get('/getMyNotifications', auth.driverVerifyToken, driver.getMyNotifications);
router.post('/markNotificationsAsRead', auth.driverVerifyToken, driver.markNotificationsAsRead);

exports.Router = router;