const db = require("../models");
const DispatchPickingMaterialList = db.dispatchpickingmateriallists;
const DispatchSlip = db.dispatchslips;
const Op = db.Sequelize.Op;
const DispatchSlipMaterialList = db.dispatchslipmateriallists;
const MaterialInward = db.materialinwards;

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

  console.log(req.body.material.length);
  for(var i=0;i<req.body.material.length;i++){
    console.log(req.body.material[i]);
    // Create a DispatchPickingMaterialList
    const dispatchpickingmateriallist = {
      dispatchId: req.body.dispatchId,
      userId:req.body.userId,
      createdBy:req.user.username,
      updatedBy:req.user.username,
      materialCode:req.body.material[i].materialCode,
      batchNumber:req.body.material[i].batchNumber,
      serialNumber:req.body.material[i].serialNumber
    };

    // Save DispatchPickingMaterialList in the database
    DispatchPickingMaterialList.create(dispatchpickingmateriallist)
    .then(data => {
      // res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the DispatchPickingMaterialList."
      });
    });
  }
  res.status(500).send({
    message:
      "DispatchPickingMaterialList updated."
  });
  
};

exports.getAll = (req,res) =>{
  DispatchPickingMaterialList.findAll({
    where:req.query
  })
  .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving DispatchPickingMaterialList."
      });
    });
};

exports.getById = (req,res) => {
  const id = req.params.id;

  DispatchPickingMaterialList.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving DispatchPickingMaterialList with id=" + id
      });
    });
}

exports.getAllorCreateNew = async (req,res) =>{
  
};