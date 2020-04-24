var express = require('express');
var router = express.Router();

var setupdatauploads = require('../controllers/setupdataupload.controller');

router.get("/uploadMaterialMaster", setupdatauploads.uploadMaterialMaster);
router.get("/uploadUserMaster", setupdatauploads.uploadUserMaster);
router.get("/get/uploadRoleAccessRelation", setupdatauploads.uploadRoleAccessRelation);

module.exports = router;