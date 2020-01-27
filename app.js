// var createError = require('http-errors');
var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
var bodyParser = require('body-parser');
var jwt = require("jsonwebtoken");
const cors = require("cors");

var materialinwardRouter = require('./routes/materialinward.routes');
var usersRouter = require('./routes/user.routes');
var materialtypeRouter = require('./routes/materialtype.routes');
var materialRouter = require('./routes/material.routes');
var packagingtypeRouter = require('./routes/packagingtype.routes');
var ttatRouter = require('./routes/ttat.routes');
var depoRouter = require('./routes/depo.routes');

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

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], 'THISISLONGSTRINGKEY', function(err, decode) {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

app.use('/api/users', usersRouter);
app.use('/api/materialinwards', materialinwardRouter);
app.use('/api/materialtype', materialtypeRouter);
app.use('/api/material', materialRouter);
app.use('/api/packagingtype', packagingtypeRouter);
app.use('/api/ttat', ttatRouter);
app.use('/api/depo', depoRouter);

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

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

