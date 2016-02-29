var express = require('express');
var app = express();
var forEach = require('async-foreach').forEach;
var request = require('request');
var bodyParser = require('body-parser');
var duino = require( 'iotduino'),
    pinMode = duino.PinMode, pinState = duino.PinState,
    pins = duino.Pins, ledPin = pins.GPIO13;
var led2 = pins.GPIO2;
var led3 = pins.GPIO3;
var led4 = pins.GPIO4;

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

app.get('/toggle2', function (req, res){
    duino.digitalWrite( led2, !duino.digitalRead( led2));
    res.send('Actual value for pin 2: ' + duino.digitalRead( led2));
});

app.get('/toggle3', function (req, res){
    duino.digitalWrite( led3, !duino.digitalRead( led3 ));
    res.send('Actual value for pin 3: ' + duino.digitalRead( led3 ));
});

app.get('/toggle4', function (req, res){
    duino.digitalWrite( led4, !duino.digitalRead( led4));
    res.send('Actual value for pin 4: ' + duino.digitalRead( led4));
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