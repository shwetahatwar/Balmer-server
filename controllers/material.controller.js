const db = require("../models");
const Material = db.materials;
const Op = db.Sequelize.Op;

// Create and Save a new material
exports.create = (req, res) => {
  console.log(req.body);
  // Validate request
  if (!req.body.materialCode) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  // var getSerialNumber = Date.now();
  // Create a material
  const material = {
    materialCode: req.body.materialCode,
    materialType: req.body.materialType,
    materialDescription: req.body.materialDescription,
    genericName: req.body.genericName,
    packingType: req.body.packingType,
    packSize: req.body.packSize,
    netWeight: req.body.netWeight,
    grossWeight: req.body.grossWeight,
    UOM: req.body.UOM,
    status:true,
    createdBy:req.body.createdBy,
    updatedBy:req.body.updatedBy
  };

  // Save material in the database
  Material.create(material)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the material."
      });
    });
};

// Retrieve all materials from the database.
exports.findAll = (req, res) => {
  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  console.log();
  Material.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving materials."
      });
    });
};

// exports.findOne = (req, res) => {
//   const id = req.params.id;

//   Material.findByPk(id)
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error retrieving MaterialInward with id=" + id
//       });
//     });
// };

exports.findByMaterialCode = (req, res) => {
  Material.findAll({
     where: {
        'materialCode': req.query.materialCode
    }
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving MaterialInward with id=" + id
    });
  });
};