#!/usr/bin/env node

'use strict';

var config = require('../config');
var EmailService = require('../lib/emailservice');

if (config.emailOpts) {
	var emailService = new EmailService();

	emailService.start(config, function(err) {
	  if (err) {
	  	throw err;
	  }

	  console.log('Email service started');
	});
} else {
  console.log('Email service not configured');	
}
