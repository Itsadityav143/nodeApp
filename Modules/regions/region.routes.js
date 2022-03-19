const regionController = require("./region.controller");
let auth = require("../auth/middleware")
const express = require('express');
const router = express.Router();

router.post('/AddCountry', regionController.AddCountry);
router.get('/getCountry', regionController.getCountry);
router.post('/AddRegion', regionController.AddRegion);

router.post('/updateRegion', regionController.updateRegion);

router.post('/deleteRegion', regionController.deleteRegion);

router.post('/getCountryRegion', regionController.getCountryRegion);
router.post('/isinsideIntheRegion', regionController.isinsideIntheRegion);

exports.Router = router;