exports.parseVehicleInfo = function(body) {

    // create a result object that we can return later
    var result = {};

    // grab contents of the data property
    var data = body.data;

    // cars either have four doors or two ... except the Sterling Nova
    if (data.fourDoorSedan && data.fourDoorSedan.value == "True") {
        result.doorCount = 4;
    } else {
        result.doorCount = 2;
    }
    result.vin = data.vin.value;
    result.color = data.color.value;
    result.driveTrain = data.driveTrain.value;

    // return our result
    return result;
}

exports.parseSecurityStatus = function(body) {

    // create a result array that we can return later
    var result = [];

    // grab data we actually need
    var data = body.data.doors.values;

    // for each door, find out where it is and its lock status
    for (var i = 0; i < data.length; i++) {
        var door = {};
        door.location = data[i].location.value;
        door.locked = data[i].locked.value === "True" ? true : false;
        result.push(door);
    }

    return result;
}

exports.parseFuelTank = function(body) {
    var result = {};

    // we only care about tank data. Battery level doesn't help us
    // if someone explicitly asks for fuel tank information.
    var data = body.data.tankLevel;

    // value could be null if car has no tank, that's fine
    // this indicates no fuel tank to the requester
    if (data.type === 'Number') {
        result.percent = parseFloat(data.value);
    } else {
        result.percent = 'null';
    }

    // return our result
    return result;
}

exports.parseBattery = function(body) {
    var result = {};

    var data = body.data.batteryLevel;

    // we only care about battery data. Fuel level doesn't help us
    // if someone explicitly asks for battery information.
    if (data.type === 'Number') {
        result.percent = parseFloat(data.value);
    } else {
        result.percent = 'null';
    }

    // return our result
    return result;
}

exports.parseEngine = function(body) {
    var result = {};
    var data = body.actionResult.status;

    if (data == "EXECUTED") {
        result.status = 'success';
    } else {
        result.status = 'error';
    }

    // return our result
    return result;
}
