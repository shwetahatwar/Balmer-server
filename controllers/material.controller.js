const db = require("../models");
const Material = db.materials;
const Op = db.Sequelize.Op;
const MaterialType = db.materialtypes;
const PackagingType = db.packagingtypes;

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
    tareWeight: req.body.tareWeight,
    UOM: req.body.UOM,
    status:true,
    createdBy:req.user.username,
    updatedBy:req.user.username
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
  Material.findAll({ 
    where: queryString,
    subQuery: false,
    include: [{
      model: MaterialType
    },
    {
      model:PackagingType
    }]
  })
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

exports.getById = (req,res) => {
  const id = req.params.id;

  Material.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving MaterialInward with id=" + id
      });
    });
}

exports.findAllScrapped = (req, res) => {
  Material.findAll({ 'status': 0})
  .then(data => {
    res.send(data);
  })
};

exports.findAllRecovered = (req, res) => {
  Material.findAll({ 'status': 1})
  .then(data => {
    res.send(data);
  })
};

exports.update = (req, res) => {
  const id = req.params.id;

  Material.update(req.body, {
    where: req.params
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Material was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Material with id=${id}. Maybe Material was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Material with id=" + id
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

exports.createEach = async (req, res) => {
  console.log(req.body);
  // for(var i=0;i<req.body.material)
  var packagingtypesId;
  await PackagingType.findAll({
    where: {
      name: req.body.packagingtypesId
    }
  })
  .then(data => {
    packagingtypesId = data[0]["dataValues"]["id"]
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving MaterialInward with id=" + id
    });
  });

  var materialtypesId;
  await MaterialType.findAll({
    where: {
      name: req.body.materialtypesId
    }
  })
  .then(data => {
    materialtypesId = data[0]["dataValues"]["id"]
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving MaterialInward with id=" + id
    });
  });

  const material = {
    materialCode: req.body.materialCode,
    materialType: materialtypesId,
    materialDescription: req.body.materialDescription,
    genericName: req.body.genericName,
    packingType: packagingtypesId,
    packSize: req.body.packSize,
    netWeight: req.body.netWeight,
    grossWeight: req.body.grossWeight,
    tareWeight: req.body.tareWeight,
    UOM: req.body.UOM,
    status:true,
    createdBy:req.user.username,
    updatedBy:req.user.username
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
