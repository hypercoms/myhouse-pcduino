var express = require('express');
var app = express();
var forEach = require('async-foreach').forEach;
var request = require('request');
var bodyParser = require('body-parser');
var duino = require( 'iotduino'),
    pinMode = duino.PinMode, pinState = duino.PinState,
    pins = duino.Pins, ledPin = pins.GPIO13;

app.use( bodyParser.json() );

var servers = [];

app.post('/registerserver', function (req, res) {
    console.log(req.body);
    servers.push(req.body.url);
    res.send('Hello World! with iotduino');
});

app.get('/toggle', function (req, res){
    duino.digitalWrite( ledPin, !duino.digitalRead( ledPin));
    res.send('Actual value for pin 13: ' + duino.digitalRead( ledPin));
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
    duino.pinMode( ledPin, pinMode.OUTPUT);
    setInterval(sendToServers, 1000);
});

function sendToServers(){
    console.log("Registerd servers: ", servers);
    forEach(servers, function(server){
        var response = {timestamp: new Date().getTime()}
        request({url: server, method: 'POST', json: response}, function(err, res, body){
            console.log(response);
        })
    });
}