const adminController = require("./admin.controller");
let auth = require("../middleware")
const express = require('express');
const router = express.Router();

router.post('/login', adminController.login);
router.post('/changePassword', adminController.changePassword);




exports.Router = router;