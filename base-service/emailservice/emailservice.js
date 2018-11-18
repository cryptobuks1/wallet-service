#!/usr/bin/env node

'use strict';

var log = require('npmlog');

log.debug = log.verbose;

var Service = function(context) {
  // Context defines the coin network and is set by the implementing service in
  // order to instance this base service; e.g., btc-service.
  this.ctx = context;

	this.emailService = new this.ctx.EmailService();
};

Service.prototype.start = function() {
	if (config.emailOpts) {
		this.ctx.emailService.start(this.ctx.config, function(err) {
		  if (err) {
		  	throw err;
		  }

		  console.log('Email service started');
		});
	} else {
	  console.log('Email service not configured');	
	}
};

module.exports = Service;