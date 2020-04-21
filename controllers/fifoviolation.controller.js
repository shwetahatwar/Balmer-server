const db = require("../models");
const DispatchSlip = db.dispatchslips;
const FIFOViolationList = db.fifoviolationlists;
const Op = db.Sequelize.Op;

// Retrieve all FIFO Violation List from the database.
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
  if(req.query.status == 1){
    req.query.status = true;
  }
  if(req.query.status == 0){
    req.query.status = false;
  }
  console.log(offset);
  console.log(limit);

  FIFOViolationList.findAll({ 
    where: req.query,
    include: [{model: DispatchSlip}],
    offset:offset,
    limit:limit 
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving FIFO Violation List."
      });
    });
};

// Find a single FIFO Violation with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  if(req.query.status == 1){
    req.query.status = true;
  }
  if(req.query.status == 0){
    req.query.status = false;
  }
  FIFOViolationList.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving FIFOViolationList with id=" + id
      });
    });
};

//Find all data Date wise for FIFO Violation Lists
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
  var materialCode ='';
  var batchNumber ='';
  if(req.query.materialCode != undefined){
    materialCode = req.query.materialCode;
  }
  if(req.query.batchNumber != undefined){
    batchNumber = req.query.batchNumber;
  }
  if(req.query.createdAtStart != 0 && req.query.createdAtEnd != 0){
   console.log("In If");
  FIFOViolationList.findAll({ 
    where: {
      createdAt: {
        [Op.gte]: parseInt(req.query.createdAtStart),
        [Op.lt]: parseInt(req.query.createdAtEnd),
      },
      materialCode: {
        [Op.or]: {
          [Op.like]: '%'+materialCode+'%',
          [Op.eq]: '%'+materialCode+''
        }
      },
      batchNumber: {
        [Op.or]: {
          [Op.like]: ''+batchNumber+'%',
          [Op.eq]: ''+batchNumber+''
        }
      }
    },
    include: [{model: DispatchSlip}], 
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
          err.message || "Some error occurred while retrieving FIFOViolationList."
      });
    });
  }
  else{
     console.log("In else");
    FIFOViolationList.findAll({ 
      where: {
        materialCode: {
          [Op.or]: {
            [Op.like]: '%'+materialCode+'%',
            [Op.eq]: '%'+materialCode+''
          }
        },
        batchNumber: {
          [Op.or]: {
            [Op.like]: ''+batchNumber+'%',
            [Op.eq]: ''+batchNumber+''
          }
        }
      },
      include: [{model: DispatchSlip}],
      order: [
      ['id', 'DESC'],
      ],
      offset:offset,
      limit:limit
    })
    .then(async data => {  res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
        err.message || "Some error occurred while retrieving FIFOViolationList."
      });
    });
  }
};

//Get Dashboard Count
exports.dashboardDataCount =async (req, res) => {
  let responseData = [];
  var query = "SELECT COUNT(DISTINCT dispatchId) as dispatchCount FROM balmerlawrie.fifoviolationlists where createdAt between '"+req.query.createdAtStart+"' and '"+req.query.createdAtEnd+"'";
  await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT})
  .then(function(data) {
     responseData.push(data);
  });
  var query = "SELECT COUNT(DISTINCT materialCode) as materialCount FROM balmerlawrie.fifoviolationlists where createdAt between '"+req.query.createdAtStart+"' and '"+req.query.createdAtEnd+"'";
  await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT})
  .then(function(data) {
    responseData.push(data);
  });  
  res.send(responseData);
}