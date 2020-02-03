var express = require('express');
var router = express.Router();
var dispatchpickingmateriallists = require('../controllers/dispatchpickingmateriallist.controller');
var users = require('../controllers/user.controller');

router.post("/", users.loginRequired,dispatchpickingmateriallists.create);
router.get("/", users.loginRequired,dispatchpickingmateriallists.getAll);
router.get("/:id", users.loginRequired,dispatchpickingmateriallists.getById);

module.exports = router;