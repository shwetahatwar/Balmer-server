const db = require("../models");
const DispatchSlip = db.dispatchslips;
const DispatchSlipMaterialList = db.dispatchslipmateriallists;
const DispatchLoadingMaterialList = db.dispatchloadingmateriallists;
const DispatchPickingMaterialList = db.dispatchpickingmateriallists;
const MaterialInward = db.materialinwards;
const Op = db.Sequelize.Op;
const Ttat = db.ttats;
const Depot = db.depots;
const Sequelize = require("sequelize");
var sequelize = require('../config/db.config.js');

// Create and Save a new DispatchSlip
exports.create = async (req, res) => {
  if (!req.body.dispatchSlipNumber) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  } 

  var responseData;
  var canCreate = 0; 
  for(var i=0;i<req.body.material.length;i++){
    var checkMaterialQty = await MaterialInward.count({
      where:{
        'materialCode':req.body.material[i].materialCode,
        'status':1,
        'isScrapped':0,
      }
    });
    if(checkMaterialQty >= req.body.material[i].numberOfPacks){
      canCreate =1;
    }
  }

  if(canCreate == 1){
    const truckNumber = req.body.truckId;
  var truckData;
  await Ttat.findAll({
    where: {
      truckNumber: truckNumber,
      outTime: null
    }
  })
  .then(data => {
    truckData = data[0]["dataValues"]["id"];
    // console.log(data[0]["dataValues"]["id"]);
    // res.send(data);
    console.log("Line 27", truckData);
  });

  const depoNumber = req.body.depoId;
  var depoData;
  await Depot.findAll({
    where: {name: depoNumber}
  })
  .then(data => {
    depoData = data[0]["dataValues"]["id"];
    // console.log(data[0]["dataValues"]["id"]);
    // res.send(data);
    console.log("Line 39", depoData);
  });

  var dispatchSlipId;
  const dispatchSlipInput = {
    dispatchSlipNumber: req.body.dispatchSlipNumber,
    truckId: truckData,
    depoId: depoData,
    status:true,
    dispatchSlipStatus:"Pending",
    createdBy:req.user.username,
    updatedBy:req.user.username
  };
  await DispatchSlip.create(dispatchSlipInput)
  .then(data => {
    responseData = data;
    dispatchSlipId = data["dataValues"]["id"]
  })
  .catch(err => {
     res.status(500).send({
        message:
          err["errors"][0]["message"] || "Some error occurred while creating the DispatchSlip."
      });
  });
  for(var i=0;i<req.body.material.length;i++){
    var checkMaterialQty;
    checkMaterialQty = await MaterialInward.count({
      where:{
        'materialCode':req.body.material[i].materialCode,
        'status':1,
        'isScrapped':0,
      }
    })
    .then(async data=>{
      checkMaterialQty = data;
      console.log("Line 62", checkMaterialQty);
      console.log("Line 63", req.body.material[i].numberOfPacks);
      if(checkMaterialQty >= req.body.material[i].numberOfPacks){
        var getBatchCode = await MaterialInward.findAll({
          where: {
            'materialCode':req.body.material[i].materialCode,
            'status':1,
            'isScrapped':0,
          },
          order: [
          ['createdAt', 'ASC'],
          ]
        });
        counter = req.body.material[i]["numberOfPacks"];
        var dups = [];
        var arr = getBatchCode.filter(function(el) {
          // If it is not a duplicate, return true
          if (dups.indexOf(el["batchNumber"]) == -1) {
            dups.push(el["batchNumber"]);
            return true;
          }
          return false;
        });
        for(var s=0;s<dups.length;s++){
          console.log("dups",dups[s])
          console.log("Quantity:",counter);
          if(counter != 0 && counter > 0){
            var batchQuantity = await MaterialInward.count({
              where:{
                'materialCode':req.body.material[i].materialCode,
                'batchNumber':dups[s],
                'status':1,
                'isScrapped':0,
              }
            });
            console.log("Line 93 batchQuantity :",batchQuantity);
            console.log("Line 94 counter :",counter);
            if(batchQuantity >= counter){
              console.log("Line 95",req.body.material[i]["materialCode"]);
              // console.log("Line 96",req.body.material[i]["createdBy"]);
              const dispatchSlipMaterialListData = {
                dispatchSlipId: dispatchSlipId,
                batchNumber: dups[s],
                numberOfPacks:counter,
                materialCode:req.body.material[i]["materialCode"],
                createdBy:req.user.username,
                updatedBy:req.user.username
              }
              DispatchSlipMaterialList.create(dispatchSlipMaterialListData)
              .then(dispatchSlipMaterialList=>{
                console.log("In");
                // console.log("Line 107",dispatchSlipMaterialList);
              })
              .catch(err=>{
                console.log("Line 110", err);
                // t.rollback();
              });
              counter = counter - batchQuantity;
              console.log("Line 116 counter :",counter);
              console.log("Out");
              break;
            }
            else{
              // console.log("Line 118",req.body.material[i]["batchNumber"]);
              // req.body.material[i]["numberOfPacks"] = batchQuantity;
              const dispatchSlipMaterialListData = {
                dispatchSlipId: dispatchSlipId,
                batchNumber: dups[s],
                numberOfPacks:batchQuantity,
                materialCode:req.body.material[i]["materialCode"],
                createdBy:req.user.username,
                updatedBy:req.user.username
              }
              DispatchSlipMaterialList.create(dispatchSlipMaterialListData)
              .then(dispatchSlipMaterialList=>{
                // console.log(dispatchSlipMaterialList);
              })
              .catch(err=>{
                console.log(err);
                t.rollback();
              });
              counter = counter - batchQuantity;
            }
          }
        }
      }
    })
    .catch(err=>{

    })
  }
  res.send(responseData);
  }
  else{
    res.status(500).send({
      message:
      "Dispatch slip not created due to insufficient quantity ."
    });
  }
  
};


// Get all DispatchSlips from the database.
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
  
  DispatchSlip.findAll({ 
    where: queryString,
    include: [{
      model: Ttat
    },
    {
      model: Depot
    }],
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
    where: req.params
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

//Get Dispatch Slip Material List
exports.getDispatchSlipMaterialLists = (req, res) => {
  // console.log("Line 272: ",req.params);
  
  DispatchSlipMaterialList.findAll({ 
    where: req.params
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

//Create Dispatch Slip Material List
exports.postDispatchSlipMaterialLists = async (req, res) => {
  console.log(req.body);
  // Validate request
  if (!req.body.dispatchId) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  console.log(req.body.material.length);
  for(var i=0;i<req.body.material.length;i++){
    console.log(req.body.material[i]);
    // Create a MaterialInward
    const dispatchpickingmateriallist = {
      dispatchId: req.params.dispatchId,
      userId:req.body.userId,
      createdBy:req.user.username,
      updatedBy:req.user.username,
      materialCode:req.body.material[i].materialCode,
      batchNumber:req.body.material[i].batchNumber,
      serialNumber:req.body.material[i].serialNumber
    };

    // Save MaterialInward in the database
    await DispatchSlipMaterialList.create(dispatchpickingmateriallist)
    .then(data => {
      // res.send(data);
    })
    .catch(err => {
      // res.status(500).send({
      //   message:
      //     err.message || "Some error occurred while creating the MaterialInward."
      // });
    });
  }
  res.status(200).send({
    message:
      "Completed Successfully."
  });
  
};

//Get Dispatch Slip Material List
exports.getDispatchSlipMaterialList = (req, res) => {

  DispatchSlipMaterialList.findAll({ 
    where: req.params
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while retrieving DispatchSlipMaterialList."
    });
  });
};

//Update Dispatch Slip Material List
exports.putDispatchSlipMaterialList = (req, res) => {
  const id = req.params.id;

  DispatchSlipMaterialList.update(req.body, {
    where: req.params
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


//Picking 
//Get Dispatch Picking Material List
exports.getDispatchSlipPickingMaterialLists = (req, res) => {

  DispatchPickingMaterialList.findAll({ 
    where: req.params
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while retrieving DispatchPickingMaterialList."
    });
  });
};

//Create Dispatch Picking Material List
exports.postDispatchSlipPickingMaterialLists = async (req, res) => {
  console.log(req.body);

  console.log(req.body.materials.length);
  for(var i=0;i<req.body.materials.length;i++){
    console.log(req.body.materials[i]);
    // Create a MaterialInward
    const dispatchpickingmateriallist = {
      dispatchId: req.params.dispatchId,
      userId:1,
      createdBy:req.user.username,
      updatedBy:req.user.username,
      materialCode:req.body.materials[i].materialCode,
      batchNumber:req.body.materials[i].batchNumber,
      serialNumber:req.body.materials[i].serialNumber
    };

    // Save MaterialInward in the database
    await DispatchPickingMaterialList.create(dispatchpickingmateriallist)
    .then(data => {
      // res.send(data);
      // DispatchSlip.update()
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the DispatchPickingMaterialList."
      });
    });
  }
  //updated Dispatch Slip
  var updatedDispatchSlip = {
    dispatchSlipStatus: "Picked"
  }
  await DispatchSlip.update(updatedDispatchSlip, {
    where: {
      id: req.params.dispatchId
    }
  })
  .then(num => {
    if (num == 1) {
      // res.send({
      //   message: "DispatchSlip was updated successfully."
      // });
    } else {
      // res.send({
      //   message: `Cannot update DispatchSlip with id=${id}. Maybe DispatchSlip was not found or req.body is empty!`
      // });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating DispatchPickingMaterialList with id=" + id
    });
  });
  res.status(200).send({
    message:
      "Completed Successfully."
  });
  
};

//Get Dispatch Picking Material List
exports.getDispatchSlipPickingMaterialList = (req, res) => {

  DispatchPickingMaterialList.findAll({ 
    where: req.params
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while retrieving DispatchPickingMaterialList."
    });
  });
};

//Update Dispatch Picking Material List
exports.putDispatchSlipPickingMaterialList = (req, res) => {
  const id = req.params.id;

  DispatchPickingMaterialList.update(req.body, {
    where: req.params
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "DispatchPickingMaterialList was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update DispatchPickingMaterialList with id=${id}. Maybe DispatchPickingMaterialList was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating DispatchPickingMaterialList with id=" + id
    });
  });
};

//Loading
//Get Dispatch Loading Material List
exports.getDispatchSlipLoadingMaterialLists = (req, res) => {

  DispatchLoadingMaterialList.findAll({ 
    where: req.params
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while retrieving DispatchLoadingMaterialList."
    });
  });
};

//Create Dispatch Loading Material List
exports.postDispatchSlipLoadingMaterialLists = async (req, res) => {
  console.log(req.body);
  // Validate request
  if (!req.body.dispatchId) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  console.log(req.body.materials.length);
  for(var i=0;i<req.body.materials.length;i++){
    console.log(req.body.materials[i]);
    // Create a Material picking
    const dispatchloadingmateriallist = {
      dispatchId: req.body.dispatchId,
      userId:1,
      createdBy:req.user.username,
      updatedBy:req.user.username,
      materialCode:req.body.materials[i].materialCode,
      batchNumber:req.body.materials[i].batchNumber,
      serialNumber:req.body.materials[i].serialNumber
    };

    // Save MaterialInward in the database
    await DispatchLoadingMaterialList.create(dispatchloadingmateriallist)
    .then(async data => {
      var updatedMaterial = {
        dispatchSlipId:req.body.dispatchId,
        status:false
      }
      await MaterialInward.update(updatedMaterial, {
        where: {
          serialNumber: req.body.materials[i].serialNumber
        }
      })
      .then(num => {
        
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating MaterialInward with id=" + dispatchSlipId
        });
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the DispatchLoadingMaterialList."
      });
    });
  }

  //updated Dispatch Slip
  var updatedDispatchSlip = {
    dispatchSlipStatus: "Completed"
  }
  DispatchSlip.update(updatedDispatchSlip, {
    where: {
      id: req.body.dispatchId
    }
  })
  .then(num => {
    if (num == 1) {
      // res.send({
      //   message: "DispatchSlip was updated successfully."
      // });
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

  var diffLoading = parseInt(req.body.loadEndTime) - parseInt(req.body.loadStartTime);
  var updatedTtat = {
    loadStartTime: req.body.loadStartTime,
    loadEndTime: req.body.loadEndTime,
    loadingTime: diffLoading
  };
  await Ttat.update(updatedTtat, {
    where: {
      id: req.body.truckId
    }
  })
  .then(num => {
    if (num == 1) {
      // res.send({
      //   message: "DispatchSlip was updated successfully."
      // });
    } else {
      res.send({
        message: `Cannot update Ttat with id=${req.body.truckId}. Maybe Ttat was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating Ttat with id=" + req.body.truckId
    });
  });


  res.status(200).send({
    message:
      "Completed Successfully."
  });
  
};

// Get Dispatch Loading Material List by Id
exports.getDispatchSlipLoadingMaterialList = (req, res) => {

  DispatchLoadingMaterialList.findAll({ 
    where: req.params
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while retrieving DispatchLoadingMaterialList."
    });
  });
};

//Update Dispatch Loading Material List by Id
exports.putDispatchSlipLoadingMaterialList = (req, res) => {
  const id = req.params.id;

  DispatchLoadingMaterialList.update(req.body, {
    where: req.params
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "DispatchLoadingMaterialList was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update DispatchLoadingMaterialList with id=${id}. Maybe DispatchLoadingMaterialList was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating DispatchLoadingMaterialList with id=" + id
    });
  });
};

//Get Count of Dispatch Slip for Dashboard
exports.getDispatchSlipCountDashboard = async (req, res) => {
  var d = new Date();
  console.log("Line 576",d);
  var newDay = d.getDate();
  if(newDay.toString().length == 1)
    newDay = "0" + newDay;
  var newMonth = d.getMonth();
  newMonth = newMonth +1;
  if(newMonth.toString().length == 1)
    newMonth = "0" + newMonth;
  var newYear = d.getFullYear();
  var newDateTimeNow = newYear + "-" + newMonth + "-" + newDay;

  var query = "SELECT * FROM balmerlawrie.dispatchslips where createdAt like '%" + newDateTimeNow + "%';";
  await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT})
  .then(function(dispatchSlips) {
    console.log(dispatchSlips);
    var pending = 0;
    var active = 0;
    var completed = 0;
    var total = dispatchSlips.length;
    for(var i = 0; i < dispatchSlips.length; i++){
      console.log("Line 660",dispatchSlips[i]["dispatchSlipStatus"]);
      if(dispatchSlips[i]["dispatchSlipStatus"] == "Active"){
        active++;
      }
      else if(dispatchSlips[i]["dispatchSlipStatus"] == "Pending"){
        pending++;
      }
      else if(dispatchSlips[i]["dispatchSlipStatus"] == "Completed"){
        completed++;
      }
    }
    var dispatchSlipCount = {
      active: active,
      pending: pending,
      completed:completed,
      total:total
    }
    res.send(dispatchSlipCount);
  })
  .catch(function(err){
    res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Stock."
      });
  });
};

//Get Dispatch Slip Between Dates
exports.getDispactSlipByDate = (req, res) => {
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
  DispatchSlip.findAll({ 
    where: {
      createdAt: {
        [Op.gte]: parseInt(req.query.createdAtStart),
        [Op.lt]: parseInt(req.query.createdAtEnd),
      }
    },
    include: [{
      model: Ttat
    },
    {
      model: Depot
    }],
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
          err.message || "Some error occurred while retrieving DispatchSlip."
      });
    });
};