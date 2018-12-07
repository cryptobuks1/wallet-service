'use strict';

var baseService = require('../../../base-service');
var BaseWalletService = baseService.WalletService;

var BaseTxProposal = BaseWalletService.Model.TxProposal;
var btcLib = require('@owstack/btc-lib');
var Address = btcLib.Address;
var Defaults = require('../common/defaults');
var Networks = btcLib.Networks;
var Transaction = btcLib.Transaction;
var Unit = btcLib.Unit;
var inherits = require('inherits');

var context = {
	Address: Address,
	Defaults: Defaults,
	Networks: Networks,
	Transaction: Transaction,
	Unit: Unit
};

function CTxProposal(opts) {
  return BaseTxProposal.apply(this, [context, opts]);
};
inherits(CTxProposal, BaseTxProposal);

// Expose all static methods.
Object.keys(BaseTxProposal).forEach(function(key) {
  CTxProposal[key] = BaseTxProposal[key];
});

/**
 *
 */
CTxProposal.fromObj = function(obj) {
	return BaseTxProposal.fromObj(context, obj);
};

module.exports = CTxProposal;
