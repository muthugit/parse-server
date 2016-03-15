var express = require('express');
var app = express();
var parseServerLocation = "http://localhost";
var parserServerPort = ":1337";
var Parse = require('parse/node');
Parse.initialize("myAppId");
Parse.serverURL = parseServerLocation + parserServerPort + '/parse';

// USING CORS -- NEED TO INSTALL
var cors = require('cors');
app.use(cors());

// BODY PARSER
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended : true
}));
app.use(bodyParser.json()); // for parsing application/json

// ========= REPOSITORIES ========== //
var userRepository = require("./user.js");

// --------------- GET REQUESTS
app.get('/', function(req, res) {
	res.send("API is running");
});

app.get('/login/:userName/:password', function(req, res, next) {
	var userRepositoryInstance = new userRepository();
	userRepositoryInstance.loginUser(Parse, req.params['userName'],req.params['password'], res);
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
// // -------- PORT SELECTION ---------- //
// app.use(function(req, res, next) {
// res.header("Access-Control-Allow-Origin", "*");
// res.header('Access-Control-Allow-Methods', 'GET,PUT,post,POST,DELETE');
// res.header('Access-Control-Allow-Headers',
// 'Content-Type, Authorization, Content-Length, X-Requested-With');
// next();
// });
//
// var allowCrossDomain = function(req, res, next) {
// res.header('Access-Control-Allow-Origin', '*');
// res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
// res.header('Access-Control-Allow-Headers', 'Content-Type');
//
// next();
// }
//
// app.use(allowCrossDomain);

// app
// .use(function(req, res, next) {
// if (req.headers.origin) {
// res.header('Access-Control-Allow-Origin', '*');
// res.header('Access-Control-Allow-Headers',
// 'X-Requested-With,Content-Type,Authorization');
// res.header('Access-Control-Allow-Methods',
// 'GET,PUT,PATCH,POST,DELETE');
// if (req.method === 'OPTIONS')
// return res.send(200);
// }
// next();
// });

app.listen(9991, function() {
	console.log('Example app listening on port 9991!');
});
