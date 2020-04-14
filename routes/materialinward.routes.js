var express = require('express');
var router = express.Router();
var materialinwards = require('../controllers/materialinward.controller');
var users = require('../controllers/user.controller');

router.post("/", users.loginRequired,materialinwards.create);
router.get("/", users.loginRequired,materialinwards.findAll);
router.get("/:id", users.loginRequired,materialinwards.findOne);
router.put("/:id", users.loginRequired,materialinwards.update);
router.put("/update/updateWithBarcode", users.loginRequired,materialinwards.updateWithBarcode);
router.put("/update/updateScrapAndRecover", users.loginRequired,materialinwards.updateScrapAndRecover);
router.get("/get/findAllByBatchCode", users.loginRequired,materialinwards.findAllByBatchCode);
router.get("/get/findAllByMaterialCode", users.loginRequired,materialinwards.findAllByMaterialCode);
router.get("/get/findAllByMaterialCodeandBatchCode", users.loginRequired,materialinwards.findAllByMaterialCodeandBatchCode);
router.get("/get/findAllByBarcode", users.loginRequired,materialinwards.findAllByBarcode);
router.get("/get/findMaterialByQuery", users.loginRequired,materialinwards.findMaterialByQuery);
router.get("/get/getCount", users.loginRequired,materialinwards.countOfStockForDashboard);
router.get("/get/productionreportdata", users.loginRequired,materialinwards.ProductionReportData);

module.exports = router;
