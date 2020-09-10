var express = require('express');
var router = express.Router();
var materialinwards = require('../controllers/materialinward.controller');
var users = require('../controllers/user.controller');
var materials = require('../controllers/material.controller');
var serialNumberHelper = require('../helpers/serialNumberHelper');
var inventorytransactions = require('../controllers/inventorytransaction.controller');
var materialtransactions = require('../controllers/materialtransaction.controller');

router.post("/", users.loginRequired,materialinwards.create);

router.post("/bulkupload", users.loginRequired,
  materials.findForMaterialInward,
  materialinwards.findForMaterialInward,
  serialNumberHelper.getSerailNumbers,
  materialinwards.materialInwardBulkUpload,
  materialtransactions.MaterialInwardTransactions,
  inventorytransactions.MaterialInwardTransactions,
  materialinwards.sendResponse
  );

router.get("/", users.loginRequired,materialinwards.findAll);
router.get("/:id", users.loginRequired,materialinwards.findOne);
router.put("/:id", users.loginRequired,materialinwards.update);
router.put("/update/updateWithBarcode", users.loginRequired,materialinwards.updateWithBarcode);
router.put("/update/updateScrapAndRecover", users.loginRequired,materialinwards.updateScrapAndRecover);
router.get("/get/findAllByBatchCode", users.loginRequired,materialinwards.findAllByBatchCode);
router.get("/get/findAllByMaterialCode", users.loginRequired,materialinwards.findAllByMaterialCode);
router.get("/get/findAllByMaterialCodeandBatchCode", users.loginRequired,materialinwards.findAllByMaterialCodeandBatchCode);
router.get("/get/findAllByBarcode", users.loginRequired,materialinwards.findAllByBarcode);
// router.get("/get/findMaterialByQuery", users.loginRequired,materialinwards.findMaterialByQuery);
 router.get("/get/findMaterialByQuery", users.loginRequired,materialinwards.findMaterialBySearchQuery);

router.get("/get/getCount", users.loginRequired,materialinwards.countOfStockForDashboard);
router.get("/get/productionreportdata", users.loginRequired,materialinwards.ProductionReportData);
router.get("/get/getScrappedCount", users.loginRequired,materialinwards.countOfScrappedForDashboard);
router.get("/reprint/get", users.loginRequired,materialinwards.findMaterialForReprint);

module.exports = router;
