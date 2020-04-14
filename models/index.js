const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.tutorials = require("./tutorial.model.js")(sequelize, Sequelize);
db.materialinwards = require("./materialinward.model.js")(sequelize, Sequelize);
db.materialtypes = require("./materialtype.model.js")(sequelize, Sequelize);
db.materials = require("./material.model.js")(sequelize, Sequelize);
db.packagingtypes = require("./packagingtype.model.js")(sequelize, Sequelize);
db.ttats = require("./ttat.model.js")(sequelize, Sequelize);
db.depots = require("./depot.model.js")(sequelize, Sequelize);
db.dispatchslips = require("./dispatchslip.model.js")(sequelize, Sequelize);
db.dispatchslipmateriallists = require("./dispatchslipmateriallist.model.js")(sequelize, Sequelize);
db.projects = require("./project.model.js")(sequelize, Sequelize);
db.projectaudititems = require("./projectaudititems.model.js")(sequelize, Sequelize);
db.scrapandrecovers = require("./scrapandrecover.model.js")(sequelize, Sequelize);
db.dispatchpickerrelations = require("./dispatchpickerrelation.model.js")(sequelize, Sequelize);
db.dispatchloaderrelations = require("./dispatchloaderrelation.model.js")(sequelize, Sequelize);
db.dispatchpickingmateriallists = require("./dispatchpickingmateriallist.model.js")(sequelize, Sequelize);
db.dispatchloadingmateriallists = require("./dispatchloadingmateriallist.model.js")(sequelize, Sequelize);
db.roles = require("./role.model.js")(sequelize, Sequelize);
db.users = require("./user.model.js")(sequelize, Sequelize);
db.inventorytransactions = require("./inventorytransaction.model.js")(sequelize, Sequelize);
db.fifoviolationlists = require("./fifoviolation.model.js")(sequelize, Sequelize);

module.exports = db;