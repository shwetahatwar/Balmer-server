const db = require("../models");
const Ttat = db.ttats;
const Op = db.Sequelize.Op;

// Create and Save a new ttat
exports.create = (req, res) => {
  console.log(req.body);
  // Validate request
  if (!req.body.truckNumber) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // var getSerialNumber = Date.now();
  // Create a ttat
  const ttat = {
    truckNumber: req.body.truckNumber,
    capacity: req.body.capacity,
    inTime: req.body.inTime,
    outTime: req.body.outTime,
    driver: req.body.driver,
    loadStartTime: req.body.loadStartTime,
    loadEndTime: req.body.loadEndTime,
    loadingTime: req.body.loadingTime,
    inOutTime: req.body.inOutTime,
    idleTime: req.body.idleTime,
    createdBy:req.body.createdBy,
    updatedBy:req.body.updatedBy
  };

  // Save ttat in the database
  Ttat.create(ttat)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the ttat."
      });
    });
};

// Retrieve all ttats from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  console.log();
  Ttat.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving ttats."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Ttat.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving TtatInward with id=" + id
      });
    });
};

exports.findByTtatCode = (req, res) => {
  Ttat.findAll({
     where: {
        'ttatCode': req.query.ttatCode
    }
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving TtatInward with id=" + id
    });
  });
};