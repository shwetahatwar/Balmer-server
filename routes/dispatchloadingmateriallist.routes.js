var express = require('express');
var router = express.Router();
var dispatchloadingmateriallists = require('../controllers/dispatchloadingmateriallist.controller');
var users = require('../controllers/user.controller');

router.post("/", users.loginRequired,dispatchloadingmateriallists.create);
router.get("/", users.loginRequired,dispatchloadingmateriallists.getAll);
router.get("/:id", users.loginRequired,dispatchloadingmateriallists.getById);
router.get("/getbydispatchslip/:id", users.loginRequired,dispatchloadingmateriallists.getAllByDispatchSlipId);
module.exports = router;