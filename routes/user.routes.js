// var express = require('express');
// var router = express.Router();
// var usersController = require('../controllers').users;
// var authController = require('../controllers/auth');

// /* GET users listing. */
// // router.get('/', function(req, res, next) {
// //   res.send('respond with a resource');
// // });

// router.post('/register', usersController.create);
// router.post('/sign_in', usersController.sign_in);
// // router.get('/', authController.isAuthenticated,usersController.getUsers);
// // router.get('/:id', authController.isAuthenticated,usersController.getUser);
// router.get('/', usersController.getUsers);
// router.get('/:id', usersController.getUser);
// router.put('/:id', usersController.updateUser);

// module.exports = router;

// module.exports = app => {
//   const users = require("../controllers/user.controller.js");

//   var router = require("express").Router();

//   // Create a new Tutorial
//   router.post("/", users.create);
//   router.post('/register', users.create);
//   router.post('/sign_in', users.sign_in);

//   // Retrieve all Tutorials
//   router.get("/", users.findAll);

//   // Retrieve all published Tutorials
//   // router.get("/published", materialinwards.findAllPublished);

//   // Retrieve a single Tutorial with id
//   router.get("/:id", users.findOne);

//   // Update a Tutorial with id
//   router.put("/:id", users.update);

//   // Delete a Tutorial with id
//   router.delete("/:id", users.delete);

//   // Create a new Tutorial
//   router.delete("/", users.deleteAll);

//   app.use('/api/users', router);
// };

var express = require('express');
var router = express.Router();
var users = require('../controllers/user.controller');

// router.post('/', userController.loginRequired,assetController.create);
// router.get('/', userController.loginRequired,assetController.list);
// router.get('/:id', userController.loginRequired,assetController.get);
// router.get('/assetDetail/barcodeSerial/:id', userController.loginRequired,assetController.getAssetWithBarcode);
// router.put('/:id', userController.loginRequired,assetController.update);
// router.put('/depreciation/update/:id', userController.loginRequired,assetController.updateDepreciation);
// router.delete('/:id', departmentsController.destroy);

router.post("/sign_in", users.sign_in);
router.post("/", users.create);
router.get("/", users.findAll);
router.get("/:id", users.findOne);
router.put("/:id", users.update);

module.exports = router;