var express = require('express');
var router = express.Router();
var dispatchslipmateriallists = require('../controllers/dispatchslipmateriallist.controller');
var users = require('../controllers/user.controller');

router.post("/", users.loginRequired,dispatchslipmateriallists.create);
router.get("/", users.loginRequired,dispatchslipmateriallists.findAll);
router.get("/:id", users.loginRequired,dispatchslipmateriallists.findOne);
router.get("/get/findByDispatchSlip", users.loginRequired,dispatchslipmateriallists.getDispatchSlipMaterialListByDispatchSlipId);

module.exports = router;