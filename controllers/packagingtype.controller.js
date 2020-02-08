const db = require("../models");
const PackagingType = db.packagingtypes;
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
  const packagingtype = {
    name: req.body.name,
    status:true,
    createdBy:req.user.id,
    updatedBy:req.user.id
  };

  // Save MaterialInward in the database
  PackagingType.create(packagingtype)
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
  PackagingType.findAll({
    where:req.query
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

  PackagingType.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving MaterialInward with id=" + id
      });
    });
}

exports.update = (req, res) => {
  const id = req.params.id;

  PackagingType.update(req.body, {
    where: req.params
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "PackagingType was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update PackagingType with id=${id}. Maybe PackagingType was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating PackagingType with id=" + id
      });
    });
};