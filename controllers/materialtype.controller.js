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
    createdBy:req.user.username,
    updatedBy:req.user.username
  };

  // Save MaterialInward in the database
  MaterialType.create(materialtype)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log("Error",err["errors"][0]["message"]);
      res.status(500).send({
        message:
          err["errors"][0]["message"] || "Some error occurred while creating the User."
      });
    });
};

exports.getAll = (req,res) =>{
  MaterialType.findAll({
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

exports.update = (req, res) => {
  const id = req.params.id;

  MaterialType.update(req.body, {
    where: req.params
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "MaterialType was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update MaterialType with id=${id}. Maybe MaterialType was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating MaterialType with id=" + id
      });
    });
};