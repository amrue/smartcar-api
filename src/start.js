var app = require ('./smartcar-server.js');

var port = process.env.PORT || 8080; // run the app on port 8080

app.start(port, function () {
    console.log('Smartcar API is running on port ' + port + '\n');
});
