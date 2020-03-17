var express = require('express');
var router = express.Router();
var ttats = require('../controllers/ttat.controller');
var users = require('../controllers/user.controller');

router.post("/", users.loginRequired,ttats.create);
router.get("/", users.loginRequired,ttats.findAll);
router.get("/:id", users.loginRequired,ttats.findOne);
router.put("/put/truckOut", users.loginRequired,ttats.truckOut);
router.put("/:id", users.loginRequired,ttats.update);
router.get("/dashboard/count", users.loginRequired,ttats.getTtatDashboard);
router.get("/get/getbydate", users.loginRequired,ttats.findByDatewise);
router.get("/get/findttatbytrucknumber", users.loginRequired,ttats.findAllTTATByTruckNumber);
router.get("/get/findbytransporter", users.loginRequired,ttats.findAllTTATByTransportor);

module.exports = router;