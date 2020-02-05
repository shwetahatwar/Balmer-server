const db = require("../models");
const DispatchSlip = db.dispatchslips;
const DispatchSlipMaterialList = db.dispatchslipmateriallists;
const MaterialInward = db.materialinwards;
const Op = db.Sequelize.Op;
const Ttat = db.ttats;
const Depo = db.depos;

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
  await Depo.findAll({
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
      createdBy:req.body.createdBy,
      updatedBy:req.body.updatedBy
    },{transaction: t})
    .then(async (dispatchSlip)=>{
      var counter=0;
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
                    'batchNumber':dups[i]
                  }
                });
                console.log("Line 93 batchQuantity :",batchQuantity);
                console.log("Line 94 counter :",counter);
                if(batchQuantity >= counter){
                  console.log("Line 95",req.body.material[i]["materialCode"]);
                  console.log("Line 96",req.body.material[i]["createdBy"]);
                  const dispatchSlipMaterialListData = {
                    dispatchSlipId: dispatchSlip.id,
                    batchNumber: dups[i],
                    numberOfPacks:counter,
                    materialCode:req.body.material[i]["materialCode"],
                    createdBy:req.body.material[i]["createdBy"],
                    updatedBy:req.body.material[i]["updatedBy"]
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
                    createdBy:req.body.material[i]["createdBy"],
                    updatedBy:req.body.material[i]["updatedBy"]
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
    where: condition,
    include: [{
      model: Ttat
    },
    {
      model: Depo
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