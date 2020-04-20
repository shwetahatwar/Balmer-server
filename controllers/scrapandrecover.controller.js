const db = require("../models");
const ScrapandRecover = db.scrapandrecovers;
const Op = db.Sequelize.Op;
const MaterialInward = db.materialinwards;
const InventoryTransaction = db.inventorytransactions;
const ProjectAuditItems = db.projectaudititems;
const MaterialTransaction = db.materialtransactions;

// Create and Save a new ScrapandRecover
exports.create = (req, res) => {
  console.log(req.body);
  // Validate request
  if (!req.body.id) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a ScrapandRecover
  const scrapandrecover = {
    materialInwardId: req.body.id,
    comments:req.body.comments,
    transactionType:req.body.transactionType,
    createdBy:req.user.username,
    updatedBy:req.user.username
  };

  // Save ScrapandRecover in the database
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
        .then(async data => {
          if(req.body.transactionType == "Recover"){
            var recoverData ={
              recoveredOn : Date.now(),
              recoveredBy :req.user.username
            }
            MaterialTransaction.update(recoverData, {
              where: {
                serialNumber:req.body.serialNumber,
              }
            })
            .then(num => {
              if (num == 1) {
                console.log("MaterialTransaction updated")
              } else {
                res.send({
                  message: `Cannot update MaterialTransaction with Barcode=${req.body.serialNumber}. Maybe MaterialTransaction Barcode was not found or req.body is empty!`
                });
              }
            })
            .catch(err => {
              res.status(500).send({
                message: "Error updating MaterialTransaction with Barcode=" + req.body.serialNumber,
              });
            });
          }
          else{
            var scrapData ={
              scrappedOn : Date.now(),
              scrappedBy :req.user.username
            }
            MaterialTransaction.update(scrapData, {
              where: {
                serialNumber:req.body.serialNumber,
              }
            })
            .then(num => {

            })
            .catch(err => {
              res.status(500).send({
                message: "Error updating MaterialTransaction with id=" + id
              });
            });
          }
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
          err.message || "Some error occurred while creating the ScrapandRecover."
      });
    });
};

//Get All ScrapandRecover
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
          err.message || "Some error occurred while retrieving ScrapandRecover."
      });
    });
};

//Get ScrapandRecover by Id
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

//Update ScrapandRecover by Id
exports.update = (req, res) => {
  const id = req.params.id;

  ScrapandRecover.update(req.body, {
    where: req.params
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "ScrapandRecover was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update ScrapandRecover with id=${id}. Maybe ScrapandRecover was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating ScrapandRecover with id=" + id
      });
    });
};

//Update ScrapandRecover by Barcode Serial Scan
exports.updateByBarcodeSerial = async (req,res) => {
  var materialInwardId;
  var getBatchNumber;
  req.body.serialNumber = req.body.serialNumber.trim();
  console.log("Barcode ",req.body.serialNumber);
  await MaterialInward.findAll({
    serialNumber:req.body.serialNumber
  })
  .then(data => {
    materialInwardId = data[0]["dataValues"]["id"];
    getBatchNumber = data[0]["dataValues"]["batchNumber"]
  })
  .catch(err => {
    res.status(500).send({
        message: "Error finding MaterialInward with Serial Number=" + req.body.serialNumber
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
      
    } else {
      res.send({
        message: `Cannot update MaterialInward with Serial Number=${req.body.serialNumber}. Maybe MaterialInward was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating MaterialInward with Serial Number=" + req.body.serialNumber
    });
  });

  // Create a ScrapandRecover
  const scrapandrecover = {
    materialInwardId: materialInwardId,
    comments:req.body.comments,
    transactionType:req.body.transactionType,
    createdBy:req.user.username,
    updatedBy:req.user.username
  };

  // Save ScrapandRecover in the database
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
            //   message: "ProjectAuditItems was updated successfully."
            // });
          } else {
            res.send({
              message: `Cannot update ProjectAuditItems with id=${req.body.id}. Maybe ProjectAuditItems was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating ProjectAuditItems with id=" + req.body.id
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
        err.message || "Some error occurred while creating the ScrapandRecover."
    });
  });
  
}