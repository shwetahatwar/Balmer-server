var express = require('express');
var router = express.Router();

var setupdatauploads = require('../controllers/setupdataupload.controller');

router.get("/uploadMaterialMaster", setupdatauploads.uploadMaterialMaster);

module.exports = router;