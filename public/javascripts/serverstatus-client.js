// See the serverstatus.js module for the server-side code associated
// with this client-side module.
//
// This script depends on the following libraries:
// - underscore.js
// - backbone.js
// - socket.io.js
// - jquery.js

$(document).ready(function() {
  var ServerStatusModel = Backbone.Model.extend({
    initialize: function() {
      this.on("change:timeUTC", function(model, newValue) {
        $('#timeUTC').text(newValue);
      });

      this.on("change:rss", function (model, newValue) {
        $('#rss').text(newValue);
      });

      this.on("change:heapTotal", function (model, newValue) {
        $('#heapTotal').text(newValue);
      });
      
      this.on("change:heapUsed", function (model, newValue) {
        $('#heapUsed').text(newValue);
      });
      
      this.on("change:uptime", function (model, newValue) {
        $('#uptime').text(newValue);
      });
      
      this.on("change:arch", function (model, newValue) {
        $('#arch').text(newValue);
      });
      
      this.on("change:platform", function (model, newValue) {
        $('#platform').text(newValue);
      });
      
      this.on("change:nodeVersion", function (model, newValue) {
        $('#nodeVersion').text(newValue);
      });
      
      this.on("change:clientCount", function (model, newValue) {
        $('#clientCount').text(newValue);
      });
    }
  });

  var serverStatusModel = new ServerStatusModel();
  
  var socket = io.connect();
  socket.on('serverStatus', function (ss) {
    serverStatusModel.set(ss);
  });
});
