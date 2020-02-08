var express = require('express');
var router = express.Router();
var scrapandrecovers = require('../controllers/scrapandrecover.controller');
var users = require('../controllers/user.controller');

router.post("/", users.loginRequired,scrapandrecovers.create);
router.get("/", users.loginRequired,scrapandrecovers.getAll);
router.get("/:id", users.loginRequired,scrapandrecovers.getById);
router.put("/:id", users.loginRequired,scrapandrecovers.update);

module.exports = router;