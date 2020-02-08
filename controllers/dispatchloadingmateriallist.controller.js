const db = require("../models");
const DispatchLoadingMaterialList = db.dispatchloadingmateriallists;
const Op = db.Sequelize.Op;

// Create and Save a new MaterialInward
exports.create = (req, res) => {
  console.log(req.body);
  // Validate request
  if (!req.body.dispatchId) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a MaterialInward
  const dispatchloadingmateriallist = {
    dispatchId: req.body.dispatchId,
    userId:req.body.userId,
    createdBy:req.user.id,
    updatedBy:req.user.id,
    materialCode:req.body.materialCode,
    batchNumber:req.body.batchNumber,
    serialNumber:req.body.serialNumber
  };

  // Save MaterialInward in the database
  DispatchLoadingMaterialList.create(dispatchloadingmateriallist)
  .then(data => {
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
  DispatchLoadingMaterialList.findAll({
    where:req.query
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

  DispatchLoadingMaterialList.findByPk(id)
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


exports.getAllByDispatchSlipId = (req,res) =>{
  DispatchLoadingMaterialList.findAll({
    where:{
      'dispatchId':req.params.id
    }
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

exports.getAllorCreateNew = async (req,res) =>{
  // await DispatchLoadingMaterialList.findAll({
  //   where: { 
  //     dispatchId: req.body.dispatchId,
  //     userId: req.body.userId
  //   }
  // })
  // .then(async data => {
      
  //     if(data[0] != null){
  //       console.log("Get Data");
  //       res.send(data);
  //     }
  //     else{
  //       console.log("No Data");
  //       await DispatchSlipMaterialList.findAll({
  //         where: {
  //           dispatchSlipId: req.body.dispatchId
  //         }
  //       })
  //       .then(async data1=>{
  //         console.log(data1[0]["numberOfPacks"]);
  //         for(var i=0;i<data1.length;i++){
  //           await MaterialInward.findAll({
  //             where:{
  //               batchNumber:data1[i]["batchNumber"],
  //               materialCode:data1[i]["materialCode"]
  //             }
  //           })
  //           .then(async data2=>{
  //             console.log("Line 101",data2.length);
  //             for(var k=0;k<data2.length;k++){
  //               if(data1[i]["numberOfPacks"] > k){
  //                 const dispatchpickingmateriallist = {
  //                   dispatchId: req.body.dispatchId,
  //                   userId:req.body.userId,
  //                   createdBy:req.body.userId,
  //                   updatedBy:req.body.userId,
  //                   materialCode:data2[k]["materialCode"],
  //                   batchNumber:data2[k]["batchNumber"],
  //                   serialNumber:data2[k]["serialNumber"]
  //                 };

  //                 // Save MaterialInward in the database
  //                 await DispatchLoadingMaterialList.create(dispatchpickingmateriallist)
  //                 .then(data3 => {
  //                   // res.send(data3);
  //                 })
  //                 .catch(err => {
  //                   // res.status(500).send({
  //                   //   message:
  //                   //     err.message || "Some error occurred while creating the MaterialInward."
  //                   // });
  //                 });
  //               }
  //             }
  //             // res.send(data2);  
  //           })
  //           .catch(err => {
  //             res.send(err);
  //           });
  //         }
  //         // res.send(data1);
  //       })
  //       .catch(err=>{
  //         console.log(err);
  //         res.send(err);
  //       })
  //       await DispatchLoadingMaterialList.findAll({
  //         where: {
  //           dispatchId: req.body.dispatchId
  //         }
  //       })
  //       .then(resultData =>{
  //         res.send(resultData);
  //       })
  //       // res.send("No Data");
  //     }
  //   })
  //   .catch(err => {
  //     res.status(500).send({
  //       message:
  //         err.message || "Some error occurred while retrieving materialinwards."
  //     });
  //   });
};