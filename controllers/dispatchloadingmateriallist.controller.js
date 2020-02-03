const db = require("../models");
const DispatchLoadingMaterialList = db.dispatchloadingmateriallists;
const Op = db.Sequelize.Op;

// Create and Save a new MaterialInward
exports.create = (req, res) => {
  console.log(req.body);
  // Validate request
  if (!req.body.dispatchId) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a MaterialInward
  const dispatchloadingmateriallist = {
    dispatchId: req.body.dispatchId,
    userId:req.body.userId,
    createdBy:req.body.createdBy,
    updatedBy:req.body.updatedBy,
    materialCode:req.body.materialCode,
    batchNumber:req.body.batchNumber,
    serialNumber:req.body.serialNumber
  };

  // Save MaterialInward in the database
  DispatchLoadingMaterialList.create(dispatchloadingmateriallist)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while creating the MaterialInward."
    });
  });
};

exports.getAll = (req,res) =>{
  DispatchLoadingMaterialList.findAll()
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while retrieving materialinwards."
    });
  });
};

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
      err.message || "Some error occurred while retrieving materialinwards."
    });
  });
};

exports.getById = (req,res) => {
  const id = req.params.id;

  DispatchLoadingMaterialList.findByPk(id)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving MaterialInward with id=" + id
    });
  });
}
