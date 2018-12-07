'use strict';

var baseService = require('../../base-service');
var BaseWalletService = baseService.WalletService;

var PushNotificationsService = BaseWalletService.PushNotificationsService;
var btcLib = require('@owstack/btc-lib');
var Common = require('./common');
var Networks = btcLib.Networks;
var Storage = require('./storage');
var Utils = Common.Utils;
var inherits = require('inherits');

var context = {
	Networks: Networks,
	Storage: Storage,
	Utils: Utils
};

function CPushNotificationsService(config) {
  return PushNotificationsService.apply(this, [context, config]);
};
inherits(CPushNotificationsService, PushNotificationsService);

// Expose all static methods.
Object.keys(PushNotificationsService).forEach(function(key) {
  CPushNotificationsService[key] = PushNotificationsService[key];
});

module.exports = CPushNotificationsService;
