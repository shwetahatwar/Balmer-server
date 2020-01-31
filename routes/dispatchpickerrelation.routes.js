var express = require('express');
var router = express.Router();
var dispatchpickerrelations = require('../controllers/dispatchpickerrelation.controller');
var users = require('../controllers/user.controller');

router.post("/", users.loginRequired,dispatchpickerrelations.create);
router.get("/", users.loginRequired,dispatchpickerrelations.getAll);
router.get("/:id", users.loginRequired,dispatchpickerrelations.getById);

module.exports = router;