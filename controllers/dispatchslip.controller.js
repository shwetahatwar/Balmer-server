const db = require("../models");
const DispatchSlip = db.dispatchslips;
const DispatchSlipMaterialList = db.dispatchslipmateriallists;
const MaterialInward = db.materialinwards;
const Op = db.Sequelize.Op;
const Ttat = db.ttats;

// Create and Save a new DispatchSlip
exports.create = (req, res,async) => {
  if (!req.body.dispatchSlipNumber) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }  
  DispatchSlip.sequelize.transaction(async t => {
    return DispatchSlip.create({
      dispatchSlipNumber: req.body.dispatchSlipNumber,
      truckId: req.body.truckId,
      depoId: req.body.depoId,
      status:true,
      createdBy:req.body.createdBy,
      updatedBy:req.body.updatedBy
    },{transaction: t})
    .then(async(dispatchSlip)=>{
      console.log(dispatchSlip.id);
      console.log("length",req.body.material.length);
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
          console.log("Line 59:",checkMaterialQty);
          console.log(checkMaterialQty);
          // console.log("Line 60:",req.body.material[i]["batchNumber"]);
          if(checkMaterialQty >= req.body.material[i].numberOfPacks){
            var getBatchCode = await MaterialInward.findAll({
              where: {
                'materialCode':req.body.material[i].materialCode
              },
              order: [
              ['createdAt', 'ASC'],
              ]
            });
            var counter = req.body.material[i]["numberOfPacks"];
            // var checkCondition = true;
            // var foundQuantity=0;
            // while(checkCondition == true)
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
              var batchQuantity = await MaterialInward.count({
                where:{
                  'materialCode':req.body.material[i].materialCode,
                  'batchNumber':dups[i]
                }
              });
              if(batchQuantity > counter){
                // console.log("Line 63",req.body.material[i]["batchNumber"]);
                await DispatchSlipMaterialList.create({  
                  dispatchSlipId: dispatchSlip.id,
                  batchNumber: dups[i] ,
                  numberOfPacks:req.body.material[i]["numberOfPacks"],
                  materialCode:req.body.material[i]["materialCode"],
                  createdBy:req.body.material[i]["createdBy"],
                  updatedBy:req.body.material[i]["updatedBy"]
                })
                .then(dispatchSlipMaterialList=>{
                  console.log(dispatchSlipMaterialList);
                })
                .catch(err=>{
                  console.log(err);
                  t.rollback();
                });
                break;
              }
              else{
                // console.log("Line 63",req.body.material[i]["batchNumber"]);
                req.body.material[i]["numberOfPacks"] = batchQuantity;
                await DispatchSlipMaterialList.create({  
                  dispatchSlipId: dispatchSlip.id,
                  batchNumber: dups[i],
                  numberOfPacks:req.body.material[i]["numberOfPacks"],
                  materialCode:req.body.material[i]["materialCode"],
                  createdBy:req.body.material[i]["createdBy"],
                  updatedBy:req.body.material[i]["updatedBy"]
                })
                .then(dispatchSlipMaterialList=>{
                  console.log(dispatchSlipMaterialList);
                })
                .catch(err=>{
                  console.log(err);
                  t.rollback();
                });
              }
            }
          }
        });
      }
      return dispatchSlip
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
    where: condition,
    include: [{model: Ttat}] 
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
    where: { id: id }
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

// Find all published DispatchSlips
// exports.findAllPublished = (req, res) => {
//   DispatchSlip.findAll({ where: { published: true } })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving dispatchslips."
//       });
//     });
// };