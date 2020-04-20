// var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var winston = require('./config/winston');
var bodyParser = require('body-parser');
var jwt = require("jsonwebtoken");
const cors = require("cors");
var encodeUrl = require('encodeurl')

var materialinwardRouter = require('./routes/materialinward.routes');
var usersRouter = require('./routes/user.routes');
var materialtypeRouter = require('./routes/materialtype.routes');
var materialRouter = require('./routes/material.routes');
var packagingtypeRouter = require('./routes/packagingtype.routes');
var ttatRouter = require('./routes/ttat.routes');
var depotRouter = require('./routes/depot.routes');
var dispatchRouter = require('./routes/dispatchslip.routes');
var dispatchSlipMaterialListRouter = require('./routes/dispatchslipmateriallist.routes');
var projectRouter = require('./routes/project.routes');
var projectAuditItemsRouter = require('./routes/projectaudititems.routes');
var dispatchPickerRelationRouter = require('./routes/dispatchpickerrelation.routes');
var dispatchLoaderRelationRouter = require('./routes/dispatchloaderrelation.routes');
var dispatchPickingMaterialListRouter = require('./routes/dispatchpickingmateriallist.routes');
var dispatchLoadingMaterialListRouter = require('./routes/dispatchloadingmateriallist.routes');
var roleRouter = require('./routes/role.routes');
var setupDataRouter = require('./routes/setupdata.routes');
var inventoryTransactionRouter = require('./routes/inventorytransaction.routes');
var scrapandrecoveriesRouter = require('./routes/scrapandrecover.routes');
var fifoViolationRouter = require('./routes/fifoviolation.routes');
var materialTransactionRouter = require('./routes/materialtransaction.routes');


const app = express();

// var corsOptions = {
//   origin: "http://localhost:3000"
// };

// app.use(cors(corsOptions));
app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
  next();
});

// parse requests of content-type - application/json
app.use(bodyParser.json());

//logger
app.use(morgan('combined', { stream: winston.stream }));



// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], 'THISISLONGSTRINGKEY', async function(err, decode) {
      if (err) req.user = undefined;
      // console.log("Line 57 Decode: ", decode);
      // req.user = decode;
      const User = db.users;
      await User.findAll({
        where:{
          username: decode["username"]
        }
      }).then(data=>{
        // console.log("Line 65",data[0]["dataValues"]);
        if(data[0] != null || data[0] != undefined)
          req.user = data[0]["dataValues"]
      });
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

app.use('/users', usersRouter);
app.use('/materialinwards', materialinwardRouter);
app.use('/materialtypes', materialtypeRouter);
app.use('/materials', materialRouter);
app.use('/packagingtypes', packagingtypeRouter);
app.use('/ttats', ttatRouter);
app.use('/depots', depotRouter);
app.use('/dispatchslips', dispatchRouter);
app.use('/projects', projectRouter);
app.use('/projectaudititems', projectAuditItemsRouter);
app.use('/dispatchslipmateriallists', dispatchSlipMaterialListRouter);
app.use('/dispatchpickerrelations', dispatchPickerRelationRouter);
app.use('/dispatchloaderrelations', dispatchLoaderRelationRouter);
app.use('/dispatchpickingmateriallists', dispatchPickingMaterialListRouter);
app.use('/dispatchloadingmateriallists', dispatchLoadingMaterialListRouter);
app.use('/roles', roleRouter);
app.use('/setupData', setupDataRouter);
app.use('/inventorytransactions', inventoryTransactionRouter);
app.use('/scrapandrecoveries', scrapandrecoveriesRouter);
app.use('/fifoviolationlists',fifoViolationRouter);
app.use('/materialtransactions',materialTransactionRouter);

//sync
const db = require("./models");
db.sequelize.sync();

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to BRiOT application." });
});

// require("./routes/tutorial.routes")(app);
// require("./routes/materialinward.routes")(app);
// require("./routes/user.routes")(app);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err })
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

