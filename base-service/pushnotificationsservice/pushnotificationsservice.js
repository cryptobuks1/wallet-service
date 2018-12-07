#!/usr/bin/env node

'use strict';

var baseConfig = require('../config');
var log = require('npmlog');

log.debug = log.verbose;
log.level = 'debug';

function Service(context, config) {
  // Context defines the coin network and is set by the implementing service in
  // order to instance this base service; e.g., btc-service.
  this.ctx = context;

  this.config = config || baseConfig;
	this.pushNotificationsService = new this.ctx.PushNotificationsService(this.config);
};

Service.prototype.start = function(opts) {
	this.pushNotificationsService.start(opts, function(err) {
	  if (err) {
	  	throw err;
	  }

	  log.debug('Push Notification service started');
	});
};

if (require.main === module) {
	throw 'The base push notifications service cannot be started from the command line';
}

module.exports = Service;
