var express = require('express');
var router = express.Router();
var materialtransactions = require('../controllers/materialtransaction.controller');
var users = require('../controllers/user.controller');

router.get("/", users.loginRequired,materialtransactions.getAll);
router.get("/:id", users.loginRequired,materialtransactions.getById);

module.exports = router;