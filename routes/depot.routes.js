var express = require('express');
var router = express.Router();
var depots = require('../controllers/depot.controller');
var users = require('../controllers/user.controller');

router.post("/", users.loginRequired,depots.create);
router.get("/", users.loginRequired,depots.getAll);
router.get("/:id", users.loginRequired,depots.getById);
router.put("/:id", users.loginRequired,depots.update);

module.exports = router;