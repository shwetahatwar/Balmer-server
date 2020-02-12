var XLSX = require('xlsx'),
     xls_utils = XLSX.utils;
const db = require("../models");
const Material = db.materials;
const MaterialType = db.materialtypes;
const PackagingType = db.packagingtypes;

exports.uploadMaterialMaster = async (req,res) =>{
  var filepath10 = 'D:\\All Project\\Balmer Lawrie\\Test Server\\documents\\templates\\bulk-upload\\MATERIAL_MASTER.xlsx';
  var workbook10 = XLSX.readFile(filepath10);
  var sheet10 = workbook10.Sheets[workbook10.SheetNames[0]];
  var num_rows10 = xls_utils.decode_range(sheet10['!ref']).e.r;
  var json10 = [];
  try{
    for(var i = 1, l = num_rows10-1; i <= l; i++){
    // for(var i = 1, l = 1; i <= l; i++){
      var materialTypeName = xls_utils.encode_cell({c:1, r:i});
      var materialTypeValue = sheet10[materialTypeName];
      var materialTypeResult = materialTypeValue['v'];
      console.log(materialTypeName + " \t" + materialTypeResult);

      var materialTypeId;
      await MaterialType.findAll({
        where: {name: materialTypeResult}
      })
      .then(data => {
        materialTypeId = data[0]["dataValues"]["id"];
        // console.log(data[0]["dataValues"]["id"]);
        // res.send(data);
        console.log("Line 30", materialTypeId);
      })
      .catch(async err=>{
        const materialtype = {
          name: materialTypeResult,
          status:true,
          createdBy:1,
          updatedBy:1
        };

        // Save MaterialInward in the database
        await MaterialType.create(materialtype)
          .then(data => {
            // res.send(data);
            materialTypeId = data.id
          })
          .catch(err => {
            // res.status(500).send({
            //   message:
            //     err.message || "Some error occurred while creating the MaterialInward."
            // });
          });
      });

      var materialCodeName = xls_utils.encode_cell({c:2, r:i});
      var materialCodeValue = sheet10[materialCodeName];
      var materialCodeResult = materialCodeValue['v'];
      console.log(materialCodeName + " \t" + materialCodeResult);

      var materialDescriptionName = xls_utils.encode_cell({c:3, r:i});
      var materialDescriptionValue = sheet10[materialDescriptionName];
      var materialDescriptionResult = materialDescriptionValue['v'];
      console.log(materialDescriptionName + " \t" + materialDescriptionResult);

      var genericNameName = xls_utils.encode_cell({c:4, r:i});
      var genericNameValue = sheet10[genericNameName];
      var genericNameResult = genericNameValue['v'];
      console.log(genericNameName + " \t" + genericNameResult);

      var packingTypeName = xls_utils.encode_cell({c:5, r:i});
      var packingTypeValue = sheet10[packingTypeName];
      var packingTypeResult = packingTypeValue['v'];
      console.log(packingTypeName + " \t" + packingTypeResult);

      var packagingTypeId;
      await PackagingType.findAll({
        where: {name: packingTypeResult}
      })
      .then(data => {
        packagingTypeId = data[0]["dataValues"]["id"];
        // console.log(data[0]["dataValues"]["id"]);
        // res.send(data);
        console.log("Line 82", packagingTypeId);
      })
      .catch(async err=>{
        const packagingType = {
          name: packingTypeResult,
          status:true,
          createdBy:1,
          updatedBy:1
        };

        // Save MaterialInward in the database
        await PackagingType.create(packagingType)
          .then(data => {
            // packagingTypeId.send(data);
            packagingTypeId = data.id
          })
          .catch(err => {
            // res.status(500).send({
            //   message:
            //     err.message || "Some error occurred while creating the MaterialInward."
            // });
          });
      });

      var packSizeName = xls_utils.encode_cell({c:6, r:i});
      var packSizeValue = sheet10[packSizeName];
      var packSizeResult = packSizeValue['v'];
      console.log(packSizeName + " \t" + packSizeResult);

      var netWeightName = xls_utils.encode_cell({c:7, r:i});
      var netWeightValue = sheet10[netWeightName];
      var netWeightResult = netWeightValue['v'];
      console.log(netWeightName + " \t" + netWeightResult);

      var grossWeightName = xls_utils.encode_cell({c:8, r:i});
      var grossWeightValue = sheet10[grossWeightName];
      var grossWeightResult = grossWeightValue['v'];
      console.log(grossWeightName + " \t" + grossWeightResult);

      var tareWeightName = xls_utils.encode_cell({c:8, r:i});
      var tareWeightValue = sheet10[tareWeightName];
      var tareWeightResult = tareWeightValue['v'];
      console.log(tareWeightName + " \t" + tareWeightResult);

      var uomName = xls_utils.encode_cell({c:9, r:i});
      var uomValue1 = sheet10[uomName];
      var uomResult = uomValue1['v'];
      console.log(uomName + " \t" + uomResult);
      
      const material = {
        materialType: materialTypeId,
        materialCode: materialCodeResult,
        materialDescription: materialDescriptionResult,
        genericName: genericNameResult,
        packingType: packagingTypeId,
        packSize: packSizeResult,
        netWeight: netWeightResult,
        grossWeight: grossWeightResult,
        tareWeight: tareWeightResult,
        UOM: uomResult,
        status: true,
        createdBy: req.user.id,
        updatedBy: req.user.id
      };

      Material.create(material)
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
    }
  }
  catch{

  }
};