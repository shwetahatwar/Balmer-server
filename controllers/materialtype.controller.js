const db = require("../models");
const MaterialType = db.materialtypes;
const Op = db.Sequelize.Op;

// Create and Save a new MaterialInward
exports.create = (req, res) => {
  console.log(req.body);
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a MaterialInward
  const materialtype = {
    name: req.body.name,
    status:true,
    createdBy:req.body.createdBy,
    updatedBy:req.body.updatedBy
  };

  // Save MaterialInward in the database
  MaterialType.create(materialtype)
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
  MaterialType.findAll()
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

  MaterialType.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving MaterialInward with id=" + id
      });
    });
}
