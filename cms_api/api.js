var express = require('express');
var app = express();

app.get('/', function(req, res) {
	var Parse = require('parse/node');
	Parse.initialize("myAppId");
	Parse.serverURL = 'http://localhost:1337/parse';
	
	var GameScore = Parse.Object.extend("GameScore");
	var gameScore = new GameScore();
	gameScore.set("score", 1337);
	gameScore.set("playerName", "Sean Plott");
	gameScore.set("cheatMode", false);

	gameScore.save(null, {
		success : function(gameScore) {
			// Execute any logic that should take place after the object is
			// saved.
			res.send('New object created with objectId: ' + gameScore.id);
		},
		error : function(gameScore, error) {
			// Execute any logic that should take place if the save fails.
			// error is a Parse.Error with an error code and message.
			console.log('Failed to create new object, with error code: '
					+ error.message);
		}
	});

	var userRepository1 = require("./user.js");

	var userRepositoryInstance = new userRepository1();
	var output = userRepositoryInstance.addUser(Parse, res);
});

app.listen(6000, function() {
	console.log('Example app listening on port 6000!');
});
