const db = require("../models");
const MaterialInward = db.materialinwards;
const ScrapandRecover = db.scrapandrecovers;
const Op = db.Sequelize.Op;

// Create and Save a new MaterialInward
exports.create = (req, res) => {
  console.log(req.body);
  // Validate request
  if (!req.body.materialCode) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  var serialNumberId = Date.now();
  // Create a MaterialInward
  const materialinward = {
    materialCode: req.body.materialCode,
    batchNumber: req.body.batchNumber,
    serialNumber: serialNumberId,
    isScrapped: false,
    dispatchSlipId:null,
    status:true,
    createdBy:req.body.createdBy,
    updatedBy:req.body.updatedBy
  };

  // Save MaterialInward in the database
  MaterialInward.create(materialinward)
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

// Retrieve all MaterialInwards from the database.
exports.findAll = (req, res) => {
  // console.log(req)
  const title = req.params.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  MaterialInward.findAll({ where: condition })
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

// Find a single MaterialInward with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  MaterialInward.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving MaterialInward with id=" + id
      });
    });
};

// Update a MaterialInward by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  MaterialInward.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "MaterialInward was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update MaterialInward with id=${id}. Maybe MaterialInward was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating MaterialInward with id=" + id
      });
    });
};

exports.updateWithBarcode = (req, res) => {
  const serialNumber = req.query.barcodeSerial;
  console.log("Barcode Serial",req.query.barcodeSerial);
  MaterialInward.update(req.body, {
    where: { serialNumber: serialNumber }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "MaterialInward was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update MaterialInward with barcodeSerial=${serialNumber}. Maybe MaterialInward was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating MaterialInward with barcodeSerial=" + serialNumber
      });
    });
};

// Delete a MaterialInward with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  MaterialInward.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "MaterialInward was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete MaterialInward with id=${id}. Maybe MaterialInward was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete MaterialInward with id=" + id
      });
    });
};

// Delete all MaterialInwards from the database.
exports.deleteAll = (req, res) => {
  MaterialInward.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} MaterialInwards were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all materialinwards."
      });
    });
};

// Find all published MaterialInwards
// exports.findAllPublished = (req, res) => {
//   MaterialInward.findAll({ where: { published: true } })
//     .then(data => {
//       res.send(data);
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving materialinwards."
//       });
//     });
// };

exports.updateScrapAndRecover = (req, res) => {
  console.log(req.body);
  MaterialInward.update(req.body, {
    where: { id: req.body.id }
  })
    .then(num => {
      if (num == 1) {
        const scrapandrecover = {
          materialInwardId: req.body.id,
          comments:req.body.comments,
          transactionType:req.body.transactionType,
          createdBy:req.body.createdBy,
          updatedBy:req.body.updatedBy
        };

        // Save MaterialInward in the database
        ScrapandRecover.create(scrapandrecover)
          .then(data => {
            res.send(data);
          })
          .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the MaterialInward."
            });
          });
        // res.send({
        //   message: "MaterialInward was updated successfully."
        // });
      } else {
        res.send({
          message: `Cannot update MaterialInward with id=${id}. Maybe MaterialInward was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating MaterialInward with id=" + id
      });
    });
}; 

exports.findAllByBatchCode = (req, res) => {
  MaterialInward.findAll({ 
    where: {
      batchNumber:req.query.batchNumber
    }
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

exports.findAllByMaterialCode = (req, res) => {
  MaterialInward.findAll({ 
    where: {
      materialCode:req.query.materialCode
    }
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

exports.findAllByMaterialCodeandBatchCode = (req, res) => {
  MaterialInward.findAll({ 
    where: {
      materialCode:req.query.materialCode,
      batchNumber:req.query.batchNumber
    }
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