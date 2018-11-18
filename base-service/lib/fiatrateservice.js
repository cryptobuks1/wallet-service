'use strict';

var owsCommon = require('@owstack/ows-common');
var async = require('async');
var log = require('npmlog');
var Model = require('./model');
var request = require('request');
var Storage = require('./storage');
var lodash = owsCommon.deps.lodash;
var $ = require('preconditions').singleton();

log.debug = log.verbose;

function FiatRateService(context) {
console.log('FiatRateService ctor');
  if (!(this instanceof FiatRateService)){
    return new FiatRateService(context);
  }

  // Context defines the coin network and is set by the implementing service in
  // order to instance this base service; e.g., btc-service.
  this.ctx = context;
};

FiatRateService.prototype.init = function(opts, cb) {
  var self = this;

  opts = opts || {};

  self.request = opts.request || request;
  self.defaultProvider = opts.defaultProvider || this.ctx.Defaults.FIAT_RATE_PROVIDER;

  async.parallel([

    function(done) {
      if (opts.storage) {
        self.storage = opts.storage;
        done();
      } else {
        self.storage = new Storage();
        self.storage.connect(opts.storageOpts, done);
      }
    },
  ], function(err) {
    if (err) {
      log.error(err);
    }
    return cb(err);
  });
};

FiatRateService.prototype.startCron = function(opts, cb) {
  var self = this;

  opts = opts || {};

  self.providers = lodash.values(require('./fiatrateproviders'));

  var interval = opts.fetchInterval || this.ctx.Defaults.FIAT_RATE_FETCH_INTERVAL;
  if (interval) {
    self._fetch();
    setInterval(function() {
      self._fetch();
    }, interval * 60 * 1000);
  }

  return cb();
};

FiatRateService.prototype._fetch = function(cb) {
  var self = this;

  cb = cb || function() {};

  async.each(self.providers, function(provider, next) {
    self._retrieve(provider, function(err, res) {
      if (err) {
        log.warn('Error retrieving data for ' + provider.name, err);
        return next();
      }
      self.storage.storeFiatRate(provider.name, res, function(err) {
        if (err) {
          log.warn('Error storing data for ' + provider.name, err);
        }
        return next();
      });
    });
  }, cb);
};

FiatRateService.prototype._retrieve = function(provider, cb) {
  var self = this;

  log.debug('Fetching data for ' + provider.name);
  self.request.get({
    url: provider.url,
    json: true,
  }, function(err, res, body) {
    if (err || !body) {
      return cb(err);
    }

    log.debug('Data for ' + provider.name + ' fetched successfully');

    if (!provider.parseFn) {
      return cb(new Error('No parse function for provider ' + provider.name));
    }
    var rates = provider.parseFn(body);

    return cb(null, rates);
  });
};


FiatRateService.prototype.getRate = function(opts, cb) {
  var self = this;

  $.shouldBeFunction(cb);

  opts = opts || {};

  var now = Date.now();
  var provider = opts.provider || self.defaultProvider;
  var ts = (lodash.isNumber(opts.ts) || lodash.isArray(opts.ts)) ? opts.ts : now;

  async.map([].concat(ts), function(ts, cb) {
    self.storage.fetchFiatRate(provider, opts.code, ts, function(err, rate) {
      if (err) return cb(err);
      if (rate && (ts - rate.ts) > this.ctx.Defaults.FIAT_RATE_MAX_LOOK_BACK_TIME * 60 * 1000) rate = null;

      return cb(null, {
        ts: +ts,
        rate: rate ? rate.value : undefined,
        fetchedOn: rate ? rate.ts : undefined,
      });
    });
  }, function(err, res) {
    if (err) return cb(err);
    if (!lodash.isArray(ts)) res = res[0];
    return cb(null, res);
  });
};


module.exports = FiatRateService;