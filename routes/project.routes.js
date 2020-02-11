var express = require('express');
var router = express.Router();
var projects = require('../controllers/project.controller');
var users = require('../controllers/user.controller');

router.post("/", users.loginRequired,projects.create);
router.get("/", users.loginRequired,projects.findAll);
router.get("/:id", users.loginRequired,projects.findOne);
router.put("/", users.loginRequired,projects.findOne);
router.get("/:projectId/projectItems", users.loginRequired,projects.findProjectItemsByProject);
router.get("/:projectId/projectItems/:id", users.loginRequired,projects.findSingleProjectItemByProject);
router.put("/:projectId/projectItems/:id", users.loginRequired,projects.updateSingleProjectItemByProject);

module.exports = router;