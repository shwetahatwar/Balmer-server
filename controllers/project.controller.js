const db = require("../models");
const Project = db.projects;
const ProjectAuditItems = db.projectaudititems;
const Op = db.Sequelize.Op;

// Create and Save a new Project
exports.create = (req, res) => {
  console.log(req.body[0]);
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

const project = {
      name: req.body.name,
      auditors: req.body.auditors,
      start: req.body.start,
      end: req.body.end,
      status:true,
      createdBy:req.user.id,
      updatedBy:req.user.id
  };

  // Save material in the database
  Project.create(project)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while creating the Project."
    });
  });    
};

// Retrieve all Project from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  Project.findAll({ where: req.query })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while retrieving Projects."
    });
  });
};

// Find a single Project with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Project.findByPk(id)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving Project with id=" + id
    });
  });
};

// Update a Project by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Project.update(req.body, {
    where: { id: id }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Project was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update Project with id=${id}. Maybe Project was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating Project with id=" + id
    });
  });
};

// Delete a Project with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Project.destroy({
    where: { id: id }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "Project was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete Project with id=${id}. Maybe Project was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete Project with id=" + id
    });
  });
};

// Delete all Project from the database.
exports.deleteAll = (req, res) => {
  Project.destroy({
    where: {},
    truncate: false
  })
  .then(nums => {
    res.send({ message: `${nums} Project were deleted successfully!` });
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while removing all Projects."
    });
  });
};