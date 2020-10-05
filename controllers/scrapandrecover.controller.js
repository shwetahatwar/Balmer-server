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
            recoveredBy :req.user.username,
            updatedBy:req.user.username
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
            scrappedBy :req.user.username,
            updatedBy:req.user.username
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
  if(req.query.status == 1){
    req.query.status = true;
  }
  if(req.query.status == 0){
    req.query.status = false;
  }
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
  if(req.query.status == 1){
    req.query.status = true;
  }
  if(req.query.status == 0){
    req.query.status = false;
  }
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
  if(req.body.status == 1){
    req.body.status = true;
  }
  if(req.body.status == 0){
    req.body.status = false;
  }
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
  let  id = req.body.id;

  console.log("req line 197",id)
  await ProjectAuditItems.findAll({
    where:{
      id: id
    }
  }).then(async data => {
    if(data[0]){
      if(data[0]["itemStatus"]!= "Found"){
        req.body.serialNumber  = data[0]["serialNumber"];
        await MaterialInward.findAll({
          where:{
            serialNumber:req.body.serialNumber
          }
        }).then(data => {
          materialInwardId = data[0]["dataValues"]["id"];
          getBatchNumber = data[0]["dataValues"]["batchNumber"]
        })
        .catch(err => {
          res.status(500).send({
            message: "Error finding MaterialInward with Serial Number=" + req.body.serialNumber
          });
        });

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
    if(req.body.id){
      delete req.body.id
    }
    req.body.isScrapped= true;
    req.body.status= false;
    MaterialInward.update(req.body, {
      where: { id: materialInwardId }
    })
    .then(materialInwardData => {
      if(!req.body.transactionType){
        req.body.transactionType="Scrap"
      }
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
        var updateBody = {
          itemStatus: "Scrap",
          updatedBy:req.user.username
        }
        await ProjectAuditItems.update(updateBody, {
          where: {
            id : id
          }
        })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "ProjectAuditItems was updated successfully."
            });
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
  })
}
else{
  res.status(200).send("updated")
}
}
})
  .catch(err => {
    res.status(500).send({
      message: "Error finding MaterialInward with Serial Number=" + req.body.serialNumber
    });
  });
  
}

//Scrap all the items
exports.updateAllProjectItems = async (req,res) => {
  var materialInwardId;
  var getBatchNumber;
  await ProjectAuditItems.findAll({
    where:{
      itemStatus: "Not Found",
      projectId:req.query.projectId
    }
  }).then(async data => {
    if(data.length >=0){
      for(var i=0;i<data.length;i++){
        if(data[i]["itemStatus"] == "Not Found"){
          var id = data[i]["id"];
          var serialNumber  = data[i]["serialNumber"];
          console.log("serialNumber",serialNumber)
          await MaterialInward.findAll({
            where:{
              serialNumber:serialNumber
            }
          }).then(materialinwardsData => {
            materialInwardId = materialinwardsData[0]["dataValues"]["id"];
            getBatchNumber = materialinwardsData[0]["dataValues"]["batchNumber"]
          })
          .catch(err => {
            console.log(err)
          });

          const scrapandrecover = {
            materialInwardId: materialInwardId,
            comments:"Scrapped while audit",
            transactionType:"Scap",
            createdBy:req.user.username,
            updatedBy:req.user.username
          };

  // Save ScrapandRecover in the database
  await ScrapandRecover.create(scrapandrecover)
  .then(data => {
    req.body.isScrapped= true;
    req.body.status= false;
    MaterialInward.update(req.body, {
      where: { id: materialInwardId }
    })
    .then(materialInwardData => {
      if(!req.body.transactionType){
        req.body.transactionType="Scrap"
      }
      InventoryTransaction.create({
        transactionTimestamp: Date.now(),
        performedBy:req.user.username,
        transactionType:req.body.transactionType,
        materialInwardId:materialInwardId,
        batchNumber: getBatchNumber,
        createdBy:req.user.username,
        updatedBy:req.user.username
      })
      .then(async data => {
        var updateBody = {
          itemStatus: "Scrap",
          updatedBy:req.user.username
        }
        await ProjectAuditItems.update(updateBody, {
          where: {
            id : id
          }
        })
      })
      .catch(err => {
        console.log(err);
      });
    })
    .catch(err => {
      console.log(err);
    })
  })
}
}
res.status(200).send({
  message:"updated"
});
}
else{
  res.status(500).send({
    message: "Error while updating audit"
  });
}
})
  .catch(err => {
    res.status(500).send({
      message: "Error while updating audit"
    });
  });
}