const db = require("../models");
const Ttat = db.ttats;
const Op = db.Sequelize.Op;

// Create and Save a new TTAT
exports.create = async (req, res) => {
  console.log(req.body);
  // Validate request
  var isTruckAlreadyIn = 0;
  if (!req.body.truckNumber) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // var getSerialNumber = Date.now();
  // Create a TTAT
  const ttat = {
    truckNumber: req.body.truckNumber,
    capacity: req.body.capacity,
    inTime: req.body.inTime,
    outTime: req.body.outTime,
    driver: req.body.driver,
    loadStartTime: req.body.loadStartTime,
    loadEndTime: req.body.loadEndTime,
    loadingTime: req.body.loadingTime,
    inOutTime: req.body.inOutTime,
    idleTime: req.body.idleTime,
    consignmentLocation: req.body.consignmentLocation,
    driverMobileNumber: req.body.driverMobileNumber,
    transportor: req.body.transportor,
    createdBy:req.user.username,
    updatedBy:req.user.username
  };

  await Ttat.findAll({
    where:{
      truckNumber : req.body.truckNumber,
      outTime : null
    }
    }).then(data => {
      if(data[0] != undefined && data[0] !=null){
        isTruckAlreadyIn =1;
      }
  })
  // Save TTAT in the database
  if(isTruckAlreadyIn == 0){
  Ttat.create(ttat)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log("Line 39",err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the TTAT."
      });
    });
  }
  else{
    res.status(500).send({
        message:
          "Truck is already in"
      });
  }
};

//Update TTAT by Id
exports.update = async (req, res) => {
  const id = req.params.id;
  var inTime=0;
  var loadingTime;
  if(req.body.status == 1){
    req.body.status = true;
  }
  if(req.body.status == 0){
    req.body.status = false;
  }
  await Ttat.findAll({
    where:req.params
  })
  .then(data => {
    inTime = data[0]["dataValues"]["inTime"];
    loadingTime = data[0]["dataValues"]["loadingTime"];
  })
  .catch(err => {
    res.status(500).send({
      message: "Error Ttat with id=" + id
    });
  });

  var inOutTime = req.body.outTime - inTime;
  var idleTime = inOutTime - loadingTime;
  var updatedBody = {
    outTime: req.body.outTime,
    inOutTime:inOutTime,
    idleTime:idleTime,
    outRemarks:req.body.outRemarks
  }
  await Ttat.update(updatedBody, {
    where: req.params
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "TTAT was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update TTAT with id=${id}. Maybe TTAT was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating TTAT with id=" + id
      });
    });
};

// Retrieve all TTAT from the database.
exports.findAll = (req, res) => {
  // console.log();
  var queryString = req.query;
  if(req.query.status == 1){
    req.query.status = true;
  }
  if(req.query.status == 0){
    req.query.status = false;
  }
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
  Ttat.findAll({ 
    where: queryString,
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
          err.message || "Some error occurred while retrieving ttats."
      });
    });
};

//Find all truck Date wise for TTAT report
exports.findByDatewise = (req, res) => {
  // console.log();
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
  Ttat.findAll({ 
    where: {
      createdAt: {
        [Op.gte]: parseInt(req.query.createdAtStart),
        [Op.lt]: parseInt(req.query.createdAtEnd),
      }
    },
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
          err.message || "Some error occurred while retrieving ttats."
      });
    });
};

//Find TTAT by Id
exports.findOne = (req, res) => {
  const id = req.params.id;
  if(req.query.status == 1){
    req.query.status = true;
  }
  if(req.query.status == 0){
    req.query.status = false;
  }
  Ttat.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Ttat with id=" + id
      });
    });
};

//Find by TTAT Code
exports.findByTtat = (req, res) => {
  Ttat.findAll({
     where: {
        'ttat': req.query.ttat
    }
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving Ttat with id=" + id
    });
  });
};

//TTAT truck Out
exports.truckOut = (req, res) => {
  const id = req.body.id;
  // console.log("Barcode Serial",req.query.barcodeSerial);
  Ttat.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Ttat was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Ttat with id=${id}. Maybe Ttat was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Ttat with id=" + id
      });
    });
};

exports.getTtatDashboard = async (req, res) => {
  var d = new Date();
  console.log("Line 576",d);
  var newDay = d.getDate();
  if(newDay.toString().length == 1)
    newDay = "0" + newDay;
  var newMonth = d.getMonth();
  newMonth = newMonth +1;
  if(newMonth.toString().length == 1)
    newMonth = "0" + newMonth;
  var newYear = d.getFullYear();
  var newDateTimeNow = newYear + "-" + newMonth + "-" + newDay;

  var query = "SELECT * FROM balmerlawrie.ttats where createdAt like '%" + newDateTimeNow + "%';";
  await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT})
  .then(function(ttat) {
    console.log(ttat);
    var inTruck = 0;
    var outTruck = 0;
    var total = ttat.length;
    for(var i = 0; i < ttat.length; i++){
      if(ttat[i]["outTime"] != null){
        outTruck++;
      }
      else{
        inTruck++;
      }
    }
    var ttatCount = {
      inTruck: inTruck,
      outTruck: outTruck,
      total:total
    }
    res.send(ttatCount);
  });
};

// Retrieve all TTAT from the database by transportor.
exports.findAllTTATByTransportor = (req, res) => {
  // console.log();
  var queryString = req.query;
  var offset = 0;
  var limit = 100;
  if(req.query.offset != null || req.query.offset != undefined){
    offset = parseInt(req.query.offset)
  }
  if(req.query.offset != null || req.query.offset != undefined){
    limit = parseInt(req.query.limit)
  }
  delete queryString['offset'];
  delete queryString['limit'];
  console.log("queryString",queryString);
  Ttat.findAll({ 
    where: { 
      transportor: {
          [Op.or]: {
            [Op.like]: ''+req.query.transportor+'%',
            [Op.eq]: ''+req.query.transportor+''
          }
        }
      },
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
          err.message || "Some error occurred while retrieving ttats."
      });
    });
};

// Retrieve all TTAT from the database by truckNumber.
exports.findAllTTATByTruckNumber = (req, res) => {
  // console.log();
  var queryString = req.query;
  var offset = 0;
  var limit = 100;
  if(req.query.offset != null || req.query.offset != undefined){
    offset = parseInt(req.query.offset)
  }
  if(req.query.offset != null || req.query.offset != undefined){
    limit = parseInt(req.query.limit)
  }
  delete queryString['offset'];
  delete queryString['limit'];
  console.log("queryString",queryString);
  Ttat.findAll({ 
    where: { 
      truckNumber: {
          [Op.or]: {
            [Op.like]: ''+req.query.truckNumber+'%',
            [Op.eq]: ''+req.query.truckNumber+''
          }
        }
      },
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
          err.message || "Some error occurred while retrieving ttats."
      });
    });
};
