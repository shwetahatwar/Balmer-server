const db = require("../models");
const ProjectAuditItems = db.projectaudititems;
// const Project = db.projects;
const Op = db.Sequelize.Op;
const Project = db.projects;


// Create and Save a new Project audit items
exports.create = (req, res) => {
  console.log(req.body);
  // Validate request
  if (!req.body.projectId) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a ProjectAuditItems
  const projectaudititem = {
    projectId: req.body.projectId,
    batchNumber: req.body.batchNumber,
    materialCode:req.body.materialCode,
    serialNumber:req.body.serialNumber,
    status:true,
    createdBy:req.body.createdBy,
    updatedBy:req.body.updatedBy
  };

  // Save ProjectAuditItems in the database
  ProjectAuditItems.create(projectaudititem)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the ProjectAuditItems."
      });
    });
};

// Retrieve all ProjectAuditItems from the database.
exports.findAll = (req, res) => {
  // console.log(Project);
  // res.send(Project);
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;


 // ProjectAuditItems.findAll({
 //  include:[{model:Project}], where: condition })
  ProjectAuditItems.findAll({
    where: condition,
    include: [{model: Project}]
   })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving ProjectAuditItems."
      });
    });
};

// Find a single ProjectAuditItems with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  ProjectAuditItems.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving ProjectAuditItems with id=" + id
      });
    });
};

// Update a ProjectAuditItems by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  ProjectAuditItems.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "ProjectAuditItems was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update ProjectAuditItems with id=${id}. Maybe ProjectAuditItems was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating ProjectAuditItems with id=" + id
      });
    });
};

// Delete a ProjectAuditItems with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  ProjectAuditItems.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "ProjectAuditItems was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete ProjectAuditItems with id=${id}. Maybe ProjectAuditItems was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete ProjectAuditItems with id=" + id
      });
    });
};

// Delete all DispatchSlips from the database.
exports.deleteAll = (req, res) => {
  ProjectAuditItems.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} ProjectAuditItems were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all ProjectAuditItems."
      });
    });
};
