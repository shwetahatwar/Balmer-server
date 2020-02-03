const db = require("../models");
const Role = db.roles;
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

  const role = {
    name: req.body.name,
    status:true,
    createdBy:req.body.createdBy,
    updatedBy:req.body.updatedBy
  };

  
  Role.create(role)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the role."
      });
    });
};

exports.getAll = (req,res) =>{
  Role.findAll()
  .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Roles."
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Role.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Role was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Role with id=${id}. Maybe Role was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Role with id=" + id
      });
    });
};

exports.getById = (req,res) => {
  const id = req.params.id;

  Role.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Role with id=" + id
      });
    });
}
