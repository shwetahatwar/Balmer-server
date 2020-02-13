const db = require("../models");
const DispatchPickerRelation = db.dispatchpickerrelations;
const Op = db.Sequelize.Op;
const User = db.users;

// Create and Save a new MaterialInward
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

  // Create a MaterialInward
  const dispatchpickerrelation = {
    dispatchId: req.body.dispatchId,
    userId:userId,
    createdBy:req.user.username,
    updatedBy:req.user.username
  };

  // Save MaterialInward in the database
  DispatchPickerRelation.create(dispatchpickerrelation)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the MaterialInward."
    });
  });
};

exports.getAll = (req,res) =>{
  DispatchPickerRelation.findAll({
    where:req.query
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

exports.getById = (req,res) => {
  const id = req.params.id;

  DispatchPickerRelation.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving MaterialInward with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

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

exports.getUsersbyDispatchSlip = (req,res) =>{
  DispatchPickerRelation.findAll({
    where:req.params
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

exports.getDispatchSlipbyUser = (req,res) =>{
  DispatchPickerRelation.findAll({
    where:req.params
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