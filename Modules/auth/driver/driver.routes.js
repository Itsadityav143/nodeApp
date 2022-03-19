const driverController = require("./driver.controller");
let auth = require("../middleware")
const express = require('express');
const router = express.Router();

router.post('/signup', driverController.signup);
router.post('/login', driverController.login);
router.post("/logout", auth.driverVerifyToken, driverController.logout);
router.post("/sendOtp", driverController.sendOtp);
router.post("/verifyOtp", driverController.verifyOtp);
router.post("/resetPassword", driverController.resetPassword);
router.post("/updateProfile", auth.driverVerifyToken, driverController.updateProfile);
router.post("/updateBankDetails", auth.driverVerifyToken, driverController.updateBankDetails);
router.post("/driverActiveInactive", auth.driverVerifyToken, driverController.driverActiveInactive);
router.post("/changePassword", auth.driverVerifyToken, driverController.changePassword);
//router.get("/checkStatus",auth.driverVerifyToken, driverController.checkStatus);

router.get("/check_status", auth.driverVerifyToken, driverController.check_status);
router.post("/enable_orders", auth.driverVerifyToken, driverController.enableOrders);



exports.Router = router;