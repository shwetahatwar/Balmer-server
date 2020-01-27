var express = require('express');
var router = express.Router();
var depos = require('../controllers/depo.controller');
var users = require('../controllers/user.controller');

router.post("/", users.loginRequired,depos.create);
router.get("/", users.loginRequired,depos.getAll);
router.get("/:id", users.loginRequired,depos.getById);

module.exports = router;