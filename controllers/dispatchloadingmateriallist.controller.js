const db = require("../models");
const DispatchLoadingMaterialList = db.dispatchloadingmateriallists;
const Op = db.Sequelize.Op;

// Create and Save a new Dispatch Loading Material List
exports.create = (req, res) => {
  console.log(req.body);
  // Validate request
  if (!req.body.dispatchId) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
 
   if(req.body.serialNumber){
     req.body.serialNumber = req.body.serialNumber.trim();
   }
  // Create a Dispatch Loading Material List
  const dispatchloadingmateriallist = {
    dispatchId: req.body.dispatchId,
    userId:req.body.userId,
    createdBy:req.user.username,
    updatedBy:req.user.username,
    materialCode:req.body.materialCode,
    batchNumber:req.body.batchNumber,
    serialNumber:req.body.serialNumber
  };

  // Save Dispatch Loading Material List in the database
  DispatchLoadingMaterialList.create(dispatchloadingmateriallist)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while creating the DispatchLoadingMaterialList."
    });
  });
};

//Get Dispatch Loading Material List
exports.getAll = (req,res) =>{
  if(req.query.serialNumber){
     req.query.serialNumber = req.query.serialNumber.trim();
   }
   if(req.query.status == 1){
    req.query.status = true;
  }
  if(req.query.status == 0){
    req.query.status = false;
  }
  DispatchLoadingMaterialList.findAll({
    where:req.query
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while retrieving DispatchLoadingMaterialList."
    });
  });
};

//Get Dispatch Loading Material List By Id
exports.getById = (req,res) => {
  const id = req.params.id;
  if(req.query.status == 1){
    req.query.status = true;
  }
  if(req.query.status == 0){
    req.query.status = false;
  }
  DispatchLoadingMaterialList.findByPk(id)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving DispatchLoadingMaterialList with id=" + id
    });
  });
};

//Update Dispatch Loading Material List by Id
exports.update = (req, res) => {
  const id = req.params.id;
  if(req.body.serialNumber){
     req.body.serialNumber = req.body.serialNumber.trim();
   }
   if(req.body.status == 1){
    req.body.status = true;
  }
  if(req.body.status == 0){
    req.body.status = false;
  }
  DispatchLoadingMaterialList.update(req.body, {
    where: req.params
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "DispatchLoadingMaterialList was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update DispatchLoadingMaterialList with id=${id}. Maybe DispatchLoadingMaterialList was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating DispatchLoadingMaterialList with id=" + id
      });
    });
};

//Get Dispatch Loader Material List by Dispatch Id
exports.getAllByDispatchSlipId = (req,res) =>{
  DispatchLoadingMaterialList.findAll({
    where:{
      'dispatchId':req.params.id
    }
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while retrieving DispatchLoadingMaterialList."
    });
  });
};

exports.getAllorCreateNew = async (req,res) =>{
  
};

//Dispatch Report API
exports.DispatchReportData = async (req, res) => {
  if(req.query.createdAtStart == 0 && req.query.createdAtEnd == 0){
    console.log("In if")
    var query = "SELECT materialCode,COUNT(materialCode) count,(select materialDescription from balmerlawrie.materials where materialCode = balmerlawrie.dispatchloadingmateriallists.materialCode) as materialDescription,(select packSize from balmerlawrie.materials where materialCode = balmerlawrie.dispatchloadingmateriallists.materialCode) as packSize,(select netWeight from balmerlawrie.materials where materialCode = balmerlawrie.dispatchloadingmateriallists.materialCode) as netQuantity,(select UOM from balmerlawrie.materials where materialCode = balmerlawrie.dispatchloadingmateriallists.materialCode) as UOM,(select name from balmerlawrie.packagingtypes where id = (select packingType from balmerlawrie.materials where materialCode = balmerlawrie.dispatchloadingmateriallists.materialCode)) as packagingType,(select name from balmerlawrie.materialtypes where id = (select materialType from balmerlawrie.materials where materialCode = balmerlawrie.dispatchloadingmateriallists.materialCode)) as materialType FROM balmerlawrie.dispatchloadingmateriallists GROUP BY materialCode HAVING count >=1;";
    await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT})
    .then(function(data) {
      res.send(data);
    });
  }
  else{
    console.log("In Else")
    var query = "SELECT materialCode,COUNT(materialCode) count,(select materialDescription from balmerlawrie.materials where materialCode = balmerlawrie.dispatchloadingmateriallists.materialCode) as materialDescription,(select packSize from balmerlawrie.materials where materialCode = balmerlawrie.dispatchloadingmateriallists.materialCode) as packSize,(select netWeight from balmerlawrie.materials where materialCode = balmerlawrie.dispatchloadingmateriallists.materialCode) as netQuantity,(select UOM from balmerlawrie.materials where materialCode = balmerlawrie.dispatchloadingmateriallists.materialCode) as UOM,(select name from balmerlawrie.packagingtypes where id = (select packingType from balmerlawrie.materials where materialCode = balmerlawrie.dispatchloadingmateriallists.materialCode)) as packagingType,(select name from balmerlawrie.materialtypes where id = (select materialType from balmerlawrie.materials where materialCode = balmerlawrie.dispatchloadingmateriallists.materialCode)) as materialType FROM balmerlawrie.dispatchloadingmateriallists where createdAt between '"+req.query.createdAtStart+"' and '"+req.query.createdAtEnd+"' GROUP BY materialCode HAVING count >=1;";
    await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT})
    .then(function(data) {
      res.send(data);
    });
  }
};