const db = require("../models");
const ScrapandRecover = db.scrapandrecovers;
const Op = db.Sequelize.Op;
const MaterialInward = db.materialinwards;
const InventoryTransaction = db.inventorytransactions;
const ProjectAuditItems = db.projectaudititems;

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
    createdBy:req.user.username,
    updatedBy:req.user.username
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
          performedBy:req.user.username,
          transactionType:req.body.transactionType,
          materialInwardId:req.body.id,
          batchNumber: req.body.batchNumber,
          createdBy:req.user.username,
          updatedBy:req.user.username
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

exports.updateByBarcodeSerial = async (req,res) => {
  var materialInwardId;
  var getBatchNumber;
  await MaterialInward.findAll({
    serialNumber:req.body.serialNumber
  })
  .then(data => {
    materialInwardId = data[0]["dataValues"]["id"];
    getBatchNumber = data[0]["dataValues"]["batchNumber"]
  })
  .catch(err => {
    res.status(500).send({
        message: "Error updating Role with id=" + id
      });
  });

  var updateBody = {
    isScrapped: true,
    status: false
  }
  await MaterialInward.update(updateBody, {
    where: {
      id : materialInwardId
    }
  })
  .then(num => {
    if (num == 1) {
      // res.send({
      //   message: "Role was updated successfully."
      // });
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

  // Create a MaterialInward
  const scrapandrecover = {
    materialInwardId: materialInwardId,
    comments:req.body.comments,
    transactionType:req.body.transactionType,
    createdBy:req.user.username,
    updatedBy:req.user.username
  };

  // Save MaterialInward in the database
  await ScrapandRecover.create(scrapandrecover)
  .then(data => {
    MaterialInward.update(req.body, {
      where: { id: req.body.id }
    })
    .then(materialInwardData => {
      console.log("Line 34",materialInwardData);
      InventoryTransaction.create({
        transactionTimestamp: Date.now(),
        performedBy:req.user.username,
        transactionType:req.body.transactionType,
        materialInwardId:materialInwardId,
        batchNumber: req.body.batchNumber,
        createdBy:req.user.username,
        updatedBy:req.user.username
      })
      .then(async data => {
        console.log(data);
        var updateBody = {
          itemStatus: "Scrap"
        }
        await ProjectAuditItems.update(updateBody, {
          where: {
            id : req.body.id
          }
        })
        .then(num => {
          if (num == 1) {
            // res.send({
            //   message: "Role was updated successfully."
            // });
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
  
}