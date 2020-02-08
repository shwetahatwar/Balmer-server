var express = require('express');
var router = express.Router();
var packagingtypes = require('../controllers/packagingtype.controller');
var users = require('../controllers/user.controller');


router.post("/", users.loginRequired,packagingtypes.create);
router.get("/", users.loginRequired,packagingtypes.getAll);
router.get("/:id", users.loginRequired,packagingtypes.getById);
router.put("/:id", users.loginRequired,packagingtypes.update);

module.exports = router;