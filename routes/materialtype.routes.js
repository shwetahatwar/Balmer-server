var express = require('express');
var router = express.Router();
var materialtypes = require('../controllers/materialtype.controller');
var users = require('../controllers/user.controller');

// router.post('/', userController.loginRequired,assetController.create);
// router.get('/', userController.loginRequired,assetController.list);
// router.get('/:id', userController.loginRequired,assetController.get);
// router.get('/assetDetail/barcodeSerial/:id', userController.loginRequired,assetController.getAssetWithBarcode);
// router.put('/:id', userController.loginRequired,assetController.update);
// router.put('/depreciation/update/:id', userController.loginRequired,assetController.updateDepreciation);
// router.delete('/:id', departmentsController.destroy);

router.post("/", users.loginRequired,materialtypes.create);
router.get("/", users.loginRequired,materialtypes.getAll);
router.get("/:id", users.loginRequired,materialtypes.getById);

module.exports = router;