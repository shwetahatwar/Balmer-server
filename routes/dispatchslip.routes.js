var express = require('express');
var router = express.Router();
var dispatchslips = require('../controllers/dispatchslip.controller');
var users = require('../controllers/user.controller');

router.post("/", users.loginRequired,dispatchslips.create);
router.get("/", users.loginRequired,dispatchslips.findAll);
router.get("/:id", users.loginRequired,dispatchslips.findOne);
router.put("/:id", users.loginRequired,dispatchslips.update);

router.get("/:dispatchSlipId/dispatchslipmaterials", users.loginRequired,dispatchslips.getDispatchSlipMaterialLists);
router.post("/:dispatchSlipId/dispatchslipmaterials", users.loginRequired,dispatchslips.postDispatchSlipMaterialLists);
router.get("/:dispatchSlipId/dispatchslipmaterials/:id", users.loginRequired,dispatchslips.getDispatchSlipMaterialList);
router.put("/:dispatchSlipId/dispatchslipmaterials/:id", users.loginRequired,dispatchslips.putDispatchSlipMaterialList);

router.get("/:dispatchId/dispatchslippickedmaterials", users.loginRequired,dispatchslips.getDispatchSlipPickingMaterialLists);
router.post("/:dispatchId/dispatchslippickedmaterials", users.loginRequired,dispatchslips.postDispatchSlipPickingMaterialLists);
router.get("/:dispatchId/dispatchslippickedmaterials/:id", users.loginRequired,dispatchslips.getDispatchSlipPickingMaterialList);
router.put("/:dispatchId/dispatchslippickedmaterials/:id", users.loginRequired,dispatchslips.putDispatchSlipPickingMaterialList);

router.get("/:dispatchId/dispatchsliploadermaterials", users.loginRequired,dispatchslips.getDispatchSlipLoadingMaterialLists);
router.post("/:dispatchId/dispatchsliploadermaterials", users.loginRequired,dispatchslips.postDispatchSlipLoadingMaterialLists);
router.get("/:dispatchId/dispatchsliploadermaterials/:id", users.loginRequired,dispatchslips.getDispatchSlipLoadingMaterialList);
router.put("/:dispatchId/dispatchsliploadermaterials/:id", users.loginRequired,dispatchslips.putDispatchSlipLoadingMaterialList);

router.get("/dashboard/count", users.loginRequired,dispatchslips.getDispatchSlipCountDashboard);
router.get("/get/getbydate", users.loginRequired,dispatchslips.getDispactSlipByDate);

module.exports = router;