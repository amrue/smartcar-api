var server;
var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');

var gmService = require('./gm-service.js');

exports.app = app;

exports.start = function(port, cb) {

    // configure app to use bodyParser() for easy POST handling
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    // ROUTES FOR THE SMARTCAR API
    // ----------------------------------------

    var router = express.Router();

    // test route to make sure API is up and running
    router.get('/health', function(req, res) {
        res.json({
            message: 'API is alive'
        });
    });

    // get vehicle info of a specific vehicle
    router.get('/vehicles/:id', function(req, res) {
        gmService.getVehicleInfo(req, res);
    });

    // get security info of a specific vehicle
    router.get('/vehicles/:id/doors', function(req, res) {
        gmService.getSecurityStatus(req, res);
    });

    // get fuel range of a specific vehicle
    router.get('/vehicles/:id/fuel', function(req, res) {
        gmService.getFuelTank(req, res);
    });

    // get fuel range of a specific vehicle
    router.get('/vehicles/:id/battery', function(req, res) {
        gmService.getBattery(req, res);
    });

    // start or stop the engine of a specific vehicle
    router.post('/vehicles/:id/engine', function(req, res) {
        gmService.toggleEngine(req, res);
    });

    app.use('/', router);

    // STARTING THE SERVER
    // ----------------------------------------

    server = app.listen(port, cb);

}

exports.stop = function() {
    server.close();
};
