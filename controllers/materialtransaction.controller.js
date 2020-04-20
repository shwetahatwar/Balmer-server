const db = require("../models");
const MaterialTransaction = db.materialtransactions;
const Op = db.Sequelize.Op;
const DispatchSlip = db.dispatchslips;
const User = db.users;

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
  MaterialTransaction.findAll({
    where:req.query,
    include: [{
      model: DispatchSlip
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
          err.message || "Some error occurred while retrieving Material Transactions."
      });
    });
};

//Get Material Transaction by Id
exports.getById = (req,res) => {
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