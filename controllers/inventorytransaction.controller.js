const db = require("../models");
const MaterialInward = db.materialinwards;
const InventoryTransaction = db.inventorytransactions;
const Op = db.Sequelize.Op;

// Retrieve all Inventory Transaction from the database.
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
  
  console.log(offset);
  console.log(limit);
  if(req.query.status == 1){
    req.query.status = true;
  }
  if(req.query.status == 0){
    req.query.status = false;
  }
  InventoryTransaction.findAll({ 
    where: req.query,
    include: [{model: MaterialInward}],
    offset:offset,
    limit:limit 
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
      err.message || "Some error occurred while retrieving InventoryTransaction."
    });
  });
};

// Find a single Inventory Transaction with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  if(req.query.status == 1){
    req.query.status = true;
  }
  if(req.query.status == 0){
    req.query.status = false;
  }
  InventoryTransaction.findByPk(id)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving InventoryTransaction with id=" + id
    });
  });
};

//Find all data Date wise for Inventory transaction report
exports.findByDatewise = (req, res) => {
  var queryString = req.query;
  var offset = 0;
  var limit = 100;
  console.log("Line 51", req.query);
  if(req.query.offset != null || req.query.offset != undefined){
    offset = parseInt(req.query.offset)
  }
  if(req.query.offset != null || req.query.offset != undefined){
    limit = parseInt(req.query.limit)
  }
  delete queryString['offset'];
  delete queryString['limit'];
  console.log("queryString",queryString);
  if(req.query.status == 1){
    req.query.status = true;
  }
  if(req.query.status == 0){
    req.query.status = false;
  }
  InventoryTransaction.findAll({ 
    where: {
      createdAt: {
        [Op.gte]: parseInt(req.query.createdAtStart),
        [Op.lt]: parseInt(req.query.createdAtEnd),
      }
    },
    include: [{model: MaterialInward}], 
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
      err.message || "Some error occurred while retrieving Inventory Transactions."
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
      transactionTimestamp: Date.now(),
      performedBy: req.user.username,
      transactionType: "Inward",
      materialInwardId: el["id"],
      batchNumber: batchNumber,
      createdBy: req.user.username,
      updatedBy: req.user.username  
    }
  });

  var transactionMaterailInward = await InventoryTransaction.bulkCreate(transactionMaterail);
  transactionMaterailInward = transactionMaterailInward.map ( el => { return el.get({ plain: true }) } );
  console.log(transactionMaterailInward);

  next();
}