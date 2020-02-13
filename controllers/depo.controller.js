const db = require("../models");
const Depo = db.depos;
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
  const depo = {
    name: req.body.name,
    location:req.body.location,
    status:true,
    createdBy:req.user.username,
    updatedBy:req.user.username
  };

  // Save MaterialInward in the database
  Depo.create(depo)
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
  Depo.findAll()
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

  Depo.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving MaterialInward with id=" + id
      });
    });
}
