var express = require('express');
var router = express.Router();
var ttats = require('../controllers/ttat.controller');
var users = require('../controllers/user.controller');

router.post("/", users.loginRequired,ttats.create);
router.get("/", users.loginRequired,ttats.findAll);
router.get("/:id", users.loginRequired,ttats.findOne);

module.exports = router;