'use strict';

var owsCommon = require('@owstack/ows-common');
var BufferReader = owsCommon.encoding.BufferReader;
var Hash = owsCommon.Hash;
var secp256k1 = require('secp256k1');
var lodash = owsCommon.deps.lodash;
var $ = require('preconditions').singleton();

var Utils = {};

Utils.getMissingFields = function(obj, args) {
  args = [].concat(args);
  if (!lodash.isObject(obj)) return args;
  var missing = lodash.filter(args, function(arg) {
    return !obj.hasOwnProperty(arg);
  });
  return missing;
};

/**
 *
 * @desc rounds a JAvascript number
 * @param number
 * @return {number}
 */
Utils.strip = function(number) {
  return parseFloat(number.toPrecision(12));
}

/* TODO: It would be nice to be compatible with bitcoind signmessage. How
 * the hash is calculated there? */
Utils.hashMessage = function(text, noReverse) {
  $.checkArgument(text);
  var buf = new Buffer(text);
  var ret = Hash.sha256sha256(buf);
  if (!noReverse) {
    ret = new BufferReader(ret).readReverse();
  }
  return ret;
};

Utils.verifyMessage = function(text, signature, publicKey) {
  $.checkArgument(text);

  var hash = Utils.hashMessage(text, true);

  var sig = this._tryImportSignature(signature);
  if (!sig) {
    return false;
  }

  var publicKeyBuffer = this._tryImportPublicKey(publicKey);
  if (!publicKeyBuffer) {
    return false;
  }

  return this._tryVerifyMessage(hash, sig, publicKeyBuffer);
};

Utils._tryImportPublicKey = function(publicKey) {
  var publicKeyBuffer = publicKey;
  try {
    if (!Buffer.isBuffer(publicKey)) {
      publicKeyBuffer = new Buffer(publicKey, 'hex');
    }
    return publicKeyBuffer;
  } catch(e) {
    return false;
  }
};

Utils._tryImportSignature = function(signature) {
  try {
    var signatureBuffer = signature;
    if (!Buffer.isBuffer(signature)) {
      signatureBuffer = new Buffer(signature, 'hex');
    }
    return secp256k1.signatureImport(signatureBuffer);
  } catch(e) {
    return false;
  }
};

Utils._tryVerifyMessage = function(hash, sig, publicKeyBuffer) {
  try {
    return secp256k1.verify(hash, sig, publicKeyBuffer);
  } catch(e) {
    return false;
  }
};

Utils.formatAmount = function(satoshis, unit, opts) {
  var UNITS = {
    btc: {
      toSatoshis: 100000000,
      maxDecimals: 6,
      minDecimals: 2,
    },
    bit: {
      toSatoshis: 100,
      maxDecimals: 0,
      minDecimals: 0,
    },
    sat: {
      toSatoshis: 1,
      maxDecimals: 0,
      minDecimals: 0,
    }
  };

  $.shouldBeNumber(satoshis);
  $.checkArgument(lodash.includes(lodash.keys(UNITS), unit));

  function addSeparators(nStr, thousands, decimal, minDecimals) {
    nStr = nStr.replace('.', decimal);
    var x = nStr.split(decimal);
    var x0 = x[0];
    var x1 = x[1];

    x1 = lodash.dropRightWhile(x1, function(n, i) {
      return n == '0' && i >= minDecimals;
    }).join('');
    var x2 = x.length > 1 ? decimal + x1 : '';

    x0 = x0.replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
    return x0 + x2;
  }

  opts = opts || {};

  var u = lodash.assign(UNITS[unit], opts);
  var amount = (satoshis / u.toSatoshis).toFixed(u.maxDecimals);
  return addSeparators(amount, opts.thousandsSeparator || ',', opts.decimalSeparator || '.', u.minDecimals);
};

Utils.formatAmountInBtc = function(amount) {
  return Utils.formatAmount(amount, 'btc', {
    minDecimals: 8,
    maxDecimals: 8,
  }) + 'btc';
};

Utils.formatUtxos = function(utxos) {
  if (lodash.isEmpty(utxos)) return 'none';
  return lodash.map([].concat(utxos), function(i) {
    var amount = Utils.formatAmountInBtc(i.satoshis);
    var confirmations = i.confirmations ? i.confirmations + 'c' : 'u';
    return amount + '/' + confirmations;
  }).join(', ');
};

Utils.formatRatio = function(ratio) {
  return (ratio * 100.).toFixed(4) + '%';
};

Utils.formatSize = function(size) {
  return (size / 1000.).toFixed(4) + 'kB';
};

Utils.parseVersion = function(version) {
  var v = {};

  if (!version) return null;

  var x = version.split('-');
  if (x.length != 2) {
    v.agent = version;
    return v;
  }
  v.agent = lodash.includes(['wc', 'ws'], x[0]) ? 'wc' : x[0];
  x = x[1].split('.');
  v.major = parseInt(x[0]);
  v.minor = parseInt(x[1]);
  v.patch = parseInt(x[2]);

  return v;
};


module.exports = Utils;