var express     = require('express');
var app         = express();
var request     = require('request');
var bodyParser  = require('body-parser');

exports.app = app;

// configure app to use bodyParser()
// this will let us get data from a POST that is sent to the Smartcar API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; // run the app on port 8080

// ROUTES FOR THE SMARTCAR API
// ----------------------------------------

var router = express.Router();

// test route to make sure API is up and running
router.get('/health', function(req, res) {
    res.json({ message: 'API is alive' });
});

// get vehicle info of a specific vehicle
router.get('/vehicles/:id', function(req, res, next) {

    // options to pass into request
    var options = {
        headers: {'content-type' : 'application/json'},
        url: 'http://gmapi.azurewebsites.net/getVehicleInfoService',
        method: 'POST',
        body: JSON.stringify({ 'id': req.params.id, 'responseType': 'JSON' })
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            // parse the body text
            var body = JSON.parse(body);

            // GM returns a 200 even on failure, so we need
            // to look at the status inside the return body
            if(body.status && body.status !== '200') {

                res.status(body.status).send(body.reason);

            } else {

                // create a result object that we can return later
                var result = {};
                // grab contents of the data property
                var data = body.data;

                // cars either have four doors or two ... except the Sterling Nova
                if(data.fourDoorSedan && data.fourDoorSedan.value == "True") {
                    result.doorCount = 4;
                } else {
                    result.doorCount = 2;
                }
                result.vin = data.vin.value;
                result.color = data.color.value;
                result.driveTrain = data.driveTrain.value;

                // return our result
                res.send(result);
            }
        }
    })
});

// get security info of a specific vehicle
router.get('/vehicles/:id/doors', function(req, res) {

    // options to pass into request
    var options = {
        headers: {'content-type' : 'application/json'},
        url: 'http://gmapi.azurewebsites.net/getSecurityStatusService',
        method: 'POST',
        body: JSON.stringify({ 'id': req.params.id, 'responseType': 'JSON' })
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            // parse the body text
            var body = JSON.parse(body);

            if(body.status && body.status !== '200') {

                res.status(body.status).send(body.reason);

            } else {

                // create a result array that we can return later
                var result = [];
                // grab data we actually need
                var data = body.data.doors.values;

                // for each door, find out where it is and its lock status
                for(var i = 0; i < data.length; i++) {
                    var door = {};
                    door.location = data[i].location.value;
                    door.locked = data[i].locked.value === "True" ? true : false;
                    result.push(door);
                }

                res.send(result);
            }
        }
    })
});

// get fuel range of a specific vehicle
router.get('/vehicles/:id/fuel', function(req, res) {

    // options to pass into request
    var options = {
        headers: {'content-type' : 'application/json'},
        url: 'http://gmapi.azurewebsites.net/getEnergyService',
        method: 'POST',
        body: JSON.stringify({ 'id': req.params.id, 'responseType': 'JSON' })
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            // parse the body text
            var body = JSON.parse(body);

            if(body.status && body.status !== '200') {

                res.status(body.status).send(body.reason);

            } else {

                var result = {};

                // we only care about tank data. Battery level doesn't help us
                // if someone explicitly asks for fuel tank information.
                var data = body.data.tankLevel;

                // value could be null if car has no tank, that's fine
                // this indicates no fuel tank to the requester
                result.percent = data.value;

                // return our result
                res.send(result);
            }
        }
    })

});

// get fuel range of a specific vehicle
router.get('/vehicles/:id/battery', function(req, res) {

    // options to pass into request
    var options = {
        headers: {'content-type' : 'application/json'},
        url: 'http://gmapi.azurewebsites.net/getEnergyService',
        method: 'POST',
        body: JSON.stringify({ 'id': req.params.id, 'responseType': 'JSON' })
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            // parse the body text
            var body = JSON.parse(body);

            if(body.status && body.status !== '200') {

                res.status(body.status).send(body.reason);

            } else {

                var result = {};

                // we only care about battery data. Fuel level doesn't help us
                // if someone explicitly asks for battery information.
                var data = body.data.batteryLevel;

                // value could be null if car has no battery, that's ok
                result.percent = data.value;

                // return our result
                res.send(result);
            }
        }
    })

});

// start or stop the engine of a specific vehicle
router.post('/vehicles/:id/engine', function(req, res) {

    // get the POST body that was passed in, thanks to bodyParser
    var actionType = req.body.action;

    // options to pass into request
    var options = {
        headers: {'content-type' : 'application/json'},
        url: 'http://gmapi.azurewebsites.net/actionEngineService',
        method: 'POST'
    };

    // check what the action was, and create the POST body accordingly
    if(actionType === "START") {
        options.body = JSON.stringify({ 'id': req.params.id,
            'command': 'START_VEHICLE', 'responseType': 'JSON' });
    } else if(actionType === "STOP") {
        options.body = JSON.stringify({ 'id': req.params.id,
            'command': 'STOP_VEHICLE', 'responseType': 'JSON' });
    } else {
        // we can't identify the command,
        res.status('400').send('Unknown Action: ' + actionType);
        return;
    }

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            var body = JSON.parse(body);

            // GM returns a 200 even on failure, so we need
            // to look at the status inside the return body
            if(body.status && body.status !== '200') {

                res.status(body.status).send(body.reason);

            } else {

                var result = {};
                var data = body.actionResult.status;

                if(data == "EXECUTED") {
                    result.status = 'success';
                } else {
                    result.status = 'error';
                }

                // return our result
                res.send(result);
            }
        }
    })

});

app.use('/', router);

// STARTING THE SERVER
// ----------------------------------------

app.listen(port);
console.log('Smartcar API is running on port ' + port);
