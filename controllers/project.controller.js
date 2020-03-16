const db = require("../models");
const Project = db.projects;
const ProjectAuditItems = db.projectaudititems;
const Op = db.Sequelize.Op;
const MaterialInward = db.materialinwards;

// Create and Save a new Project
exports.create = (req, res) => {
  console.log("Line 9", req.body);
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  var projectId;
  const project = {
      name: req.body.name,
      auditors: req.user.username,
      start: 0,
      end: 0,
      status:true,
      projectStatus:"Not Started",
      createdBy:req.user.username,
      updatedBy:req.user.username
  };
  // Save material in the database
  Project.create(project)
  .then(data => {
    projectId = data["id"]
    MaterialInward.findAll({
      where:{
        status:true,
        isScrapped: false,
        isInward: true
      }
    })
    .then(async materialInwardData => {
      console.log("Line 40",materialInwardData);
      for(var i=0;i < materialInwardData.length;i++){
        console.log("Line 38",materialInwardData[i]["dataValues"]["materialCode"]);
        var materialCode = materialInwardData[i]["dataValues"]["materialCode"];
        var batchNumber = materialInwardData[i]["dataValues"]["batchNumber"];
        var serialNumber = materialInwardData[i]["dataValues"]["serialNumber"];
        await ProjectAuditItems.create({
          projectId: projectId,
          materialCode:materialCode,
          batchNumber:batchNumber,
          serialNumber:serialNumber,
          status:true,
          itemStatus:"Not Found",
          createdBy:req.user.username,
          updatedBy:req.user.username
        });
      }
    })
    .catch(err=>{
      console.log(err);
    })
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
  var queryString = req.query;
  var offset = 0;
  var limit = 50;
  console.log("Line 51", req.query);
  if(req.query.offset != null || req.query.offset != undefined){
    offset = parseInt(req.query.offset)
  }
  if(req.query.offset != null || req.query.offset != undefined){
    limit = parseInt(req.query.limit)
  }
  delete queryString['offset'];
  delete queryString['limit'];
  
  Project.findAll({ 
    where: queryString,
    offset:offset,
    limit:limit
   })
  .then(data => {
    console.log(data);
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while retrieving Projects."
    });
  });
};

exports.findByDatewise = (req, res) => {
  // console.log();
  var queryString = req.query;
  var offset = 0;
  var limit = 100;
  if(req.query.offset != null || req.query.offset != undefined){
    offset = parseInt(req.query.offset)
  }
  if(req.query.offset != null || req.query.offset != undefined){
    limit = parseInt(req.query.limit)
  }
  delete queryString['offset'];
  delete queryString['limit'];
  console.log("queryString",queryString);
  Project.findAll({ 
    where: {
      createdAt: {
        [Op.gte]: parseInt(req.query.createdAtStart),
        [Op.lt]: parseInt(req.query.createdAtEnd),
      },
      updatedAt: {
        [Op.gte]: parseInt(req.query.updatedAtStart),
        [Op.lt]: parseInt(req.query.updatedAtEnd),
      },
    },
    order: [
            ['id', 'DESC'],
        ],
        offset:offset,
        limit:limit
    })
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
  console.log(id);
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

// Retrieve all Project from the database.
exports.findProjectItemsByProject = (req, res) => {
  
  ProjectAuditItems.findAll({ where: req.params })
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

// Retrieve all Project from the database.
exports.findSingleProjectItemByProject = (req, res) => {
  
  ProjectAuditItems.findAll({ where: req.params })
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

// Update a Project by the id in the request
exports.updateSingleProjectItemByProject = (req, res) => {
  // const id = req.params.id;
  console.log("Line 200", req.params);
  ProjectAuditItems.update(req.body, {
    where: req.params 
  })
  .then(num => {
    console.log(num);
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