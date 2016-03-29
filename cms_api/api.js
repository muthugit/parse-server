//========= REPOSITORIES ========== //
var userRepository = require("./user.js");
var contentRepository = require("./content.js");
var localConfig = require("./localConfig.js");

var localConfigInstance = new localConfig();
var parseServerLocation = localConfigInstance.getServerLocation();

var express = require('express');
var app = express();
var parserServerPort = ":1337";
var Parse = require('parse/node');
Parse.initialize("myAppId");
Parse.serverURL = parseServerLocation + parserServerPort + '/parse';

// USING CORS -- NEED TO INSTALL
var cors = require('cors');
app.use(cors());

// BODY PARSER
var bodyParser = require('body-parser');
app.use(bodyParser.json({
	limit : '50mb',
	extended : true
}));
app.use(bodyParser.urlencoded({
	limit : '50mb',
	extended : true
}));

app.use(bodyParser.urlencoded({
	extended : true
}));
// app.use(bodyParser.json()); // for parsing application/json

app.use(bodyParser({
	limit : '5mb'
}));

// --------------- GET REQUESTS
app.get('/', function(req, res) {
	res.send("API is running");
});

app.get('/deleteContents', function(req, res, next) {
	var Contents = Parse.Object.extend("content");
	var query = new Parse.Query(Contents);
	query.notEqualTo("title", "Michael Yabuti");
	query.destroy({
		success : function(myObject) {
			// The object was deleted from the Parse Cloud.
		},
		error : function(myObject, error) {
			// The delete failed.
			// error is a Parse.Error with an error code and message.
		}
	});

});

app.get('/login/:userName/:password', function(req, res, next) {
	var userRepositoryInstance = new userRepository();
	userRepositoryInstance.loginUser(Parse, req.params['userName'],
			req.params['password'], res);
});

app.get('/getUserInfo/:userApiKey', function(req, res, next) {
	var userRepositoryInstance = new userRepository();
	userRepositoryInstance.getUserInfo(Parse, req.params['userApiKey'], req,
			res);
});

app.get('/fetch/:userApiKey', function(req, res, next) {
	var contentRepositoryInstance = new contentRepository();
	contentRepositoryInstance.getMultiplePost(Parse, req.params['userApiKey'],
			req, res);
	console.log(req.params['userApiKey']);
});

app.get('/fetchUsers/:userApiKey', function(req, res, next) {
	var contentRepositoryInstance = new contentRepository();
	contentRepositoryInstance.getUsers(Parse, req.params['userApiKey'], req,
			res);
	console.log(req.params['userApiKey']);
});

app.get('/fetchContents/:userApiKey', function(req, res, next) {
	var contentRepositoryInstance = new contentRepository();
	contentRepositoryInstance.getContents(Parse, req.params['userApiKey'], req,
			res);
	console.log(req.params['userApiKey']);
});

app.get('/getSiteContents/:categoryId/:page/:from/:max/:authorId', function(
		req, res, next) {
	var contentRepositoryInstance = new contentRepository();
	contentRepositoryInstance.getSiteContents(Parse, req.params['categoryId'],
			req.params['page'], req.params['from'], req.params['max'],
			req.params['authorId'], req, res);
});

app.get('/getSiteUsers/:categoryId/:page/:from/:max', function(req, res, next) {
	var userRepositoryInstance = new userRepository();
	userRepositoryInstance
			.getSiteUsers(Parse, req.params['categoryId'], req.params['page'],
					req.params['from'], req.params['max'], req, res);
});

app.param('userId', function(req, res, next, id) {
	res.send(id);
	next();
});

app.get('/userExist/:userId', function(req, res, next) {
	next();
});

// --------------- POST REQUESTS
app.post('/newUser', function(req, res) {
	console.log(req.body.name);
	var userRepositoryInstance = new userRepository();
	var output = userRepositoryInstance.addUser(Parse, req, res);
	console.log(output);
});

app.post('/fileUpload', function(req, res) {
//	for ( var key in req) {
//		console.log('key: ' + key + '\n' + 'value: ' + req[key]);
//	}
	var base64 = req.body.imgText;
	var file = new Parse.File("myfile.jpg", {
		base64 : base64
	});
	var FileDemo = Parse.Object.extend("files");
	var fileRepo = new FileDemo();
	fileRepo.set("file", file);
	fileRepo.save(null, {
		success : function(fileRepo) {
			res.send(fileRepo.get("file").url());
		},
		error : function(userRepo, error) {
			res.send("ERROR" + error);
		}
	});

});

app.post('/newPost', function(req, res) {
	console.log(req.body.name);
	var contentRepositoryInstance = new contentRepository();
	var output = contentRepositoryInstance.addPost(Parse, req, res);
	console.log(output);
});

app.get('/signUp', function(req, res) {
	res.send("FFFFFF");
});

// ------ SAMPLE CODES ------------ //

app.get('/test', function(req, res) {
	Parse.serverURL = parseServerLocation + parserServerPort + '/parse';
	var userRepositoryInstance = new userRepository();
	var output = userRepositoryInstance.addUser(Parse, res);
});

app.get('/param/:id/:name', function(req, res, next) {
	res.send(req.params['name']);
});

app.listen(9991, function() {
	console.log('Example app listening on port 9991!');
});
