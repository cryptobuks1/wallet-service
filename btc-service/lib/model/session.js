'use strict';

var baseService = require('../../../base-service');
var baseWalletService = baseService.WalletService;

var BaseSession = baseWalletService.Model.Session;
var Common = require('../common');
var Defaults = Common.Defaults;
var inherits = require('inherits');

function BtcSession(opts) {
	var context = {
		Defaults: Defaults
	};

  return BaseSession.apply(this, [context, opts]);
};
inherits(BtcSession, BaseSession);

// Expose all static methods.
Object.keys(BaseSession).forEach(function(key) {
  BtcSession[key] = BaseSession[key];
});

/**
 *
 */
BtcSession.fromObj = function(obj) {
	var context = {
		Defaults: Defaults
	};

	return BaseSession.fromObj(context, obj);
};

module.exports = BtcSession;