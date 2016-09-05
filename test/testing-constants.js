exports.constants = {

    // GM API RESPONSES
    // ----------------------------------------

    gmVehicleInfo: {
        "service": "getVehicleInfo",
        "status": "200",
        "data": {
            "vin": {
                "type": "String",
                "value": "123123412412"
            },
            "color": {
                "type": "String",
                "value": "Metallic Silver"
            },
            "fourDoorSedan": {
                "type": "Boolean",
                "value": "True"
            },
            "twoDoorCoupe": {
                "type": "Boolean",
                "value": "False"
            },
            "driveTrain": {
                "type": "String",
                "value": "v8"
            }
        }
    },

    twoDoorVehicleInfo: {
        "service": "getVehicleInfo",
        "status": "200",
        "data": {
            "vin": {
                "type": "String",
                "value": "123123412412"
            },
            "color": {
                "type": "String",
                "value": "Metallic Silver"
            },
            "fourDoorSedan": {
                "type": "Boolean",
                "value": "False"
            },
            "twoDoorCoupe": {
                "type": "Boolean",
                "value": "True"
            },
            "driveTrain": {
                "type": "String",
                "value": "v8"
            }
        }
    },

    gmSecurity: {
        "service": "getSecurityStatus",
        "status": "200",
        "data": {
            "doors": {
                "type": "Array",
                "values": [{
                    "location": {
                        "type": "String",
                        "value": "frontLeft"
                    },
                    "locked": {
                        "type": "Boolean",
                        "value": "False"
                    }
                }, {
                    "location": {
                        "type": "String",
                        "value": "frontRight"
                    },
                    "locked": {
                        "type": "Boolean",
                        "value": "True"
                    }
                }]
            }
        }
    },

    gmFuel: {
        "service": "getEnergyService",
        "status": "200",
        "data": {
            "tankLevel": {
                "type": "Number",
                "value": "30"
            },
            "batteryLevel": {
                "type": "Null",
                "value": "null"
            }
        }
    },

    gmBattery: {
        "service": "getEnergyService",
        "status": "200",
        "data": {
            "tankLevel": {
                "type": "Null",
                "value": "null"
            },
            "batteryLevel": {
                "type": "Number",
                "value": "50"
            }
        }
    },

    gmEngine: {
        "service": "actionEngine",
        "status": "200",
        "actionResult": {
            "status": "EXECUTED"
        }
    },

    gmEngineFailure: {
        "service": "actionEngine",
        "status": "200",
        "actionResult": {
            "status": "FAILED"
        }
    },

    gmNotFound: {
        "status": "404",
        "reason": "Some error: thing was not found."
    },


    // TESTING CONSTANTS FOR CORRECT RESPONSES
    // ----------------------------------------

    infoResponse: {
        "vin": "123123412412",
        "color": "Metallic Silver",
        "doorCount": 4,
        "driveTrain": "v8"
    },

    twoDoorInfoResponse: {
        "vin": "123123412412",
        "color": "Metallic Silver",
        "doorCount": 2,
        "driveTrain": "v8"
    },

    secResponse: [{
        "location": "frontLeft",
        "locked": false
    }, {
        "location": "frontRight",
        "locked": true
    }],

    fuelResponse: {
        "percent": 30
    },

    batteryResponse: {
        "percent": 50
    },

    engResponse: {
        "status": "success"
    },

    engResponseError: {
        "status": "error"
    }

}
