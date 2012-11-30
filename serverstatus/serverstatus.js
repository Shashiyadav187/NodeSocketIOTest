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
//  nodeVersion: node.js version
//  clientCount: number of connected Socket.IO clients

var _ = require("underscore");

exports.listen = function (server) {
  var io = require('socket.io').listen(server);

  io.sockets.on('connection', function (socket) {
    onConnection(socket);

    socket.on('disconnect', function () {
      onDisconnect(socket);
    });
  });
}

var intervalTimer = null,
    clientSockets = [];
    
function log(message) {
  console.log("serverStatus: " + message);
}

function clientSocketCount() {
  return clientSockets.length;
}

// Generate data object to be sent to client
function serverStatusData() {
  var now = new Date(),
      m = process.memoryUsage(),
      clientCount = clientSocketCount();

  return {
    timeUTC:     now.toISOString(),
    rss:         m.rss,
    heapTotal:   m.heapTotal,
    heapUsed:    m.heapUsed,
    uptime:      Math.round(process.uptime()),
    arch:        process.arch,
    platform:    process.platform,
    nodeVersion: process.version,
    clientCount: clientCount
  };
}

// Emit server status to clients
function emitServerStatus() {
  var data = serverStatusData();

  clientSockets.forEach(function (socket) {
    socket.emit('serverStatus', data);
  });
}

function onConnection(socket) {
  log("Adding socket");
  clientSockets.push(socket);

  if (!intervalTimer) {
    log("Starting interval timer");
    intervalTimer = setInterval(emitServerStatus, 1000);
  }
}

function onDisconnect(socket) {
  log("Removing socket");
  clientSockets = _(clientSockets).without(socket);

  if (intervalTimer && clientSocketCount() == 0) {
    log("Stopping interval timer");
    clearInterval(intervalTimer);
    intervalTimer = null;
  }
}

