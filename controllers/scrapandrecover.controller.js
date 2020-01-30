const db = require("../models");
const ScrapandRecover = db.scrapandrecovers;
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
  const scrapandrecover = {
    materialInwardId: req.body.materialInwardId,
    comments:req.body.comments,
    transactionType:req.body.transactionType,
    createdBy:req.body.createdBy,
    updatedBy:req.body.updatedBy
  };

  // Save MaterialInward in the database
  ScrapandRecover.create(scrapandrecover)
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
  ScrapandRecover.findAll()
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
}
