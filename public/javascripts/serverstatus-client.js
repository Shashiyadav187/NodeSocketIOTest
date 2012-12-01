// See the serverstatus.js module for the server-side code associated
// with this client-side module.
//
// This script depends on the following libraries:
// - underscore.js
// - backbone.js
// - socket.io.js
// - jquery.js

$(document).ready(function() {
  var serverStatusModel = new Backbone.Model();

  serverStatusModel.on("change:timeUTC", function(model, newValue) {
    $('#timeUTC').text(newValue);
  });

  serverStatusModel.on("change:rss", function (model, newValue) {
    $('#rss').text(newValue);
  });

  serverStatusModel.on("change:heapTotal", function (model, newValue) {
    $('#heapTotal').text(newValue);
  });
  
  serverStatusModel.on("change:heapUsed", function (model, newValue) {
    $('#heapUsed').text(newValue);
  });
  
  serverStatusModel.on("change:uptime", function (model, newValue) {
    $('#uptime').text(newValue);
  });
  
  serverStatusModel.on("change:arch", function (model, newValue) {
    $('#arch').text(newValue);
  });
  
  serverStatusModel.on("change:platform", function (model, newValue) {
    $('#platform').text(newValue);
  });
  
  serverStatusModel.on("change:nodeVersion", function (model, newValue) {
    $('#nodeVersion').text(newValue);
  });
  
  serverStatusModel.on("change:clientCount", function (model, newValue) {
    $('#clientCount').text(newValue);
  });
  
  var socket = io.connect();
  socket.on('serverStatus', function (ss) {
    serverStatusModel.set(ss);
  });
});
