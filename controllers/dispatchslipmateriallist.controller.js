const db = require("../models");
const DispatchSlipMaterialList = db.dispatchslipmateriallists;
const Op = db.Sequelize.Op;
const DispatchSlip = db.dispatchslips;
const Material = db.materials;
// const DispatchSlip = require("../models").DispatchSlip;


// Create and Save a new DispatchSlipMaterialList
exports.create = (req, res) => {
  console.log(req.body);
  // Validate request
  if (!req.body.dispatchSlipId) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a DispatchSlipMaterialList
  const dispatchslipmateriallist = {
    dispatchSlipId: req.body.dispatchSlipId,
    batchNumber: req.body.batchNumber,
    numberOfPacks: req.body.numberOfPacks,
    materialCode:req.body.materialCode,
    createdBy:req.user.username,
    updatedBy:req.user.username
  };

  // Save DispatchSlipMateriallist in the database
  DispatchSlipMaterialList.create(dispatchslipmateriallist)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while creating the DispatchSlipMaterialList."
    });
  });
};

// Retrieve all DispatchSlipsMaterialList from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;


 // DispatchSlipMaterialList.findAll({
 //  include:[{model:DispatchSlip}], where: condition })
 DispatchSlipMaterialList.findAll({
  where: req.query,
  include: [{
      model: DispatchSlip
    }] 
  })
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

// Find a single DispatchSlipMaterialList with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  DispatchSlipMaterialList.findByPk(id)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving DispatchSlipMaterialList with id=" + id
    });
  });
};

// Update a DispatchSlip by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  DispatchSlipMaterialList.update(req.body, {
    where: { id: id }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "DispatchSlipMaterialList was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update DispatchSlipMaterialList with id=${id}. Maybe DispatchSlipMaterialList was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating DispatchSlipMaterialList with id=" + id
    });
  });
};

// Delete a DispatchSlipMaterialList with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  DispatchSlipMaterialList.destroy({
    where: { id: id }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "DispatchSlipMaterialList was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete DispatchSlipMaterialList with id=${id}. Maybe DispatchSlipMaterialList was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete DispatchSlipMaterialList with id=" + id
    });
  });
};

// Delete all DispatchSlips from the database.
exports.deleteAll = (req, res) => {
  DispatchSlipMaterialList.destroy({
    where: {},
    truncate: false
  })
  .then(nums => {
    res.send({ message: `${nums} DispatchSlipMaterialList were deleted successfully!` });
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while removing all DispatchSlipMaterialList."
    });
  });
};

exports.findByDispatchSlip = (req, res) => {
  var dispatchSlipId = req.query.dispatchSlipId
  DispatchSlipMaterialList.findAll({
    where: { dispatchSlipId : dispatchSlipId },
    include: [{
      model: DispatchSlip
    }] 
  })
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