var XLSX = require('xlsx'),
     xls_utils = XLSX.utils;
const db = require("../models");
const Material = db.materials;
const MaterialType = db.materialtypes;
const PackagingType = db.packagingtypes;
const User = db.users;
const Role = db.roles;


exports.uploadMaterialMaster = async (req,res) =>{

  //Add Roles
  var filepath1 = './documents/templates/bulk-upload/Roles.xlsx';
  console.log(filepath1);
  var workbook1 = XLSX.readFile(filepath1);
  var sheet1 = workbook1.Sheets[workbook1.SheetNames[0]];
  var num_rows1 = xls_utils.decode_range(sheet1['!ref']).e.r;
  var json1 = [];
  try{
    for(var i = 1, l = num_rows1-1; i <= l; i++){

      var roleName = xls_utils.encode_cell({c:0, r:i});

      var roleNameValue = sheet1[roleName];
      console.log("Line 21",roleNameValue);
      var roleResult = roleNameValue['v'];

      const role = {
        name: roleResult,
        status:true,
        createdBy:"nikhil",
        updatedBy:"nikhil"
      };

      await Role.create(role)
      .then(data => {
        console.log("Line 34", data)
        // res.send(data);
      })
      .catch(err => {
        console.log("Line 37", err);
        // res.status(500).send({
        //   message:
        //     err.message || "Some error occurred while creating the role."
        // });
      });
    }
  }
  catch{
    console.log("In Error");
  }

  //Add Packaging Type
  var filepath2 = './documents/templates/bulk-upload/PackagingType.xlsx';
  console.log(filepath2);
  var workbook2 = XLSX.readFile(filepath2);
  var sheet2 = workbook2.Sheets[workbook2.SheetNames[0]];
  var num_rows2 = xls_utils.decode_range(sheet2['!ref']).e.r;
  var json2 = [];
  try{
    for(var i = 1, l = num_rows2-1; i <= l; i++){

      var packagingType = xls_utils.encode_cell({c:0, r:i});

      var packagingTypeValue = sheet2[packagingType];
      console.log("Line 21",packagingTypeValue);
      var packagingTypeResult = packagingTypeValue['v'];

      const packagingTypes = {
        name: packagingType,
        status:true,
        createdBy:"nikhil",
        updatedBy:"nikhil"
      };

      await PackagingType.create(packagingTypes)
      .then(data => {
        console.log("Line 34", data)
        // res.send(data);
      })
      .catch(err => {
        console.log("Line 37", err);
        // res.status(500).send({
        //   message:
        //     err.message || "Some error occurred while creating the role."
        // });
      });
    }
  }
  catch{
    console.log("In Error");
  }

  //Create User
  const user = {
    username: "nikhil",
    password: "briot",
    status: "1",
    roleId: 1,
    employeeId:1004,
    designation:"Developer",
    createdBy:"nikhil",
    updatedBy:"nikhil"
  };

  // Save User in the database
  await User.create(user)
  .then(data => {
    // res.send(data);
  })
  .catch(err => {
    // res.status(500).send({
    //   message:
    //     err.message || "Some error occurred while creating the User."
    // });
  });


  //Create Material Types
  // var filepath10 = 'D:\\All Project\\Balmer Lawrie\\Test Server\\documents\\templates\\bulk-upload\\MATERIAL_MASTER.xlsx';
  var filepath10 = './documents/templates/bulk-upload/MATERIAL_MASTER.xlsx';
  console.log(filepath10);
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
          createdBy:"nikhil",
          updatedBy:"nikhil"
        };

        // Save MaterialInward in the database
        await MaterialType.create(materialtype)
        .then(data => {
          console.log("Line 47",data.id);
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
          createdBy:"nikhil",
          updatedBy:"nikhil"
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

      var stickerTypeName = xls_utils.encode_cell({c:10, r:i});
      var stickerTypeValue1 = sheet10[stickerTypeName];
      var stickerTypeResult = stickerTypeValue1['v'];
      console.log(stickerTypeName + " \t" + stickerTypeResult);
      
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
        stickerType: stickerTypeResult,
        status: true,
        createdBy: "nikhil",
        updatedBy: "nikhil"
      };

      await Material.create(material)
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
    }
    res.status(200).send({
      message:
        "Uploaded Sucessfully"
    });
  }
  catch{

  }
};

exports.uploadUserMaster = async (req,res) =>{
  const role = {
      name: "Admin",
      status:true,
      createdBy:"nikhil",
      updatedBy:"nikhil"
    };

    var roleData;
    Role.create(role)
    .then(data => {
      console.log("Line 180",data["dataValues"]["id"]);
      roleData = data["dataValues"]["id"];
      const user = {
        username: "nikhil",
        password: "briot",
        status: "1",
        roleId: roleData,
        employeeId:1004,
        designation:"Developer",
        createdBy:"nikhil",
        updatedBy:"nikhil"
      };

      // Save User in the database
      User.create(user)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User."
          });
        });

    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the role."
      });
    });

}

exports.uploadUserMaster = async (req,res) =>{

}