const walletController = require("./wallet.controller");
let auth = require("../auth/middleware")
const express = require('express');
const router = express.Router();

router.post('/addMoneyToWallet',auth.verifyToken, walletController.addMoneyToWallet);
router.post('/sendMoney',auth.verifyToken, walletController.sendMoney);
router.get('/getWalletAmount',auth.verifyToken, walletController.getWalletAmount);

router.post('/searchNumber', walletController.searchNumber);

router.get('/recentUsers',auth.verifyToken , walletController.recentUsers);

router.post('/getUserById',walletController.getUserById);
router.get('/getWalletHistory',auth.verifyToken, walletController.getWalletHistory);

exports.Router = router;