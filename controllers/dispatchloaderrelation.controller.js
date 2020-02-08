const db = require("../models");
const DispatchLoaderRelation = db.dispatchloaderrelations;
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
  const dispatchloaderrelation = {
    dispatchId: req.body.dispatchId,
    userId:req.body.userId,
    createdBy:req.user.id,
    updatedBy:req.user.id
  };

  // Save MaterialInward in the database
  DispatchLoaderRelation.create(dispatchloaderrelation)
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
  DispatchLoaderRelation.findAll({
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

  DispatchLoaderRelation.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving MaterialInward with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  DispatchLoaderRelation.update(req.body, {
    where: req.params
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "DispatchLoaderRelation was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update DispatchLoaderRelation with id=${req.params}. Maybe DispatchLoaderRelation was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating DispatchLoaderRelation with id=" + req.params
      });
    });
};