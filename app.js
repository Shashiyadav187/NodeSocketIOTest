
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/skeleton_test', routes.skeleton_test);
app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


// Real-time updates

var serverStatus = function () {
  var now = new Date();
  var m = process.memoryUsage();
  return {
    timeUTC: now.toISOString(),
    rss: m.rss,
    heapTotal: m.heapTotal,
    heapUsed: m.heapUsed,
    uptime: Math.round(process.uptime()),
    arch: process.arch,
    platform: process.platform,
    version: process.version
  };
};

var emitServerStatus = function (socket) {
  var ss = serverStatus();
  socket.emit('serverStatus', ss);
};

io.sockets.on('connection', function (socket) {
  // Send server status immediately, and every second thereafter
  emitServerStatus(socket);
  var interval = setInterval(function () {
    emitServerStatus(socket);
  }, 1000);

  socket.on('disconnect', function () {
    clearInterval(interval);
  });
});
