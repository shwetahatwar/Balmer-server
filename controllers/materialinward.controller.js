const db = require("../models");
const MaterialInward = db.materialinwards;
const ScrapandRecover = db.scrapandrecovers;
const Op = db.Sequelize.Op;
const Material = db.materials;
const InventoryTransaction = db.inventorytransactions;
const MaterialTransaction = db.materialtransactions;
const PackagingType = db.packagingtypes;

// Create and Save a new MaterialInward
exports.create = async (req, res) => {
  console.log(req.body);
  // Validate request
  if (!req.body.materialCode) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  var dataArray = [];

  for(var i=0; i < req.body.totalPack; i++){
    const materialCode = req.body.materialCode;
    var materialData;
    var materialGenericName;
    var materialDescription;
    await Material.findAll({
      where: {materialCode: materialCode}
    })
    .then(data => {
      materialData = data[0]["dataValues"]["id"];
      materialGenericName = data[0]["dataValues"]["genericName"];
      materialDescription = data[0]["dataValues"]["materialDescription"];
      // console.log(data[0]["dataValues"]["id"]);
      // res.send(data);
      console.log("Line 26", materialData);
    });
    
    var serialNumberId;
    await MaterialInward.findAll({
      where: { 
        materialCode: req.body.materialCode,
        batchNumber: req.body.batchNumber
      },
      order: [
      ['id', 'DESC'],
      ],
    })
    .then(data => {
      console.log("Line 42", data);
      if(data[0] != null || data[0] != undefined){
        serialNumberId = data[0]["dataValues"]["serialNumber"];
        serialNumberId = serialNumberId.substring(serialNumberId.length - 6, serialNumberId.length);
        serialNumberId = (parseInt(serialNumberId) + 1).toString();
        var str = '' + serialNumberId;
        while (str.length < 6) {
          str = '0' + str;
        }
        serialNumberId = req.body.materialCode + "#" + req.body.batchNumber + "#" + str;
        console.log("Line 51 Serial Number", str);
      }
      else{
        serialNumberId = req.body.materialCode + "#" + req.body.batchNumber + "#" + "000001";
      }
    })
    .catch(err=>{
      console.log("Line 54", err);
      serialNumberId = req.body.materialCode + "#" + req.body.batchNumber + "#" + "000001";
    });

    // var serialNumberId = Date.now() + "#" + req.body.materialCode + "#" + req.body.batchNumber;
    //Create a MaterialInward
    const materialinward = {
      materialId: materialData,
      materialCode: req.body.materialCode,
      batchNumber: req.body.batchNumber,
      serialNumber: serialNumberId,
      isScrapped: false,
      isInward:true,
      dispatchSlipId:null,
      status:true,
      grossWeight:req.body.grossWeight,
      tareWeight:req.body.tareWeight,
      extraComment:req.body.extraComment,
      createdBy:req.user.username,
      updatedBy:req.user.username
    };
    console.log("Line 67",materialinward);
    // Save MaterialInward in the database
    await MaterialInward.create(materialinward)
    .then(async data => {
      dataArray.push(data);
      await MaterialTransaction.create({
        serialNumber :serialNumberId,
        inwardedOn : Date.now(),
        materialInwardId:data["id"],
        inwardedBy : req.user.username,
        materialGenericName:materialGenericName,
        materialDescription:materialDescription,
        scrappedOn : "NA",
        scrappedBy : "NA",
        recoveredOn : "NA",
        recoveredBy : "NA",
        pickedOn : "NA",
        pickedBy : "NA",
        loadedOn : "NA",
        loadedBy : "NA",
        createdBy:req.user.username,
        updatedBy:req.user.username
      })
      .then(data => {
          console.log("materialtransactions data",data);
        })
      .catch(err => {
        console.log(err);
      });
      await InventoryTransaction.create({
        transactionTimestamp: Date.now(),
        performedBy:req.user.username,
        transactionType:"Inward",
        materialInwardId:data["id"],
        batchNumber: req.body.batchNumber,
        createdBy:req.user.username,
        updatedBy:req.user.username
      })
      .then(data => {
          // console.log(data);
        })
      .catch(err => {
        console.log(err);
      });
      // res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
        err.message || "Some error occurred while creating the MaterialInward."
      });
    });
  }
  res.send(dataArray);
};

// Retrieve all MaterialInwards from the database.
exports.findAll = (req, res) => {
  var queryString = req.query;
  var offset = 0;
  var limit = 50;
  if(req.query.serialNumber){
     req.query.serialNumber = req.query.serialNumber.trim();
   }
  console.log("Line 51", req.query);
  if(req.query.offset != null || req.query.offset != undefined){
    offset = parseInt(req.query.offset)
  }
  if(req.query.offset != null || req.query.offset != undefined){
    limit = parseInt(req.query.limit)
  }
  delete queryString['offset'];
  delete queryString['limit'];
  if(req.query.status == 1){
    req.query.status = true;
  }
  if(req.query.status == 0){
    req.query.status = false;
  }
  MaterialInward.findAll({ 
    where: queryString,
    include: [{
      model: Material
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
      err.message || "Some error occurred while retrieving materialinwards."
    });
  });
};

// Find a single MaterialInward with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  if(req.query.status == 1){
    req.query.status = true;
  }
  if(req.query.status == 0){
    req.query.status = false;
  }
  MaterialInward.findByPk(id)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving MaterialInward with id=" + id
    });
  });
};

// Update a MaterialInward by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  if(req.body.status == 1){
    req.body.status = true;
  }
  if(req.body.status == 0){
    req.body.status = false;
  }
  MaterialInward.update(req.body, {
    where: req.params
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "MaterialInward was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update MaterialInward with id=${id}. Maybe MaterialInward was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating MaterialInward with id=" + id
    });
  });
};

//Not in Use API
exports.updateWithBarcode = (req, res) => {
  // const serialNumber = req.query.barcodeSerial;
  // console.log("Barcode Serial",req.query.barcodeSerial);
  if(req.body.status == 1){
    req.body.status = true;
  }
  if(req.body.status == 0){
    req.body.status = false;
  }
  MaterialInward.update(req.body, {
    where: req.body
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "MaterialInward was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update MaterialInward with barcodeSerial=${serialNumber}. Maybe MaterialInward was not found or req.body is empty!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error updating MaterialInward with barcodeSerial=" + serialNumber
    });
  });
};

// Delete a MaterialInward with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  MaterialInward.destroy({
    where: { id: id }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "MaterialInward was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete MaterialInward with id=${id}. Maybe MaterialInward was not found!`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete MaterialInward with id=" + id
    });
  });
};

// Delete all MaterialInwards from the database.
exports.deleteAll = (req, res) => {
  MaterialInward.destroy({
    where: {},
    truncate: false
  })
  .then(nums => {
    res.send({ message: `${nums} MaterialInwards were deleted successfully!` });
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while removing all materialinwards."
    });
  });
};

// Find all published MaterialInwards
// exports.findAllPublished = (req, res) => {
//   MaterialInward.findAll({ where: { published: true } })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving materialinwards."
//       });
//     });
// };

//Not in Use API
exports.updateScrapAndRecover = (req, res) => {
  console.log(req.body);
  if(req.body.status == 1){
    req.body.status = true;
  }
  if(req.body.status == 0){
    req.body.status = false;
  }
  MaterialInward.update(req.body, {
    where: { id: req.body.id }
  })
  .then(num => {
    if (num == 1) {
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
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
            err.message || "Some error occurred while creating the MaterialInward."
          });
        });
        // res.send({
        //   message: "MaterialInward was updated successfully."
        // });
      } else {
        res.send({
          message: `Cannot update MaterialInward with id=${req.body.id}. Maybe MaterialInward was not found or req.body is empty!`
        });
      }
    })
  .catch(err => {
    res.status(500).send({
      message: "Error updating MaterialInward with id=" + req.body.id
    });
  });
}; 

//Not in Use API
exports.findAllByBatchCode = (req, res) => {
  MaterialInward.findAll({ 
    where: {
      batchNumber:req.query.batchNumber
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

//Not in Use API
exports.findAllByMaterialCode = (req, res) => {
  MaterialInward.findAll({ 
    where: {
      materialCode:req.query.materialCode
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

//By Material Inward by Material Code and Batch Code
exports.findAllByMaterialCodeandBatchCode = (req, res) => {
  MaterialInward.findAll({ 
    where: {
      materialCode:req.query.materialCode,
      batchNumber:req.query.batchNumber
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

//Not in Use API
exports.findAllByBarcode = (req, res) => {
  if(req.query.serialNumber){
     req.query.serialNumber = req.query.serialNumber.trim();
   }
  MaterialInward.findAll({ 
    where: {
      serialNumber:req.query.serialNumber
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

exports.countOfScrappedForDashboard = (req, res) => {
  MaterialInward.count({ 
    where: {
      isScrapped:true,
      status:true
    }
  })
  .then(data => {
    res.status(200).send({data});
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while retrieving materialinwards."
    });
  });
}
//Stock Count for Dashboard
exports.countOfStockForDashboard = (req, res) => {
  if(req.query.status == 1){
    req.query.status = true;
  }
  if(req.query.status == 0){
    req.query.status = false;
  }
  MaterialInward.findAll({ 
    where: req.query,
    include: [{
      model: Material
    }],
  })
  .then(data => {
    console.log("Data length",data.length)
    var stockValues = 0;
    var scrapValue = 0;
    var bucketStockValue=0;
    var drumStockValue=0;
    var cartonStockValue=0;
    var carboyStockValue=0;
    for(var i=0; i < data.length; i++){
      if(data[i]["isScrapped"] == req.query.isScrapped){
        stockValues++
        if(data[i]["material"]["packingType"] == 5){
          bucketStockValue++;
        }
        else if(data[i]["material"]["packingType"] == 6){
          drumStockValue++;
        }
        else if(data[i]["material"]["packingType"] == 7){
          cartonStockValue++;
        }
        else if(data[i]["material"]["packingType"] == 8){
          carboyStockValue++;
        }
      }
      if(data[i]["isScrapped"] == true){
        scrapValue++;
      }
    }
    var totalStock = {
      scrapCount: scrapValue,
      stockCount: stockValues,
      bucketStockValue:bucketStockValue,
      drumStockValue:drumStockValue,
      cartonStockValue:cartonStockValue,
      carboyStockValue:carboyStockValue
    }
    res.send(totalStock);
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while retrieving materialinwards."
    });
  });
};


//
exports.findMaterialForReprint = async (req, res) => {
  var queryString = req.query;
  var offset = 0;
  var limit = 100;
  if(req.query.offset != null || req.query.offset != undefined){
    offset = parseInt(req.query.offset)
  }
  if(req.query.offset != null || req.query.offset != undefined){
    limit = parseInt(req.query.limit)
  }
  let nestedWhereClause="";
  delete queryString['offset'];
  delete queryString['limit'];
  if(req.query.batchNumber == undefined){
    req.query.batchNumber="";
  }
  if(req.query.materialCode == undefined){
    req.query.materialCode="";
  }

  await MaterialInward.findAll({ 
    where: {
      status:true,
      isScrapped:false,
      materialCode: {
        [Op.like]: '%'+req.query.materialCode+'%',
      },
      batchNumber: {
        [Op.or]: {
          [Op.like]: '%'+req.query.batchNumber+'%',
              // [Op.eq]: ''+req.query.batchNumber+''
            }
          }
        },
        order: [
        ['materialCode', 'ASC'],
        ],
        include: [{
          model: Material,

        }],
        offset:offset,
        limit:limit
      })
  .then(async data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving MaterialInward with id=" + id
    });
  });
};

exports.findMaterialBySearchQuery= async (req, res) => {
  var queryString = req.query;
  var offset = 0;
  var limit = 50;
  if(req.query.offset != null || req.query.offset != undefined){
    offset = parseInt(req.query.offset)
  }
  if(req.query.offset != null || req.query.offset != undefined){
    limit = parseInt(req.query.limit)
  }
  delete queryString['offset'];
  delete queryString['limit'];
  
  var whereClaus = {};
  var materialClause = {};
  if(req.query.genericName == undefined){
    req.query.genericName="";
  }
  if(req.query.batchNumber == undefined){
    req.query.batchNumber="";
  }
  if(req.query.serialNumber == undefined){
    req.query.serialNumber="";
  }
  if(req.query.materialCode == undefined){
    req.query.materialCode="";
  }
  if(req.query.packSize == undefined){
    req.query.packSize="";
  }
  if(req.query.packType == undefined){
    req.query.packType="";
  }
  whereClaus.status = true;
  if(req.query.batchNumber){
    whereClaus.batchNumber = {
      [Op.like]: '%'+req.query.batchNumber+'%'
    }
  }
  if(req.query.materialCode){
    whereClaus.materialCode = {
      [Op.like]: '%'+req.query.materialCode+'%'
    }
  }
  if(req.query.serialNumber){
    whereClaus.serialNumber = {
      [Op.like]: '%'+req.query.serialNumber+'%'
    }
  }
  if(req.query.isScrapped){
    whereClaus.isScrapped = req.query.isScrapped
  }
  if(req.query.genericName){
    materialClause.genericName = {
      [Op.like]: '%'+req.query.genericName+'%'
    }  
  }
  if(req.query.packSize){
    materialClause.packSize = {
      [Op.like]: '%'+req.query.packSize+'%'
    } 
  }
  console.log(req.query.packSize,materialClause)
  var packingTypeClause = {};
  if(req.query.packingType){
    packingTypeClause.name = {
      [Op.like]: '%'+req.query.packingType+'%'
    }
  }
  var materialData = await MaterialInward.findAll({ 
    where: whereClaus,
    order: [
    ['materialCode', 'ASC'],
    ],
    include: [{
      model: Material,
      required: true,
      where:materialClause,
      include:[{
        model: PackagingType,
        required: true,
        where:packingTypeClause
      }]
    }],
    offset:offset,
    limit:limit
  });
  var countArray =[];
  var responseData =[];
  responseData.push(materialData);

  var stockValues = 0;
  var scrapValue = 0;
  var bucketStockValue=0;
  var drumStockValue=0;
  var cartonStockValue=0;
  var carboyStockValue=0;
  var data = await MaterialInward.findAll({ 
    where: whereClaus,
    order: [
    ['materialCode', 'ASC'],
    ],
    include: [{
      model: Material,
      required: true,
      where:materialClause,
      include:[{
        model: PackagingType,
        required: true,
        where:packingTypeClause
      }]
    }]})
  if(!materialData){
    res.status(500).send({
        message:
        err.message || "Some error occurred while retrieving materialinwards."
      });
  }
  else{
    for(var i=0; i < data.length; i++){
      if(data[i]["isScrapped"] == req.query.isScrapped){
        stockValues++
        if(data[i]["material"]["packingType"] == 5){
          bucketStockValue++;
        }
        else if(data[i]["material"]["packingType"] == 6){
          drumStockValue++;
        }
        else if(data[i]["material"]["packingType"] == 7){
          cartonStockValue++;
        }
        else if(data[i]["material"]["packingType"] == 8){
          carboyStockValue++;
        }
      }
      else{
        scrapValue++;
      }
    }
    var totalStock = {
      scrapCount: scrapValue,
      stockCount: stockValues,
      bucketStockValue:bucketStockValue,
      drumStockValue:drumStockValue,
      cartonStockValue:cartonStockValue,
      carboyStockValue:carboyStockValue
    }
    countArray.push(totalStock);
    responseData.push(countArray);
    res.send(responseData);
  }
};

//Get Stock for Material Stock Report
exports.findMaterialByQuery = async (req, res) => {
  var queryString = req.query;
  var offset = 0;
  var limit = 50;
  if(req.query.offset != null || req.query.offset != undefined){
    offset = parseInt(req.query.offset)
  }
  if(req.query.offset != null || req.query.offset != undefined){
    limit = parseInt(req.query.limit)
  }
  let nestedWhereClause="";

  delete queryString['offset'];
  delete queryString['limit'];
  console.log("Generic Name",req.query.genericName);
  if(req.query.serialNumber){
     req.query.serialNumber = req.query.serialNumber.trim();
   }
  if(req.query.genericName != undefined && req.query.genericName != null){
    console.log("In If");
    if(req.query.genericName == undefined){
      req.query.genericName="";
    }
    if(req.query.batchNumber == undefined){
      req.query.batchNumber="";
    }
    if(req.query.serialNumber == undefined){
      req.query.serialNumber="";
    }
    if(req.query.materialCode == undefined){
      req.query.materialCode="";
    }
    if(req.query.packSize == undefined){
      req.query.packSize="";
    }
    var materialCodeTobeSearched ="";
    if (req.query.packSize) {
      nestedWhereClause.packSize = req.query.packSize;
    }
      await MaterialInward.findAll({ 
        where: {
          status:true,
          isScrapped:req.query.isScrapped,
          materialCode: {
            [Op.like]: '%'+req.query.materialCode+'%',
          },
          batchNumber: {
            [Op.or]: {
              [Op.like]: '%'+req.query.batchNumber+'%',
              // [Op.eq]: ''+req.query.batchNumber+''
            }
          },
          serialNumber: {
            [Op.or]: {
              [Op.like]: '%'+req.query.serialNumber+'%',
              [Op.eq]: ''+req.query.serialNumber+''
            }
          }
        },
        order: [
        ['materialCode', 'ASC'],
        ],
        include: [{
          model: Material,
          required: true,
          where:{
            genericName: {
              [Op.or]: {
                [Op.like]: '%'+req.query.genericName+'%',
            },
          },
          packSize: {
              [Op.or]: {
                [Op.like]: '%'+req.query.packSize+'%',
            },
          }
        }
        }],
        offset:offset,
        limit:limit
      })
      .then(async data => {
        var countArray =[];
        var responseData =[];
        responseData.push(data);

        var stockValues = 0;
        var scrapValue = 0;
        var bucketStockValue=0;
        var drumStockValue=0;
        var cartonStockValue=0;
        var carboyStockValue=0;
        await MaterialInward.findAll({ 
          where: {
            status:true,
            isScrapped:req.query.isScrapped,
            materialCode: {
              [Op.like]: '%'+req.query.materialCode+'%',
            },
            batchNumber: {
              [Op.or]: {
                [Op.like]: '%'+req.query.batchNumber+'%',
              // [Op.eq]: ''+req.query.batchNumber+''
            }
          },
          serialNumber: {
            [Op.or]: {
              [Op.like]: '%'+req.query.serialNumber+'%',
              [Op.eq]: ''+req.query.serialNumber+''
            }
          }
        },
        order: [
        ['materialCode', 'ASC'],
        ],
        include: [{
          model: Material,
          required: true,
          where:{
            genericName: {
              [Op.or]: {
                [Op.like]: '%'+req.query.genericName+'%',
              },
            },
            packSize: {
              [Op.or]: {
                [Op.like]: '%'+req.query.packSize+'%',
            },
          }
          }
        }],
        })
        .then(data => {
          for(var i=0; i < data.length; i++){
            if(data[i]["isScrapped"] == req.query.isScrapped){
              stockValues++
              if(data[i]["material"]["packingType"] == 5){
                bucketStockValue++;
              }
              else if(data[i]["material"]["packingType"] == 6){
                drumStockValue++;
              }
              else if(data[i]["material"]["packingType"] == 7){
                cartonStockValue++;
              }
              else if(data[i]["material"]["packingType"] == 8){
                carboyStockValue++;
              }
            }
            else{
              scrapValue++;
            }
          }
        })
        .catch(err => {
          res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving materialinwards."
          });
        });
        var totalStock = {
          scrapCount: scrapValue,
          stockCount: stockValues,
          bucketStockValue:bucketStockValue,
          drumStockValue:drumStockValue,
          cartonStockValue:cartonStockValue,
          carboyStockValue:carboyStockValue
        }
        countArray.push(totalStock);
        responseData.push(countArray);
        res.send(responseData);
    })
    .catch(err => {
      res.status(500).send({
        message:
        err.message || "Some error occurred while retrieving materialinwards."
      });
    });
  }
  else{
    console.log("In Else if");
    var materialCode ='';
    var batchNumber ='';
    var serialNumber ='';
    var genericName ='';
    let nestedWhereClause="";
    if(req.query.genericName != undefined){
      genericName = req.query.genericName;
    }
    if(req.query.batchNumber != undefined){
      batchNumber = req.query.batchNumber;
    }
    if(req.query.serialNumber != undefined){
      serialNumber = req.query.serialNumber;
    }
    if(req.query.materialCode != undefined){
      materialCode = req.query.materialCode;
    }
    if (req.query.packSize) {
      nestedWhereClause.packSize = req.query.packSize;
    }
    MaterialInward.findAll({ 
      where: {
        status:true,
        isScrapped:req.query.isScrapped,
        materialCode: {
          [Op.or]: {
            [Op.like]: '%'+materialCode+'%',
            [Op.eq]: ''+materialCode+''
          }
        },
        batchNumber: {
          [Op.or]: {
            [Op.like]: '%'+batchNumber+'%',
            [Op.eq]: ''+batchNumber+''
          }
        },
        serialNumber: {
          [Op.or]: {
            [Op.like]: '%'+serialNumber+'%',
            [Op.eq]: ''+serialNumber+''
          }
        }
      },
      order: [
      ['materialCode', 'ASC'],
      ],
      include: [{
        model: Material,
        required: true,
        where: {
          packSize: {
            [Op.or]: {
              [Op.like]: '%'+req.query.packSize+'%',
            }
        },
      }
      }],
      offset:offset,
      limit:limit
    })
    .then(async data => {
      var countArray =[];
      var responseData =[];
      responseData.push(data);

      var stockValues = 0;
      var scrapValue = 0;
      var bucketStockValue=0;
      var drumStockValue=0;
      var cartonStockValue=0;
      var carboyStockValue=0;
      await MaterialInward.findAll({ 
        where: {
          status:true,
          isScrapped:req.query.isScrapped,
          materialCode: {
            [Op.or]: {
              [Op.like]: '%'+materialCode+'%',
              [Op.eq]: ''+materialCode+''
            }
          },
          batchNumber: {
            [Op.or]: {
              [Op.like]: '%'+batchNumber+'%',
              [Op.eq]: ''+batchNumber+''
            }
          },
          serialNumber: {
            [Op.or]: {
              [Op.like]: '%'+serialNumber+'%',
              [Op.eq]: ''+serialNumber+''
            }
          }
        },
        include: [{
          model: Material,
          required: true,
          where: {
            packSize: {
              [Op.or]: {
                [Op.like]: '%'+req.query.packSize+'%',
              }
            },
          }
        }]
      })
      .then(data => {
        for(var i=0; i < data.length; i++){
          if(data[i]["isScrapped"] == req.query.isScrapped){
            stockValues++
            if(data[i]["material"]["packingType"] == 5){
              bucketStockValue++;
            }
            else if(data[i]["material"]["packingType"] == 6){
              drumStockValue++;
            }
            else if(data[i]["material"]["packingType"] == 7){
              cartonStockValue++;
            }
            else if(data[i]["material"]["packingType"] == 8){
              carboyStockValue++;
            }
          }
          else{
            scrapValue++;
          }
        }
      })
      .catch(err => {
        res.status(500).send({
          message:
          err.message || "Some error occurred while retrieving materialinwards."
        });
      });
      var totalStock = {
        scrapCount: scrapValue,
        stockCount: stockValues,
        bucketStockValue:bucketStockValue,
        drumStockValue:drumStockValue,
        cartonStockValue:cartonStockValue,
        carboyStockValue:carboyStockValue
      }
      countArray.push(totalStock);
      responseData.push(countArray);
      res.send(responseData);
    })
    .catch(err => {
      res.status(500).send({
        message:
        err.message || "Some error occurred while retrieving materialinwards."
      });
    });
  }
};

//Production Report API
exports.ProductionReportData =async (req, res) => {
  if(req.query.createdAtStart == 0 && req.query.createdAtEnd == 0){
    var query = "SELECT materialCode,COUNT( materialCode ) count,(select materialDescription from balmerlawrie.materials where materialCode = balmerlawrie.materialinwards.materialCode) as materialDescription,(select packSize from balmerlawrie.materials where materialCode = balmerlawrie.materialinwards.materialCode) as packSize,(select netWeight from balmerlawrie.materials where materialCode = balmerlawrie.materialinwards.materialCode) as netQuantity,(select UOM from balmerlawrie.materials where materialCode = balmerlawrie.materialinwards.materialCode) as UOM,(select name from balmerlawrie.packagingtypes where id = (select packingType from balmerlawrie.materials where materialCode = balmerlawrie.materialinwards.materialCode)) as packagingType,(select name from balmerlawrie.materialtypes where id = (select materialType from balmerlawrie.materials where materialCode = balmerlawrie.materialinwards.materialCode)) as materialType FROM balmerlawrie.materialinwards GROUP BY materialCode HAVING count >=1;";
    await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT})
    .then(function(data) {
      res.send(data);
    });
  }
  else{
    var query = "SELECT materialCode,COUNT( materialCode ) count,(select materialDescription from balmerlawrie.materials where materialCode = balmerlawrie.materialinwards.materialCode) as materialDescription,(select packSize from balmerlawrie.materials where materialCode = balmerlawrie.materialinwards.materialCode) as packSize,(select netWeight from balmerlawrie.materials where materialCode = balmerlawrie.materialinwards.materialCode) as netQuantity,(select UOM from balmerlawrie.materials where materialCode = balmerlawrie.materialinwards.materialCode) as UOM,(select name from balmerlawrie.packagingtypes where id = (select packingType from balmerlawrie.materials where materialCode = balmerlawrie.materialinwards.materialCode)) as packagingType,(select name from balmerlawrie.materialtypes where id = (select materialType from balmerlawrie.materials where materialCode = balmerlawrie.materialinwards.materialCode)) as materialType FROM balmerlawrie.materialinwards where createdAt between '"+req.query.createdAtStart+"' and '"+req.query.createdAtEnd+"' GROUP BY materialCode HAVING count >=1;";
    await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT})
    .then(function(data) {
      res.send(data);
    });
  }
};


exports.findForMaterialInward = async (req, res, next) => {
  console.log("In Material Inward");
  var whereClaus = {};
  var { materialCode, batchNumber } = req.body;

  if (materialCode) {
    whereClaus.materialCode = materialCode;
  }
  if (batchNumber) {
    whereClaus.batchNumber = batchNumber;
  }

  var materialInward = await MaterialInward.findOne({
    where: whereClaus,
    order: [
      ['id', 'DESC'],
    ],
  });

  if (materialInward) {
    req.materialInward = materialInward.toJSON();
  }
  
  next();
}

exports.materialInwardBulkUpload = async (req, res, next) => {
  
  if (!req.materialInwardList) {
    return res.status(500).send("No Material");
  }
  var materialInward = await MaterialInward.bulkCreate(req.materialInwardList);
  req.materialInwardBulkUpload = materialInward.map ( el => { return el.get({ plain: true }) } );
  
  next();
}

exports.sendResponse = (req, res, next) => {
  return res.status(200).send(req.materialInwardBulkUpload)
}