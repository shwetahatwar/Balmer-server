var express = require('express');
var router = express.Router();
var packagingtypes = require('../controllers/packagingtype.controller');
var users = require('../controllers/user.controller');

// router.post('/', userController.loginRequired,assetController.create);
// router.get('/', userController.loginRequired,assetController.list);
// router.get('/:id', userController.loginRequired,assetController.get);
// router.get('/assetDetail/barcodeSerial/:id', userController.loginRequired,assetController.getAssetWithBarcode);
// router.put('/:id', userController.loginRequired,assetController.update);
// router.put('/depreciation/update/:id', userController.loginRequired,assetController.updateDepreciation);
// router.delete('/:id', departmentsController.destroy);

router.post("/", users.loginRequired,packagingtypes.create);
router.get("/", users.loginRequired,packagingtypes.getAll);
router.get("/:id", users.loginRequired,packagingtypes.getById);

module.exports = router;