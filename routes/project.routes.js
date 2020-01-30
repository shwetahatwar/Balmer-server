var express = require('express');
var router = express.Router();
var projects = require('../controllers/project.controller');
var users = require('../controllers/user.controller');

router.post("/", users.loginRequired,projects.create);
router.get("/", users.loginRequired,projects.findAll);
router.get("/:id", users.loginRequired,projects.findOne);

module.exports = router;