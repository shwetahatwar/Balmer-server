var express = require('express');
var router = express.Router();
var materialtypes = require('../controllers/materialtype.controller');
var users = require('../controllers/user.controller');

router.post("/", users.loginRequired,materialtypes.create);
router.get("/", users.loginRequired,materialtypes.getAll);
router.get("/:id", users.loginRequired,materialtypes.getById);

module.exports = router;