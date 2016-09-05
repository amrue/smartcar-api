var common = require("../common");
var adapter = require('../../src/gm-adapter.js');

var constants = common.constants;
var server = common.server;

describe('GM API Response Adapter', function() {

    before(function(done) {
        server.start(8080, done);
    });

    after(function() {
        server.stop();
    });

    it('should properly parse and return vehicle information (four door)', function() {

        var result = adapter.parseVehicleInfo(constants.gmVehicleInfo);

        result.should.eql(constants.infoResponse);
    });

    it('should properly parse and return vehicle information (two door)', function() {

        var result = adapter.parseVehicleInfo(constants.twoDoorVehicleInfo);

        result.should.eql(constants.twoDoorInfoResponse);
    });

    it('should properly parse and return security status', function() {

        var result = adapter.parseSecurityStatus(constants.gmSecurity);

        result.should.eql(constants.secResponse);
    });


    it('should properly parse and return fuel tank', function() {

        var result = adapter.parseFuelTank(constants.gmFuel);

        result.should.eql(constants.fuelResponse);
    });


    it('should properly parse and return battery information', function() {

        var result = adapter.parseBattery(constants.gmBattery);

        result.should.eql(constants.batteryResponse);
    });

    it('should properly parse and return engine status (success)', function() {

        var result = adapter.parseEngine(constants.gmEngine);

        result.should.eql(constants.engResponse);
    });

    it('should properly parse and return engine status (error)', function() {

        var result = adapter.parseEngine(constants.gmEngineFailure);

        result.should.eql(constants.engResponseError);
    });
});
