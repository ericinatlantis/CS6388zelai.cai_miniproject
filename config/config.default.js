'use strict';

var config = require('./config.webgme'),
    validateConfig = require('webgme/config/validator');

// Add/overwrite any additional settings here
config.server.port = 8888;
config.mongo.uri = 'mongodb://127.0.0.1:27017/mrv-ds';
config.plugin.allowServerExecution = true;

validateConfig(config);
module.exports = config;
