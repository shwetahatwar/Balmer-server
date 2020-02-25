var express = require('express');
var router = express.Router();
var projectaudititems = require('../controllers/projectaudititems.controller');
var users = require('../controllers/user.controller');

router.post("/", users.loginRequired,projectaudititems.create);
router.get("/", users.loginRequired,projectaudititems.findAll);
router.get("/:id", users.loginRequired,projectaudititems.findOne);
router.get("/getcountbyproject/:id", users.loginRequired,projectaudititems.countByProject);

module.exports = router;