var request = require('request');
var gmAdapter = require('./gm-adapter.js');

var url = 'http://gmapi.azurewebsites.net';

exports.getVehicleInfo = function(req, res) {

    // options to pass into request
    var options = {
        body: JSON.stringify({
            'id': req.params.id,
            'responseType': 'JSON'
        }),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        timeout: 2000,
        url: url + '/getVehicleInfoService'
    };

    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {

            // parse the body text
            var body = JSON.parse(body);

            // GM returns a 200 even on failure, so we need
            // to look at the status inside the return body
            if (body.status == '200') {
                var vehicleInfo = gmAdapter.parseVehicleInfo(body);
                res.send(vehicleInfo);
            } else {
                res.status(body.status).send(body.reason);
            }
        } else {
            if (error.code === 'ETIMEDOUT') {
                res.status(504).send('Gateway Timeout');
            } else {
                res.status(400).send('Bad Request');
            }
        }
    })
}

exports.getSecurityStatus = function(req, res) {

    // options to pass into request
    var options = {
        body: JSON.stringify({
            'id': req.params.id,
            'responseType': 'JSON'
        }),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        timeout: 2000,
        url: url + '/getSecurityStatusService'
    };

    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {

            // parse the body text
            var body = JSON.parse(body);

            if (body.status == '200') {
                var securityStatus = gmAdapter.parseSecurityStatus(body);
                res.send(securityStatus);
            } else {
                res.status(body.status).send(body.reason);
            }
        } else {
            if (error.code === 'ETIMEDOUT') {
                res.status(504).send('Gateway Timeout');
            } else {
                res.status(400).send('Bad Request');
            }
        }
    })
}

exports.getFuelTank = function(req, res) {

    // options to pass into request
    var options = {
        body: JSON.stringify({
            'id': req.params.id,
            'responseType': 'JSON'
        }),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        timeout: 2000,
        url: url + '/getEnergyService'
    };

    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {

            // parse the body text
            var body = JSON.parse(body);

            if (body.status == '200') {
                var fuelTank = gmAdapter.parseFuelTank(body);
                res.send(fuelTank);
            } else {
                res.status(body.status).send(body.reason);
            }
        } else {
            if (error.code === 'ETIMEDOUT') {
                res.status(504).send('Gateway Timeout');
            } else {
                res.status(400).send('Bad Request');
            }
        }
    })
}

exports.getBattery = function(req, res) {
    // options to pass into request
    var options = {
        body: JSON.stringify({
            'id': req.params.id,
            'responseType': 'JSON'
        }),
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        timeout: 2000,
        url: url + '/getEnergyService'
    };

    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {

            // parse the body text
            var body = JSON.parse(body);

            if (body.status == '200') {
                var battery = gmAdapter.parseBattery(body);
                res.send(battery);
            } else {
                res.status(body.status).send(body.reason);
            }
        } else {
            if (error.code === 'ETIMEDOUT') {
                res.status(504).send('Gateway Timeout');
            } else {
                res.status(400).send('Bad Request');
            }
        }
    })
}


exports.toggleEngine = function(req, res) {

    // get the POST body that was passed in, thanks to bodyParser
    var actionType = req.body.action;

    // options to pass into request
    var options = {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        timeout: 2000,
        url: url + '/actionEngineService'
    };

    // check what the action was, and create the POST body accordingly
    if (actionType === "START") {
        options.body = JSON.stringify({
            'id': req.params.id,
            'command': 'START_VEHICLE',
            'responseType': 'JSON'
        });
    } else if (actionType === "STOP") {
        options.body = JSON.stringify({
            'id': req.params.id,
            'command': 'STOP_VEHICLE',
            'responseType': 'JSON'
        });
    } else {
        // we can't identify the command,
        res.status('400').send('Unknown Action: ' + actionType);
        return;
    }

    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {

            var body = JSON.parse(body);

            if (body.status == '200') {
                var engine = gmAdapter.parseEngine(body);
                res.send(engine);
            } else {
                res.status(body.status).send(body.reason);
            }

        } else {
            if (error.code === 'ETIMEDOUT') {
                res.status(504).send('Gateway Timeout');
            } else {
                res.status(400).send('Bad Request');
            }
        }
    })

}
