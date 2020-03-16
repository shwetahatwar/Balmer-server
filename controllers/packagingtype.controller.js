const db = require("../models");
const PackagingType = db.packagingtypes;
const Op = db.Sequelize.Op;

// Create and Save a new Packaging Type
exports.create = (req, res) => {
  console.log(req.body);
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Packaging Type
  const packagingtype = {
    name: req.body.name,
    status:true,
    createdBy:req.user.username,
    updatedBy:req.user.username
  };

  // Save Packaging Type in the database
  PackagingType.create(packagingtype)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Packaging Type."
      });
    });
};

//Get All Packaging Type
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
          err.message || "Some error occurred while retrieving Packaging Type."
      });
    });
};

//Get Packaging Type by Id
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

//Update Packaging Type by Id
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