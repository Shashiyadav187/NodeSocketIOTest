// Real-time updates

// Generate data object to be sent to client
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

// Emit server status to client
var emitServerStatus = function (socket) {
  var ss = serverStatus();
  socket.emit('serverStatus', ss);
};

exports.listen = function(server) {
  var io = require('socket.io').listen(server);

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
};
