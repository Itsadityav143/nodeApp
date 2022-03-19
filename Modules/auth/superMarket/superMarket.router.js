const superMarketController = require("./superMarket.controller")
const auth = require("../middleware")
const express = require("express")
const router = express.Router()

router.post('/signup', superMarketController.signup);
router.post('/login', superMarketController.login);
router.post("/sendOtp", superMarketController.sendOtp);
router.post("/logout", auth.superMarketVerifyToken, superMarketController.logout);
router.post("/verifyOtp", superMarketController.verifyOtp);
router.post("/updateProfile", auth.superMarketVerifyToken, superMarketController.updateProfile);
router.get("/checkStatus", auth.superMarketVerifyToken, superMarketController.checkStatus);
router.post("/forgotPassword", superMarketController.forgotPassword);
router.post("/changePassword", auth.superMarketVerifyToken, superMarketController.changePassword);
router.post("/resetPassword", superMarketController.resetPassword);





exports.Router = router;