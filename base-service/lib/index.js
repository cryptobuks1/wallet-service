'use strict';

/**
 * The base wallet service.
 * @module Base Service
 */

var Common = require('./common');
var Lib = {};

Lib.BlockchainExplorer = require('./blockchainexplorer');
Lib.BlockchainExplorers = require('./blockchainexplorers');
Lib.BlockchainMonitor = require('./blockchainmonitor');
Lib.Defaults = Common.Defaults;
Lib.EmailService = require('./emailservice');
Lib.Errors = require('./errors');
Lib.ExpressApp = require('./expressapp');
Lib.FiatRateProviders = require('./fiatrateproviders');
Lib.FiatRateService = require('./fiatrateservice');
Lib.LocalLock = require('./locallock');
Lib.Lock = require('./lock');
Lib.MessageBroker = require('./messagebroker');
Lib.Model = require('./model');
Lib.NotificationBroadcaster = require('./notificationbroadcaster');
Lib.PushNotificationsService = require('./pushnotificationsservice');
Lib.Server = require('./server');
Lib.Stats = require('./stats');
Lib.Storage = require('./storage');
Lib.Utils = Common.Utils;


module.exports = Lib;