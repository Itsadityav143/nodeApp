const userController = require("./user.controller");
let auth = require("../middleware")
const express = require('express');
const router = express.Router();

router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.post("/logout", auth.verifyToken, userController.logout);
router.post("/sendOtp", userController.sendOtp);
router.post("/verifyOtp", userController.verifyOtp);
router.post("/resetPassword", userController.resetPassword);
router.post("/changePassword", auth.verifyToken, userController.changePassword);
router.post("/updateProfile", auth.verifyToken, userController.updateProfile);



exports.Router = router;