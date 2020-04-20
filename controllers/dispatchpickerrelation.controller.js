const db = require("../models");
const DispatchPickerRelation = db.dispatchpickerrelations;
const DispatchSlip = db.dispatchslips;
const Op = db.Sequelize.Op;
const User = db.users;
const Ttat = db.ttats;
const Depot = db.depots;

// Create and Save a new Dispatch Picker Relations
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
    console.log("Line 22",data[0]["dataValues"]);
    userId = data[0]["dataValues"]["id"]
  })
  .catch(err => {
    // res.status(500).send({
    //   message:
    //     "err.message || "Some error occurred while retrieving users.""
    // });
    console.log(err);
  });

  // Create a Dispatch Picker Relations
  const dispatchpickerrelation = {
    dispatchId: req.body.dispatchId,
    userId:userId,
    createdBy:req.user.username,
    updatedBy:req.user.username
  };

  // Save Dispatch Picker Relations in the database
  DispatchPickerRelation.create(dispatchpickerrelation)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the DispatchLoadingMaterialList."
    });
  });
};

//Get Dispatch Picker Relations list
exports.getAll = (req,res) =>{
  if(req.query.serialNumber){
     req.query.serialNumber = req.query.serialNumber.trim();
   }
   if(req.query.status == 1){
    req.query.status = true;
  }
  if(req.query.status == 0){
    req.query.status = false;
  }
  DispatchPickerRelation.findAll({
    where:req.query
  })
  .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving DispatchLoadingMaterialList."
      });
    });
};

//Get Dispatch Picker Relations by Id
exports.getById = (req,res) => {
  const id = req.params.id;
  if(req.query.status == 1){
    req.query.status = true;
  }
  if(req.query.status == 0){
    req.query.status = false;
  }
  DispatchPickerRelation.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving DispatchLoadingMaterialList with id=" + id
      });
    });
};

//Update Dispatch Picker Relations by Id
exports.update = (req, res) => {
  const id = req.params.id;
  if(req.body.serialNumber){
    req.body.serialNumber = req.body.serialNumber.trim();
  }
  if(req.body.status == 1){
    req.body.status = true;
  }
  if(req.body.status == 0){
    req.body.status = false;
  }
  DispatchPickerRelation.update(req.body, {
    where: req.params
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "DispatchPickerRelation was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update DispatchPickerRelation with id=${id}. Maybe DispatchPickerRelation was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating DispatchPickerRelation with id=" + id
      });
    });
};

//Get User by Dispatch Slip Id
exports.getUsersbyDispatchSlip = (req,res) =>{
  var userListArray=[];
  if(req.query.status == 1){
    req.query.status = true;
  }
  if(req.query.status == 0){
    req.query.status = false;
  }
  DispatchPickerRelation.findAll({
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
              err.message || "Some error occurred while retrieving DispatchLoadingMaterialList."
          });
        })
      }
      res.send(userListArray);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving DispatchLoadingMaterialList."
      });
    });
};

//Get Dispatch Slip by User
exports.getDispatchSlipbyUser = async (req,res) =>{

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
  DispatchPickerRelation.findAll({
    where:req.params
  })
  .then(async data => {
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
          if(dispatchSlipData[0]["dataValues"]["dispatchSlipStatus"] == "Active"){
            dispatchListArray.push(dispatchSlipData[0]["dataValues"]);  
            console.log("Line 182",dispatchListArray);
          }
          else if(dispatchSlipData[0]["dataValues"]["dispatchSlipStatus"] == "Picked" && updatedAt.toString().includes(newDateTimeNow)){
             dispatchListArray.push(dispatchSlipData[0]["dataValues"]);  
             console.log("Line 185",dispatchListArray);
          }
          // console.log("Line 139",dispatchListArray);
        })
        .catch(err=>{
          res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving DispatchLoadingMaterialList."
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
          err.message || "Some error occurred while retrieving DispatchLoadingMaterialList."
      });
    });
};