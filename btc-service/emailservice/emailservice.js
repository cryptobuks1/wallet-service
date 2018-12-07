#!/usr/bin/env node

'use strict';

var baseService = require('../../base-service');
var BaseEmailService = baseService.EmailService;

var btcLib = require('@owstack/btc-lib');
var EmailService = require('../lib/emailservice');
var Networks = btcLib.Networks;
var inherits = require('inherits');

var context = {
	EmailService: EmailService,
	Networks: Networks
};

function CEmailService(config) {
  BaseEmailService.apply(this, [context, config]);
};
inherits(CEmailService, BaseEmailService);

// Expose all static methods.
Object.keys(BaseEmailService).forEach(function(key) {
  CEmailService[key] = BaseEmailService[key];
});

// Start the service with base configuration (default).
var service = new CEmailService();
service.start();
