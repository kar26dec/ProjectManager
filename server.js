var cluster = require('cluster');
var express = require('express');
var bodyParser = require('body-parser');
var approute = require('./routes/approutes');
var mongoose = require('mongoose');
var config = require('./config/mongoose'); // get our config file
var app = express();
var helmet = require('helmet');

mongoose.Promise = global.Promise;

var MongooseOptions = {
  server: { poolSize: 20, reconnectTries: Number.MAX_VALUE, socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
};
mongoose.connect('mongodb://localhost/projectmanager', MongooseOptions);

//mongoose.connect(config.database); // connect to database

//app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: false,parameterLimit: 1000000 }));
app.use(bodyParser.json({limit:1024102420, type:'application/json'}));
// app.use(bodyParser.urlencoded({ 
//     extended: false,
//     parameterLimit: 1000000 // experiment with this parameter and tweak
// }));


app.use(helmet());
app.use(helmet.frameguard({ action: 'sameorigin' }));
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(helmet.hidePoweredBy());

app.use(function (req, res, next) {
  //console.log("111 " + req.originalUrl + " " + req.body.messagetype); // '/admin/new'
  console.log("123 " + req.path);
  //res.set("Content-Type", 'application/json');
  next();
});

app.use('/api/app', approute);        //include the file to route all the application based requests

// catch 404 and forward to error handler
/*app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});*/


app.use(function (req, res, next) {
  console.log("111 " + req.originalUrl + " " + req.body.messagetype); // '/admin/new'
  console.log("response header " + res.headersSent);
  //console.log(res);
  next();
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {

    console.error(err.stack);
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
} else {

  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    console.error(err.stack);
    /* res.status(err.status || 500);
     res.send({
         message: err.message,
         error: err
     });*/
  });
}


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Get port from environment and store in Express.
 */

//set EventEmitter memory leak detected
//process.setMaxListeners(0);

var port = normalizePort(process.env.PORT || '5000');
app.set('port', port);
app.set('superSecret', 'projectmanager');


//listen to all incoming request on the assigned port
app.listen(port, function () {
  console.log('Process ' + process.pid + ' is listening to all incoming requests');
  //EmergencyContact.SendMessageToEmergencyContact();
 // SharkIdExist.SendMessageForSharkid();
  app.timeout = 300000;
});

//setInterval(GetMyNetworkScript.CardZeroLevelProcess(), 1000 * 60 * 2);

// var rule = new schedule.RecurrenceRule();
// rule.hour=24;

// var j = schedule.scheduleJob(rule, function(){
//   console.log('The answer to life, the universe, and everything!');
// });