const db = require("../models");
const MaterialInward = db.materialinwards;
const InventoryTransaction = db.inventorytransactions;
const Op = db.Sequelize.Op;

// Retrieve all Inventory Transaction from the database.
exports.findAll = (req, res) => {
  // console.log(req)
  const title = req.params.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  InventoryTransaction.findAll({ 
    where: req.query,
    include: [{model: MaterialInward}] 
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving InventoryTransaction."
      });
    });
};

// Find a single Inventory Transaction with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  InventoryTransaction.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving InventoryTransaction with id=" + id
      });
    });
};
