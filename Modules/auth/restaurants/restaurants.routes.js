const restaurantController = require("./restaurants.controller");
let auth = require("../middleware")
const express = require('express');
const router = express.Router();



router.post('/signup', restaurantController.signUp);
router.post('/updateProfile', auth.restaurantVerifyToken, restaurantController.updateProfile);
router.post('/login', restaurantController.login);
router.post("/logout", auth.restaurantVerifyToken, restaurantController.logout);
router.post("/sendOtp", restaurantController.sendOtp);
router.post("/verifyOtp", restaurantController.verifyOtp);
router.post("/resetPassword", restaurantController.resetPassword);
router.post("/changePassword", auth.restaurantVerifyToken, restaurantController.changePassword);
router.get("/checkStatus", auth.restaurantVerifyToken, restaurantController.checkStatus);


exports.Router = router;