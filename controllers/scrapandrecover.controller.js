const db = require("../models");
const ScrapandRecover = db.scrapandrecovers;
const Op = db.Sequelize.Op;
const MaterialInward = db.materialinwards;
const InventoryTransaction = db.inventorytransactions;

// Create and Save a new MaterialInward
exports.create = (req, res) => {
  console.log(req.body);
  // Validate request
  if (!req.body.id) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a MaterialInward
  const scrapandrecover = {
    materialInwardId: req.body.id,
    comments:req.body.comments,
    transactionType:req.body.transactionType,
    createdBy:req.user.id,
    updatedBy:req.user.id
  };

  // Save MaterialInward in the database
  ScrapandRecover.create(scrapandrecover)
    .then(data => {
      MaterialInward.update(req.body, {
        where: { id: req.body.id }
      })
      .then(materialInwardData => {
        console.log("Line 34",materialInwardData);
        InventoryTransaction.create({
          transactionTimestamp: Date.now(),
          performedBy:req.user.id,
          transactionType:req.body.transactionType,
          materialInwardId:req.body.id,
          batchNumber: req.body.batchNumber,
          createdBy:req.user.id,
          updatedBy:req.user.id
        })
        .then(data => {
          console.log(data);
        })
        .catch(err => {
          console.log(err);
        });
      })
      .catch(err => {
        console.log(err);
      })
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
  ScrapandRecover.findAll({
    where: req.query
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

  ScrapandRecover.findByPk(id)
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

  ScrapandRecover.update(req.body, {
    where: req.params
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