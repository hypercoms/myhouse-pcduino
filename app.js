var express = require('express');
var app = express();
var forEach = require('async-foreach').forEach;
var request = require('request');
var bodyParser = require('body-parser');
var duino = require( 'iotduino'),
    pinMode = duino.PinMode, pinState = duino.PinState,
    pins = duino.Pins, ledPin = pins.GPIO13;
var pinsOut = [pins.GPIO0, pins.GPIO1, pins.GPIO2, pins.GPIO3, pins.GPIO4,
               pins.GPIO5, pins.GPIO6, pins.GPIO7, pins.GPIO8, pins.GPIO9,
               pins.GPIO10, pins.GPIO11, pins.GPIO12, pins.GPIO13];

var sensorA0 = pins.A0;

app.use( bodyParser.json() );

var servers = [];

app.post('/registerserver', function (req, res) {
    console.log(req.body);
    servers.push(req.body.url);
    res.send('Hello World! with iotduino');
});

app.get('/toggle', function (req, res){
    console.log(req.query);
    var pinIndex = parseInt(req.query.pin);
    console.log(pinIndex, pinsOut);
    console.log(pinsOut[pinIndex]);
    var pin = pinsOut[pinIndex];
    duino.digitalWrite( pin, !duino.digitalRead( pin));
    console.log('PIN >>', pinIndex, ' | state: ', duino.digitalRead( pin) );
    res.send('toggle: ' + pinIndex + " | state " + duino.digitalRead( pin));
});


app.get('/toggleall', function (req, res){
    forEach(pinsOut, function (pin, pinIndex){
        duino.digitalWrite( pin, !duino.digitalRead( pin));
        console.log('PIN >>', pinIndex, ' | state: ', duino.digitalRead( pin) );
    });
    res.send('toggle ALL');
});

app.get('/a0', function (req, res) {
    res.send('A0: ' + duino.analogRead(sensorA0));
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
    forEach(pinsOut, function (pin){
        duino.pinMode( pin, pinMode.OUTPUT);
    });
    duino.pinMode( sensorA0, pinMode.INPUT );
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