const db = require("../models");
const MaterialTransaction = db.materialtransactions;
const Op = db.Sequelize.Op;
const DispatchSlip = db.dispatchslips;
const User = db.users;
const Ttat = db.ttats;
const Depot = db.depots;
const MaterialInward = db.materialinwards;

//Get all Material Transactions
exports.getAll = (req,res) =>{
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
  MaterialTransaction.findAll({
    where:req.query,
    include: [
    {
      model: DispatchSlip
    },
    {
      model: Ttat
    },
    {
      model: Depot
    },
    {
      model:MaterialInward
    }
    ],
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
      err.message || "Some error occurred while retrieving Material Transactions."
    });
  });
};

//Get Material Transaction by Id
exports.getById = (req,res) => {
  if(req.query.status == 1){
    req.query.status = true;
  }
  if(req.query.status == 0){
    req.query.status = false;
  }
  MaterialTransaction.findByPk(id)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving Material Transaction with id=" + id
    });
  });
};

exports.findMaterialTransactionsBySearchQuery = (req, res) => {
  var queryString = req.query;
  var offset = 0;
  var limit = 100;
  if(req.query.offset != null || req.query.offset != undefined){
    offset = parseInt(req.query.offset)
  }
  if(req.query.limit != null || req.query.limit != undefined){
    limit = parseInt(req.query.limit)
  }
  delete queryString['offset'];
  delete queryString['limit'];

  var serialNumber ='';
  var materialGenericName ='';
  var materialDescription ='';

  if(req.query.serialNumber != undefined){
    serialNumber = req.query.serialNumber;
  }
  if(req.query.materialGenericName != undefined){
    materialGenericName = req.query.materialGenericName;
  }
  if(req.query.materialDescription != undefined){
    materialDescription = req.query.materialDescription;
  }

  MaterialTransaction.findAll({ 
    where: {
      serialNumber: {
        [Op.or]: {
          [Op.like]: '%'+serialNumber+'%',
          [Op.eq]: ''+serialNumber+''
        }
      },
      materialGenericName: {
        [Op.or]: {
          [Op.like]: '%'+materialGenericName+'%',
          [Op.eq]: ''+materialGenericName+''
        }
      },
      materialDescription: {
        [Op.or]: {
          [Op.like]: '%'+materialDescription+'%',
          [Op.eq]: ''+materialDescription+''
        }
      }
    },
    include: [
    {
      model: DispatchSlip
    },
    {
      model: Ttat
    },
    {
      model: Depot
    },
    {
      model:MaterialInward
    }
    ],
    order: [
    ['id', 'DESC'],
    ],
    offset:offset,
    limit:limit 
  })
  .then(async data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while retrieving PartNumbers."
    });
  });
};

exports.MaterialInwardTransactions = async (req, res, next) => {
  var { batchNumber } = req.body;
  if (!req.materialInwardBulkUpload) {
    return res.status(500).send("No Material Inwarded");
  }
  var transactionMaterail = req.materialInwardBulkUpload.map(el => {
    return {
      serialNumber :el["serialNumber"],
      inwardedOn : Date.now(),
      inwardedBy : req.user.username,
      materialInwardId: el["id"],
      materialGenericName: req.materail["genericName"],
      materialDescription: req.materail["materialDescription"],
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
    }
  });

  var transactionMaterailInward = await MaterialTransaction.bulkCreate(transactionMaterail);
  transactionMaterailInward = transactionMaterailInward.map ( el => { return el.get({ plain: true }) } );
  console.log(transactionMaterailInward);

  next();
}