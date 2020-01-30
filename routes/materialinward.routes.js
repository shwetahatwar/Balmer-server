// module.exports = app => {
//   const materialinwards = require("../controllers/materialinward.controller.js");
//   const users = require("../controllers/materialinward.controller.js");

//   var router = require("express").Router();

//   // Create a new Tutorial
//   router.post("/", users.loginRequired,materialinwards.create);

//   // Retrieve all Tutorials
//   router.get("/", users.loginRequired,materialinwards.findAll);

//   // Retrieve all published Tutorials
//   router.get("/published", users.loginRequired,materialinwards.findAllPublished);

//   // Retrieve a single Tutorial with id
//   router.get("/:id", users.loginRequired,materialinwards.findOne);

//   // Update a Tutorial with id
//   router.put("/:id", users.loginRequired,materialinwards.update);

//   // Delete a Tutorial with id
//   router.delete("/:id", users.loginRequired,materialinwards.delete);

//   // Create a new Tutorial
//   router.delete("/", users.loginRequired,materialinwards.deleteAll);

//   app.use('/api/materialinwards', router);
// };

var express = require('express');
var router = express.Router();
var materialinwards = require('../controllers/materialinward.controller');
var users = require('../controllers/user.controller');

// router.post('/', userController.loginRequired,assetController.create);
// router.get('/', userController.loginRequired,assetController.list);
// router.get('/:id', userController.loginRequired,assetController.get);
// router.get('/assetDetail/barcodeSerial/:id', userController.loginRequired,assetController.getAssetWithBarcode);
// router.put('/:id', userController.loginRequired,assetController.update);
// router.put('/depreciation/update/:id', userController.loginRequired,assetController.updateDepreciation);
// router.delete('/:id', departmentsController.destroy);

router.post("/", users.loginRequired,materialinwards.create);
router.get("/", users.loginRequired,materialinwards.findAll);
router.put("/update/updateWithBarcode", users.loginRequired,materialinwards.updateWithBarcode);
router.put("/update/updateScrapAndRecover", users.loginRequired,materialinwards.updateScrapAndRecover);
router.get("/get/findAllByBatchCode", users.loginRequired,materialinwards.findAllByBatchCode);
router.get("/get/findAllByMaterialCode", users.loginRequired,materialinwards.findAllByMaterialCode);
router.get("/get/findAllByMaterialCodeandBatchCode", users.loginRequired,materialinwards.findAllByMaterialCodeandBatchCode);

module.exports = router;
