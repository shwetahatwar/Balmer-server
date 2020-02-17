var express = require('express');
var router = express.Router();
var dispatchloaderrelations = require('../controllers/dispatchloaderrelation.controller');
var users = require('../controllers/user.controller');

router.post("/", users.loginRequired,dispatchloaderrelations.create);
router.get("/", users.loginRequired,dispatchloaderrelations.getAll);
router.get("/:id", users.loginRequired,dispatchloaderrelations.getById);
router.get("/dispatchslips/:dispatchId/users", users.loginRequired,dispatchloaderrelations.getUsersbyDispatchSlip);
router.get("/users/:userId/dispatchslips", users.loginRequired,dispatchloaderrelations.getDispatchSlipbyUser);

module.exports = router;