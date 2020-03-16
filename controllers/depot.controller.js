const db = require("../models");
const Depot = db.depots;
const Op = db.Sequelize.Op;
const User = db.users;

// Create and Save a new Depot
exports.create = (req, res) => {
  
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Depot
  const depot = {
    name: req.body.name,
    location:req.body.location,
    status:true,
    createdBy:req.user.username,
    updatedBy:req.user.username
  };

  // Save Depot in the database
  Depot.create(depot)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err["errors"][0]["message"] || "Some error occurred while creating the Depot."
      });
    });
};

//Get all Depots
exports.getAll = (req,res) =>{
  console.log(req.user.id);
  Depot.findAll({
    where:req.query
  })
  .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Depot."
      });
    });
};

//Get Depot by Id
exports.getById = (req,res) => {
  const id = req.params.id;
  console.log(req.params);

  Depot.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Depot with id=" + id
      });
    });
};

//Update Depot by Id
exports.update = (req, res) => {
  const id = req.params.id;

  Depot.update(req.body, {
    where: req.params
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Depot was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Depot with id=${id}. Maybe Depot was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Depot with id=" + id
      });
    });
};