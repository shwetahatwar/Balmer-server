const db = require("../models");
const DispatchSlip = db.dispatchslips;
const DispatchSlipMaterialList = db.dispatchslipmateriallists;
const DispatchLoadingMaterialList = db.dispatchloadingmateriallists;
const DispatchPickingMaterialList = db.dispatchpickingmateriallists;
const MaterialInward = db.materialinwards;
const Op = db.Sequelize.Op;
const Ttat = db.ttats;
const Depot = db.depots;

// Create and Save a new DispatchSlip
exports.create = async (req, res) => {
  if (!req.body.dispatchSlipNumber) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }  

  const truckNumber = req.body.truckId;
  var truckData;
  await Ttat.findAll({
    where: {truckNumber: truckNumber}
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

  DispatchSlip.sequelize.transaction(async t => {
    return DispatchSlip.create({
      dispatchSlipNumber: req.body.dispatchSlipNumber,
      truckId: truckData,
      depoId: depoData,
      status:true,
      dispatchSlipStatus:"Active",
      createdBy:req.user.username,
      updatedBy:req.user.username
    },{transaction: t})
    .then(async (dispatchSlip)=>{
      var counter=0;
      console.log("Line 55", req.body.material.length);
      for(var i=0;i<req.body.material.length;i++)
      {
        var checkMaterialQty;
        checkMaterialQty = await MaterialInward.count({
          where:{
            'materialCode':req.body.material[i].materialCode
          }
        })
        .then(async data=>{
          checkMaterialQty = data;
          console.log("Line 62", checkMaterialQty);
          console.log("Line 63", req.body.material[i].numberOfPacks);
          if(checkMaterialQty >= req.body.material[i].numberOfPacks){
            var getBatchCode = await MaterialInward.findAll({
              where: {
                'materialCode':req.body.material[i].materialCode
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
            console.log("Unique Data :",dups);
            for(var s=0;s<dups.length;s++){
              console.log("Quantity:",counter);
              if(counter != 0 && counter > 0){
                var batchQuantity = await MaterialInward.count({
                  where:{
                    'materialCode':req.body.material[i].materialCode,
                    'batchNumber':dups[s]
                  }
                });
                console.log("Line 93 batchQuantity :",batchQuantity);
                console.log("Line 94 counter :",counter);
                if(batchQuantity >= counter){
                  console.log("Line 95",req.body.material[i]["materialCode"]);
                  // console.log("Line 96",req.body.material[i]["createdBy"]);
                  const dispatchSlipMaterialListData = {
                    dispatchSlipId: dispatchSlip.id,
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
                    t.rollback();
                  });
                  counter = counter - batchQuantity;
                  console.log("Line 116 counter :",counter);
                  console.log("Out");
                  break;
                }
                else{
                  console.log("Line 118",req.body.material[i]["batchNumber"]);
                  // req.body.material[i]["numberOfPacks"] = batchQuantity;
                  const dispatchSlipMaterialListData = {
                    dispatchSlipId: dispatchSlip.id,
                    batchNumber: dups[i],
                    numberOfPacks:counter,
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
          console.log(err);
        });
      }
      return dispatchSlip;
      res.send(dispatchSlip);
    })
    .catch(err=>{
      t.rollback();
      res.status(500).send(err);
    });
  })
};


// Retrieve all DispatchSlips from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  DispatchSlip.findAll({ 
    where: req.query,
    include: [{
      model: Ttat
    },
    {
      model: Depot
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

// Material List
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
      err.message || "Some error occurred while retrieving dispatchslips."
    });
  });
};

exports.postDispatchSlipPickingMaterialLists = async (req, res) => {
  console.log(req.body);

  console.log(req.body.material.length);
  for(var i=0;i<req.body.material.length;i++){
    console.log(req.body.material[i]);
    // Create a MaterialInward
    const dispatchpickingmateriallist = {
      dispatchId: req.params.dispatchId,
      userId:1,
      createdBy:req.user.username,
      updatedBy:req.user.username,
      materialCode:req.body.material[i].materialCode,
      batchNumber:req.body.material[i].batchNumber,
      serialNumber:req.body.material[i].serialNumber
    };

    // Save MaterialInward in the database
    await DispatchPickingMaterialList.create(dispatchpickingmateriallist)
    .then(data => {
      // res.send(data);
      DispatchSlip.update()
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the MaterialInward."
      });
    });
  }
  res.status(200).send({
    message:
      "Completed Successfully."
  });
  
};

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
      err.message || "Some error occurred while retrieving dispatchslips."
    });
  });
};

exports.postDispatchSlipLoadingMaterialLists = async (req, res) => {
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
    // Create a Material picking
    const dispatchloadingmateriallist = {
      dispatchId: req.body.dispatchId,
      userId:1,
      createdBy:req.user.username,
      updatedBy:req.user.username,
      materialCode:req.body.material[i].materialCode,
      batchNumber:req.body.material[i].batchNumber,
      serialNumber:req.body.material[i].serialNumber
    };

    // Save MaterialInward in the database
    await DispatchLoadingMaterialList.create(dispatchloadingmateriallist)
    .then(data => {
      // res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the MaterialInward."
      });
    });
  }
  res.status(200).send({
    message:
      "Completed Successfully."
  });
  
};

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
      message: "Error updating DispatchPickingMaterialList with id=" + id
    });
  });
};