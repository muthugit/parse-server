var express = require('express');
var app = express();
var parseServerLocation = "http://localhost";
var parserServerPort = ":1337";
var userRepository = require("./user.js");

app.use(function(req, res, next) {
    if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization')
        res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE')
        if (req.method === 'OPTIONS') return res.send(200)
    }
    next()
})

app.get('/', function(req, res) {
	var Parse = require('parse/node');
	Parse.initialize("myAppId");
	Parse.serverURL = parseServerLocation + parserServerPort + '/parse';
	var userRepositoryInstance = new userRepository();
	var output = userRepositoryInstance.addUser(Parse, res);
});

app.listen(9991, function() {
	console.log('Example app listening on port 9991!');
});
