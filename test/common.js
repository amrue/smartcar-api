var chai = require('chai');
var constants = require('./testing-constants.js').constants;
var server = require('../src/smartcar-server.js');
var should = chai.should();

exports.chai = chai;
exports.should = should;
exports.constants = constants;
exports.server = server;
