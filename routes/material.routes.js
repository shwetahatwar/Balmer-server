var express = require('express');
var router = express.Router();
var materials = require('../controllers/material.controller');
var users = require('../controllers/user.controller');

// router.post('/', userController.loginRequired,assetController.create);
// router.get('/', userController.loginRequired,assetController.list);
// router.get('/:id', userController.loginRequired,assetController.get);
// router.get('/assetDetail/barcodeSerial/:id', userController.loginRequired,assetController.getAssetWithBarcode);
// router.put('/:id', userController.loginRequired,assetController.update);
// router.put('/depreciation/update/:id', userController.loginRequired,assetController.updateDepreciation);
// router.delete('/:id', departmentsController.destroy);

router.post("/", users.loginRequired,materials.create);
router.get("/", users.loginRequired,materials.findAll);
router.get("/get/findByMaterialCode", users.loginRequired,materials.findByMaterialCode);

module.exports = router;