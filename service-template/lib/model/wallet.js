'use strict';

var cLib = require('../../cLib');
var owsCommon = require('@owstack/ows-common');
var Context = owsCommon.util.Context;

var BaseWalletService = require('../../../base-service').WalletService;
var BaseWallet = BaseWalletService.Model.Wallet;

var Address = require('./address');
var Copayer = require('./copayer');
var Networks = cLib.Networks;

var context = new Context({
	Address: Address,
	Copayer: Copayer,
	Networks: Networks
});

class CWallet extends BaseWallet {
	constructor(obj) {
	  super(context, obj);
	}
};

/**
 *
 */
CWallet.create = function(obj) {
	return BaseWallet.create(context, obj);
};

/**
 *
 */
CWallet.fromObj = function(obj) {
	return BaseWallet.fromObj(context, obj);
};

module.exports = CWallet;
