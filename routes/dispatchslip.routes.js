var express = require('express');
var router = express.Router();
var dispatchslips = require('../controllers/dispatchslip.controller');
var users = require('../controllers/user.controller');

router.post("/", users.loginRequired,dispatchslips.create);
router.get("/", users.loginRequired,dispatchslips.getAll);
router.get("/:id", users.loginRequired,dispatchslips.getById);

module.exports = router;