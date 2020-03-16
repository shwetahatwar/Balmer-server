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