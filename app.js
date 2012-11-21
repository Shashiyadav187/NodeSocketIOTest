
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

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


// Real-time updates

var serverStatus = function () {
  var d = new Date();
  var m = process.memoryUsage();
  return {
    timeUTC: d.toISOString(),
    rss: m.rss,
    heapTotal: m.heapTotal,
    heapUsed: m.heapUsed,
    uptime: process.uptime(),
    arch: process.arch,
    platform: process.platform,
    version: process.version
  };
}

io.sockets.on('connection', function (socket) {
  console.log('Socket connection: ' + socket);

  socket.emit('serverStatus', serverStatus());

  var interval = setInterval(function () {
    socket.emit('serverStatus', serverStatus());
  }, 1000);

  socket.on('disconnect', function () {
    console.log('Disconnection');
    clearInterval(interval);
  });
});
