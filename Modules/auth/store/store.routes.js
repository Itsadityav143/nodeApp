const storeController = require("./store.controller")
const auth = require("../middleware")
const express = require("express")
const router = express.Router()


router.post('/sendOtp', storeController.sendOtp);
router.post('/verifyOtp', storeController.verifyOtp);


exports.Router = router;