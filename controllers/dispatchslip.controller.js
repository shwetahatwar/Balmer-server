const db = require("../models");
const DispatchSlip = db.dispatchslips;
const Op = db.Sequelize.Op;

// Create and Save a new DispatchSlip
exports.create = (req, res) => {
  console.log(req.body);
  // Validate request
  if (!req.body.dispatchSlipNumber) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a DispatchSlip
  const dispatchslip = {
    dispatchSlipNumber: req.body.dispatchSlipNumber,
    truckId: req.body.truckId,
    depoId: req.body.depoId,
    status:true,
    createdBy:req.body.createdBy,
    updatedBy:req.body.updatedBy
  };

  // Save DispatchSlip in the database
  DispatchSlip.create(dispatchslip)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the DispatchSlip."
      });
    });
};

// Retrieve all DispatchSlips from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  DispatchSlip.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving dispatchslips."
      });
    });
};

// Find a single DispatchSlip with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  DispatchSlip.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving DispatchSlip with id=" + id
      });
    });
};

// Update a DispatchSlip by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  DispatchSlip.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "DispatchSlip was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update DispatchSlip with id=${id}. Maybe DispatchSlip was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating DispatchSlip with id=" + id
      });
    });
};

// Delete a DispatchSlip with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  DispatchSlip.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "DispatchSlip was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete DispatchSlip with id=${id}. Maybe DispatchSlip was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete DispatchSlip with id=" + id
      });
    });
};

// Delete all DispatchSlips from the database.
exports.deleteAll = (req, res) => {
  DispatchSlip.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} DispatchSlips were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all dispatchslips."
      });
    });
};

// Find all published DispatchSlips
// exports.findAllPublished = (req, res) => {
//   DispatchSlip.findAll({ where: { published: true } })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving dispatchslips."
//       });
//     });
// };