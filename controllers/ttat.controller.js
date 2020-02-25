const db = require("../models");
const Ttat = db.ttats;
const Op = db.Sequelize.Op;

// Create and Save a new ttat
exports.create = (req, res) => {
  console.log(req.body);
  // Validate request
  if (!req.body.truckNumber) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // var getSerialNumber = Date.now();
  // Create a ttat
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
    createdBy:req.user.username,
    updatedBy:req.user.username
  };


  // Save ttat in the database
  Ttat.create(ttat)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      console.log("Line 39",err);
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the ttat."
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Ttat.update(req.body, {
    where: req.params
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

// Retrieve all ttats from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  // console.log();
  Ttat.findAll({ 
    where: req.query,
    order: [
            ['id', 'DESC'],
        ],
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

exports.findOne = (req, res) => {
  const id = req.params.id;

  Ttat.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving TtatInward with id=" + id
      });
    });
};

exports.findByTtatCode = (req, res) => {
  Ttat.findAll({
     where: {
        'ttatCode': req.query.ttatCode
    }
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving TtatInward with id=" + id
    });
  });
};

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
      if(ttat[i]["outTime"] == "1970-01-01 00:00:00"){
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