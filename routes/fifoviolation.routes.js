var express = require('express');
var router = express.Router();
var fifoviolationlists = require('../controllers/fifoviolation.controller');
var users = require('../controllers/user.controller');

router.get("/", users.loginRequired,fifoviolationlists.findAll);
router.get("/:id", users.loginRequired,fifoviolationlists.findOne);
router.get("/get/getbydate", users.loginRequired,fifoviolationlists.findByDatewise);
router.get("/get/dashboardCount", users.loginRequired,fifoviolationlists.dashboardDataCount);

module.exports = router;