var express = require('express');
var app = express();
var forEach = require('async-foreach').forEach;
var request = require('request');
var bodyParser = require('body-parser')
app.use( bodyParser.json() );

var servers = [];

app.post('/registerserver', function (req, res) {
    console.log(req.body);
    servers.push(req.body.url);
    res.send('Hello World!');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
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