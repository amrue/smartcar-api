var common = require("../common");
var chaiHttp = require('chai-http');
var nock = require('nock');

var chai = common.chai;
var constants = common.constants;
var server = common.server;

var url = 'http://gmapi.azurewebsites.net';

chai.use(chaiHttp);

describe('Smartcar API Integration Tests', function() {

    before(function(cb) {
        server.start(8080, cb);
    });

    after(function() {
        server.stop();
    });


    describe('API Health', function() {

        it('should return a successful health check', function(done) {
            chai.request(server.app)
                .get('/health')
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('message');
                    res.body.message.should.equal('API is alive');
                    done();
                });
        });

    });


    describe('Vehicle Information', function() {

        it('should return vehicle information', function(done) {

            nock(url)
                .post('/getVehicleInfoService', {
                    "id": "1234",
                    "responseType": "JSON"
                })
                .reply(200, constants.gmVehicleInfo);

            chai.request('http://localhost:8080')
                .get('/vehicles/1234')
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('vin');
                    res.body.should.have.property('color');
                    res.body.should.have.property('doorCount');
                    res.body.should.have.property('driveTrain');
                    res.body.vin.should.equal('123123412412');
                    res.body.color.should.equal('Metallic Silver');
                    res.body.doorCount.should.equal(4);
                    res.body.driveTrain.should.equal('v8');
                    done();
                });
        });

        it('should return 504 on ETIMEDOUT', function(done) {

            this.timeout(5000);

            nock(url)
                .post('/getVehicleInfoService', {
                    "id": "1235",
                    "responseType": "JSON"
                })
                .delay(2500)
                .reply(200, constants.gmVehicleInfo);

            chai.request('http://localhost:8080')
                .get('/vehicles/1235')
                .end(function(err, res) {
                    res.should.have.status(504);
                    done();
                });
        });

    });

    describe('Vehicle Security', function() {

        it('should return security status', function(done) {

            nock(url)
                .post('/getSecurityStatusService', {
                    "id": "1234",
                    "responseType": "JSON"
                })
                .reply(200, constants.gmSecurity);

            chai.request(server.app)
                .get('/vehicles/1234/doors')
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body[0].should.have.property('location');
                    res.body[0].should.have.property('locked');
                    res.body[0].location.should.be.a('string');
                    res.body[0].locked.should.be.a('boolean');
                    res.body[1].should.have.property('location');
                    res.body[1].should.have.property('locked');
                    res.body[1].location.should.be.a('string');
                    res.body[1].locked.should.be.a('boolean');
                    done();
                });
        });

        it('should return 404 on invalid ID', function(done) {

            nock(url)
                .post('/getSecurityStatusService', {
                    "id": "1236",
                    "responseType": "JSON"
                })
                .reply(200, constants.gmNotFound);

            chai.request('http://localhost:8080')
                .get('/vehicles/1236/doors')
                .end(function(err, res) {
                    res.should.have.status(404);
                    done();
                });
        });
    });

    describe('Fuel Range', function() {
        it('should return fuel range', function(done) {

            nock(url)
                .post('/getEnergyService', {
                    "id": "1234",
                    "responseType": "JSON"
                })
                .reply(200, constants.gmFuel);

            chai.request(server.app)
                .get('/vehicles/1234/fuel')
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('percent');
                    done();
                });
        });

        it('should return a null fuel range if the car has no tank', function(done) {

            nock(url)
                .post('/getEnergyService', {
                    "id": "1235",
                    "responseType": "JSON"
                })
                .reply(200, constants.gmBattery);

            chai.request(server.app)
                .get('/vehicles/1235/fuel')
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('percent');
                    res.body.percent.should.equal('null');
                    done();
                });
        });

    });

    describe('Battery Range', function() {
        it('should return battery range', function(done) {

            nock(url)
                .post('/getEnergyService', {
                    "id": "1235",
                    "responseType": "JSON"
                })
                .reply(200, constants.gmBattery);

            chai.request(server.app)
                .get('/vehicles/1235/battery')
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('percent');
                    res.body.percent.should.equal(50);
                    done();
                });
        });

        it('should return a null battery range if the car has no battery', function(done) {

            nock(url)
                .post('/getEnergyService', {
                    "id": "1234",
                    "responseType": "JSON"
                })
                .reply(200, constants.gmFuel);

            chai.request(server.app)
                .get('/vehicles/1234/battery')
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('percent');
                    res.body.percent.should.equal('null');
                    done();
                });
        });

    });

    describe('Engine Status', function() {

        it('should start the car and return engine status', function(done) {

            nock(url)
                .post('/actionEngineService', {
                    "id": "1235",
                    "command": "START_VEHICLE",
                    "responseType": "JSON"
                })
                .reply(200, constants.gmEngine);

            chai.request(server.app)
                .post('/vehicles/1235/engine')
                .send({
                    'action': 'START'
                })
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('status');
                    res.body.status.should.equal('success');
                    done();
                });
        });

        it('should stop the car and return engine status', function(done) {
            nock(url)
                .post('/actionEngineService', {
                    "id": "1235",
                    "command": "STOP_VEHICLE",
                    "responseType": "JSON"
                })
                .reply(200, constants.gmEngine);

            chai.request(server.app)
                .post('/vehicles/1235/engine')
                .send({
                    'action': 'STOP'
                })
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('status');
                    res.body.status.should.equal('success');
                    done();
                });
        });

        it('should handle failed engine status', function(done) {

            nock(url)
                .post('/actionEngineService', {
                    "id": "1235",
                    "command": "START_VEHICLE",
                    "responseType": "JSON"
                })
                .reply(200, constants.gmEngineFailure);

            chai.request(server.app)
                .post('/vehicles/1235/engine')
                .send({
                    'action': 'START'
                })
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.have.property('status');
                    res.body.status.should.equal('error');
                    done();
                });
        });

    });


    describe('Error Handling', function() {
        nock(url)
            .post('/getVehicleInfoService', {
                "id": "99999",
                "responseType": "JSON"
            })
            .reply(200, {
                'status': '404',
                'reason': 'ID not found'
            });
        it('should return a 404 if the ID does not exist', function(done) {
            chai.request(server.app)
                .get('/vehicles/99999')
                .end(function(err, res) {
                    res.should.have.status(404);
                    done();
                });
        });

        it('should return 400 on bad request', function(done) {
            chai.request(server.app)
                .post('/vehicles/1235/engine')
                .send({
                    'action': 'foo'
                })
                .end(function(err, res) {
                    res.should.have.status(400);
                    res.error.text.should.equal('Unknown Action: foo');
                    done();
                });
        });

    });

});
