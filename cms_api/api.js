var express = require('express');
var app = express();

app.get('/', function(req, res) {
	var Parse = require('parse/node');
	Parse.initialize("myAppId");
	Parse.serverURL = 'http://localhost:1337/parse';

	var userRepository1 = require("./user.js");

	var userRepositoryInstance = new userRepository1();
	var output = userRepositoryInstance.addUser(Parse, res);
});

app.listen(3000, function() {
	console.log('Example app listening on port 3000!');
});
