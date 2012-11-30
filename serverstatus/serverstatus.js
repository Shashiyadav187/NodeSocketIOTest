// serverstatus module
//
// Accepts Socket.IO connections, and once-per-second, emits a
// 'serverStatus' event to each client.  The event data is an object
// with these properties:
//
//  timeUTC:     timestamp in ISO 8601 format
//  rss:         process memory resident set size
//  heapTotal:   V8 engine heap total
//  heapUsed:    V8 engine heap used
//  uptime:      number of seconds process has been running
//  arch:        CPU architecture
//  platform:    OS platform
//  nodeVersion: Node version
//  clientCount: number of connected Socket.IO clients

exports.listen = listen

// Accept connections
function listen(server) {
  var io = require('socket.io').listen(server);

  io.sockets.on('connection', function (socket) {
    onConnection(socket);

    socket.on('disconnect', function () {
      onDisconnect(socket);
    });
  });
}

var intervalTimer = null,
    sockets = [];
    
function log(message) {
  console.log("serverStatus: " + message);
}

// Generate data object to be sent to client
function serverStatusData() {
  var now = new Date();
  var m = process.memoryUsage();

  return {
    timeUTC:     now.toISOString(),
    rss:         m.rss,
    heapTotal:   m.heapTotal,
    heapUsed:    m.heapUsed,
    uptime:      Math.round(process.uptime()),
    arch:        process.arch,
    platform:    process.platform,
    nodeVersion: process.version,
    clientCount: sockets.length
  };
};

// Emit server status to clients
function emitServerStatus() {
  var data = serverStatusData();
  sockets.forEach(function(socket) {
    socket.emit('serverStatus', data);
  });
};

function onConnection(socket) {
  log("Adding socket");
  sockets.push(socket);

  if (!intervalTimer) {
    log("Starting interval timer");
    intervalTimer = setInterval(emitServerStatus, 1000);
  }
}

function onDisconnect(socket) {
  log("Removing socket");
  var index = sockets.indexOf(socket);
  if (index >= 0) {
    sockets.splice(index, 1);
  }

  if (intervalTimer && sockets.length == 0) {
    log("Stopping interval timer");
    clearInterval(intervalTimer);
    intervalTimer = null;
  }
}

