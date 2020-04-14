const db = require("../models");
const MaterialInward = db.materialinwards;
const ScrapandRecover = db.scrapandrecovers;
const Op = db.Sequelize.Op;
const Material = db.materials;
const InventoryTransaction = db.inventorytransactions;

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
    await Material.findAll({
      where: {materialCode: materialCode}
    })
    .then(data => {
      materialData = data[0]["dataValues"]["id"];
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
      createdBy:req.user.username,
      updatedBy:req.user.username
    };
    console.log("Line 67",materialinward);
    // Save MaterialInward in the database
    await MaterialInward.create(materialinward)
    .then(async data => {
      dataArray.push(data);
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

//Stock Count for Dashboard
exports.countOfStockForDashboard = (req, res) => {
  MaterialInward.findAll({ 
    where: req.query,
    include: [{
      model: Material
    }],
  })
  .then(data => {
    var stockValues = 0;
    var scrapValue = 0;
    var bucketStockValue=0;
    var drumStockValue=0;
    var cartonStockValue=0;
    var carboyStockValue=0;
    for(var i=0; i < data.length; i++){
      if(data[i]["isScrapped"] == false){
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
    res.send(totalStock);
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while retrieving materialinwards."
    });
  });
};

//Get Stock for Material Stock Report
exports.findMaterialByQuery = (req, res) => {
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
    var materialCodeTobeSearched ="";
    Material.findAll({
      where: {
         genericName: {
          [Op.or]: {
            [Op.like]: ''+req.query.genericName+'%',
            [Op.eq]: ''+req.query.genericName+''
          }
        }
      }
    })
    .then(async data => {
      console.log("Material Code",data);
      materialCodeTobeSearched= data[0]["dataValues"]["materialCode"];
      await MaterialInward.findAll({ 
        where: {
          status:1,
          isScrapped:0,
          materialCode: materialCodeTobeSearched,
          batchNumber: {
            [Op.or]: {
              [Op.like]: ''+req.query.batchNumber+'%',
              [Op.eq]: ''+req.query.batchNumber+''
            }
          },
          serialNumber: {
            [Op.or]: {
              [Op.like]: ''+req.query.serialNumber+'%',
              [Op.eq]: ''+req.query.serialNumber+''
            }
          }
        },
        order: [
        ['materialCode', 'ASC'],
        ],
        include: [{
          model: Material
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
            status:1,
            isScrapped:0,
            materialCode: materialCodeTobeSearched,
            batchNumber: {
              [Op.or]: {
                [Op.like]: ''+req.query.batchNumber+'%',
                [Op.eq]: ''+req.query.batchNumber+''
              }
            },
            serialNumber: {
              [Op.or]: {
                [Op.like]: ''+req.query.serialNumber+'%',
                [Op.eq]: ''+req.query.serialNumber+''
              }
            }
          },
          include: [{
            model: Material
          }]
        })
        .then(data => {
          for(var i=0; i < data.length; i++){
            if(data[i]["isScrapped"] == false){
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
      });
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
    MaterialInward.findAll({ 
      where: {
        status:1,
        isScrapped:0,
        materialCode: {
          [Op.or]: {
            [Op.like]: ''+materialCode+'%',
            [Op.eq]: ''+materialCode+''
          }
        },
        batchNumber: {
          [Op.or]: {
            [Op.like]: ''+batchNumber+'%',
            [Op.eq]: ''+batchNumber+''
          }
        },
        serialNumber: {
          [Op.or]: {
            [Op.like]: ''+serialNumber+'%',
            [Op.eq]: ''+serialNumber+''
          }
        }
      },
      order: [
      ['materialCode', 'ASC'],
      ],
      include: [{
        model: Material
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
          status:1,
          isScrapped:0,
          materialCode: {
            [Op.or]: {
              [Op.like]: ''+materialCode+'%',
              [Op.eq]: ''+materialCode+''
            }
          },
          batchNumber: {
            [Op.or]: {
              [Op.like]: ''+batchNumber+'%',
              [Op.eq]: ''+batchNumber+''
            }
          },
          serialNumber: {
            [Op.or]: {
              [Op.like]: ''+serialNumber+'%',
              [Op.eq]: ''+serialNumber+''
            }
          }
        },
        include: [{
          model: Material
        }]
      })
      .then(data => {
        for(var i=0; i < data.length; i++){
          if(data[i]["isScrapped"] == false){
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
    var query = "SELECT materialCode,COUNT( materialCode ) count,(select materialDescription from balmerlawrie.materials where materialCode = balmerlawrie.materialinwards.materialCode) as materialDescription,(select packSize from balmerlawrie.materials where materialCode = balmerlawrie.materialinwards.materialCode) as packSize,(select netWeight from balmerlawrie.materials where materialCode = balmerlawrie.materialinwards.materialCode) as netQuantity,(select UOM from balmerlawrie.materials where materialCode = balmerlawrie.materialinwards.materialCode) as UOM,(select name from balmerlawrie.packagingtypes where id = (select packingType from balmerlawrie.materials where materialCode = balmerlawrie.materialinwards.materialCode)) as packagingType,(select name from balmerlawrie.materialtypes where id = (select materialType from balmerlawrie.materials where materialCode = balmerlawrie.materialinwards.materialCode)) as materialType FROM balmerlawrie.materialinwards where status = true GROUP BY materialCode HAVING count >=1;";
    await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT})
    .then(function(data) {
      res.send(data);
    });
  }
  else{
    var query = "SELECT materialCode,COUNT( materialCode ) count,(select materialDescription from balmerlawrie.materials where materialCode = balmerlawrie.materialinwards.materialCode) as materialDescription,(select packSize from balmerlawrie.materials where materialCode = balmerlawrie.materialinwards.materialCode) as packSize,(select netWeight from balmerlawrie.materials where materialCode = balmerlawrie.materialinwards.materialCode) as netQuantity,(select UOM from balmerlawrie.materials where materialCode = balmerlawrie.materialinwards.materialCode) as UOM,(select name from balmerlawrie.packagingtypes where id = (select packingType from balmerlawrie.materials where materialCode = balmerlawrie.materialinwards.materialCode)) as packagingType,(select name from balmerlawrie.materialtypes where id = (select materialType from balmerlawrie.materials where materialCode = balmerlawrie.materialinwards.materialCode)) as materialType FROM balmerlawrie.materialinwards where status = true and createdAt between '"+req.query.createdAtStart+"' and '"+req.query.createdAtEnd+"' GROUP BY materialCode HAVING count >=1;";
    await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT})
    .then(function(data) {
      res.send(data);
    });
  }
};
