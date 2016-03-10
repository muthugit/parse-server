var express = require('express');
var app = express();
var parseServerLocation = "http://localhost";
var parserServerPort = ":1337";
var userRepository = require("./user.js");

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
