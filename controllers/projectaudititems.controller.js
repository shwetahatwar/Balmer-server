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
    createdBy:req.user.username,
    updatedBy:req.user.username
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
    where: req.query,
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
  console.log(req.params);
  console.log(req.body);
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

exports.countByProject = async (req, res) => {

  await ProjectAuditItems.findAll({
    where:{
      projectId:req.params.id
    }
  })
  .then(data => {
    var foundData=0;
    var notFoundData=0;
    var manuallyApprovedData=0;
    var scrapData=0;
    var totalData = data.length;
    for(var i=0; i < data.length; i++){
      if(data[i]["dataValues"]["itemStatus"] == "Found"){
        foundData++;
      }
      else if(data[i]["dataValues"]["itemStatus"] == "Not Found"){
        notFoundData++;
      }
      else if(data[i]["dataValues"]["itemStatus"] == "Manually Approved"){
        manuallyApprovedData++;
      }
      else if(data[i]["dataValues"]["itemStatus"] == "Scrap"){
        scrapData++;
      }
    }
    var sendData = {
      foundData:foundData,
      notFoundData:notFoundData,
      manuallyApprovedData:manuallyApprovedData,
      scrapData:scrapData,
      totalData:totalData
    }
    res.send(sendData)
  })
  .catch(err => {
    res.status(500).send({
        message:
          err.message || "Some error occurred while removing all ProjectAuditItems."
      });
  })



  // async function newFunction{
  //   var countTable=[];
  //   const id = req.params.id;
  //   var totalCount = 0;
  //   var foundCount = 0;
  //   var manuallyrecovered = 0;
  //   await ProjectAuditItems.count({
  //     where:{
  //       'projectId':id,
  //     }
  //   })
  //   .then(data => {
  //     console.log(data);
  //     // res.status(200);
  //     // // res.send(data);
  //     // res.status(200).send({
  //     //   count:data
  //     // });
  //     let singleData = {
  //       'total':data
  //     };
  //     countTable.push(singleData);
  //   })
  //   await ProjectAuditItems.count({
  //     where:{
  //       'projectId':id,
  //       'status':'found'
  //     }
  //   })
  //   .then(data => {
  //     console.log(data);
  //     // res.status(200);
  //     // // res.send(data);
  //     // res.status(200).send({
  //     //   count:data
  //     // });
  //     let singleData = {
  //       'found':data
  //     };
  //     countTable.push(singleData);
  //   })
  //   await ProjectAuditItems.count({
  //     where:{
  //       'projectId':id,
  //       'status':'scrap'
  //     }
  //   })
  //   .then(data => {
  //     console.log(data);
  //     // res.status(200);
  //     // // res.send(data);
  //     // res.status(200).send({
  //     //   count:data
  //     // });
  //     let singleData = {
  //       'scrap':data
  //     };
  //     countTable.push(singleData);
  //   })
  //   await ProjectAuditItems.count({
  //     where:{
  //       'projectId':id,
  //       'status':'manually approved'
  //     }
  //   })
  //   .then(data => {
  //     console.log(data);
  //     // res.status(200);
  //     // // res.send(data);
  //     // res.status(200).send({
  //     //   count:data
  //     // });
  //     let singleData = {
  //       'manual':data
  //     };
  //     countTable.push(singleData);
  //     res.status(200).send({
  //       countTable
  //     });
  //   })
  //   .catch(err => {
  //     console.log(err);
  //     res.status(500);
  //     res.send(err);
  //     // res.status(500).send({
  //     //   message: "Error retrieving ProjectAuditItems with Project id=" + id
  //     // });
  //   });
  // // }
};