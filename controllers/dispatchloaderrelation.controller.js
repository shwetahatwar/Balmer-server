const db = require("../models");
const DispatchLoaderRelation = db.dispatchloaderrelations;
const DispatchSlip = db.dispatchslips;
const Op = db.Sequelize.Op;
const User = db.users;
const Ttat = db.ttats;
const Depot = db.depots;

// Create and Save a new Dispatch Loader Relation
exports.create = async (req, res) => {
  console.log(req.body);
  // Validate request
  if (!req.body.dispatchId) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  var userId;
  await User.findAll({ 
    where: {username:req.body.userId} 
  })
  .then(data => {
    console.log("Line 19",data);
    userId = data[0]["dataValues"]["id"];
  })
  .catch(err => {
    // res.status(500).send({
    //   message:
    //     "err.message || "Some error occurred while retrieving users.""
    // });
    console.log(err);
  });
  // Create a Dispatch Loader Relation
  const dispatchloaderrelation = {
    dispatchId: req.body.dispatchId,
    userId:userId,
    createdBy:req.user.username,
    updatedBy:req.user.username
  };

  // Save Dispatch Loader Relation in the database
  DispatchLoaderRelation.create(dispatchloaderrelation)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the DispatchLoaderRelation."
    });
  });
};

//Get Dispatch Loader Relation
exports.getAll = (req,res) =>{
  DispatchLoaderRelation.findAll({
    where:req.query
  })
  .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving DispatchLoaderRelation."
      });
    });
};

//Get Dispatch Loader Relation by Id
exports.getById = (req,res) => {
  const id = req.params.id;

  DispatchLoaderRelation.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving DispatchLoaderRelation with id=" + id
      });
    });
};

//Update Dispatch Loader Relation
exports.update = (req, res) => {
  const id = req.params.id;

  DispatchLoaderRelation.update(req.body, {
    where: req.params
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "DispatchLoaderRelation was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update DispatchLoaderRelation with id=${req.params}. Maybe DispatchLoaderRelation was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating DispatchLoaderRelation with id=" + req.params
      });
    });
};

//Get Users by Dispatch Slip
exports.getUsersbyDispatchSlip = (req,res) =>{
  var userListArray=[];
  DispatchLoaderRelation.findAll({
    where:req.params
  })
  .then(async data => {
    // res.send(data);
    for(var i = 0; i< data.length;i++){
      console.log("value for i: ",data[i]["dataValues"]["userId"]);
      await User.findAll({
        where:{
          id:data[i]["dataValues"]["userId"]
        }
      })
      .then(userData=>{
        userListArray.push(userData[0]["dataValues"]);
        console.log("Line 139",userListArray);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving DispatchLoaderRelation."
        });
      })
    }
    res.send(userListArray);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving DispatchLoaderRelation."
    });
  });
};

//Get Dispatch Slip by User
exports.getDispatchSlipbyUser = (req,res) =>{

  var d = new Date();
  console.log("Line 576",d);
  var newDay = d.getDate();
  if(newDay.toString().length == 1)
    newDay = "0" + newDay;
  var newMonth = d.getMonth();
  var newYear = d.getFullYear();
  
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  newMonth = monthNames[newMonth];

  var newDateTimeNow = newMonth + " " + newDay + " " + newYear;

  var dispatchListArray=[];
  DispatchLoaderRelation.findAll({
    where:{
      userId:req.params.userId
    }
  })
  .then(async data => {
      // res.send(data);
      console.log("Data: ",data.length);
      for(var i = 0; i< data.length;i++){
        console.log("value for i: ",data[i]["dataValues"]["dispatchId"]);
        await DispatchSlip.findAll({
          where :{
            id:data[i]["dataValues"]["dispatchId"]
          },
          include: [{
            model: Ttat
          },
          {
            model: Depot
          }] 
        })
        .then(dispatchSlipData => {
          var updatedAt = dispatchSlipData[0]["dataValues"]["updatedAt"];
          if(dispatchSlipData[0]["dataValues"]["dispatchSlipStatus"] == "Active" || dispatchSlipData[0]["dataValues"]["dispatchSlipStatus"] == "Picked" ){
            dispatchListArray.push(dispatchSlipData[0]["dataValues"]);  
            console.log("Line 182",dispatchListArray);
          }
          else if(dispatchSlipData[0]["dataValues"]["dispatchSlipStatus"] == "Completed" && updatedAt.toString().includes(newDateTimeNow)){
             dispatchListArray.push(dispatchSlipData[0]["dataValues"]);  
             console.log("Line 185",dispatchListArray);
          }
        })
        .catch(err=>{
          res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving DispatchLoaderRelation."
          });
        })
      }

      dispatchListArray.sort(function(a, b){
        var nameA=a.dispatchSlipStatus.toLowerCase(), 
        nameB=b.dispatchSlipStatus.toLowerCase()
        if (nameA < nameB) //sort string ascending
            return -1 
        if (nameA > nameB)
            return 1
        return 0 //default return value (no sorting)
      });
      res.send(dispatchListArray);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving DispatchLoaderRelation."
      });
    });
};