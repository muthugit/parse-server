//========= REPOSITORIES ========== //
var userRepository = require("./user.js");
var contentRepository = require("./content.js");
var emailRepository = require("./email.js");
var themeRepository = require("./theme.js");
var localConfig = require("./localConfig.js");

var localConfigInstance = new localConfig();
var parseServerLocation = localConfigInstance.getServerLocation();

var express = require('express');
var app = express();
var parserServerPort = ":1337";
var Parse = require('parse/node');
Parse.initialize("myAppId", '', 'master');
Parse.serverURL = parseServerLocation + '/parse';

var signUpTemplateId = "a4fe974f-6240-4af8-b629-3a1e1a037076";

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

app.get('/testEmail/:from/:to/:subject', function(req, res) {
	var from = req.params['from'];
	var to = req.params['to'];
	var subject = req.params['subject'];
	var body = " - ";
	var substitutions = {
		"-name-" : [ "New Muthu Pandian 123" ],
		"-password-" : [ 'This is pwd' ]
	};
	var emailRepositoryInstance = new emailRepository();
	emailRepositoryInstance.sendMail(req, res, from, to, subject, body,
			signUpTemplateId, substitutions);
	console.log(signUpTemplateId);
});

app.get('/deleteContents', function(req, res, next) {
	var Contents = Parse.Object.extend("content");
	var query = new Parse.Query(Contents);
	query.notEqualTo("title", "Michael Yabuti");
	query.destroy({
		success : function(myObject) {
		},
		error : function(myObject, error) {
		}
	});

});

app.get('/login/:userName/:password', function(req, res, next) {
	var userRepositoryInstance = new userRepository();
	userRepositoryInstance.loginUser(Parse, req.params['userName'],
			req.params['password'], res);
});

app.get('/resetPassword/:userName', function(req, res, next) {
	console.log("UserName: ");
	var userRepositoryInstance = new userRepository();
	userRepositoryInstance.resetPassword(Parse, req.params['userName'], res);
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

app.get('/fetchSingleContent/:contentId', function(req, res, next) {
	var contentRepositoryInstance = new contentRepository();
	contentRepositoryInstance.getSingleContent(Parse, req.params['contentId'],
			req, res);
	console.log(req.params['contentId']);
});

app.get('/fetchContentList/:categoryId', function(req, res, next) {
	var contentRepositoryInstance = new contentRepository();
	contentRepositoryInstance.getContentList(Parse, req.params['categoryId'],
			req, res);
	console.log(req.params['categoryId']);
});

app.get('/getGenericContents/:repository', function(req, res, next) {
	var contentRepositoryInstance = new contentRepository();
	contentRepositoryInstance.getGenericContents(Parse,
			req.params['repository'], req, res);
});

app.get('/getGenericContentsById/:repository/:objectId', function(req, res,
		next) {
	var contentRepositoryInstance = new contentRepository();
	contentRepositoryInstance.getGenericContentsById(Parse,
			req.params['repository'], req.params['objectId'], req, res);
});

app
		.get(
				'/getSiteContents/:categoryId/:page/:from/:max/:authorId/:featureImageRequired',
				function(req, res, next) {
					var contentRepositoryInstance = new contentRepository();
					contentRepositoryInstance.getContentsInfo(Parse,
							req.params['categoryId'], req.params['page'],
							req.params['from'], req.params['max'],
							req.params['authorId'], true,
							req.params['featureImageRequired'], req, res);
				});

app.get('/getMyContents/:categoryId/:page/:from/:max/:authorId', function(req,
		res, next) {
	var contentRepositoryInstance = new contentRepository();
	contentRepositoryInstance.getContentsInfo(Parse, req.params['categoryId'],
			req.params['page'], req.params['from'], req.params['max'],
			req.params['authorId'], false, false, req, res);
});

app.get('/getCategoryContents/:categoryId', function(req, res, next) {
	var contentRepositoryInstance = new contentRepository();
	contentRepositoryInstance.getCategoryContents(Parse,
			req.params['categoryId'], req, res);
});

app.get('/getCategoryList/:isAdminCategoryIncluded', function(req, res, next) {
	var contentRepositoryInstance = new contentRepository();
	contentRepositoryInstance.getCategoryList(Parse,
			req.params['isAdminCategoryIncluded'], req, res);
});

app.get('/getSiteUsers/:categoryId/:page/:from/:max', function(req, res, next) {
	var userRepositoryInstance = new userRepository();
	userRepositoryInstance
			.getSiteUsers(Parse, req.params['categoryId'], req.params['page'],
					req.params['from'], req.params['max'], req, res);
});

app.get('/approveContent/:userApiKey/:contentId/:toStatus', function(req, res,
		next) {
	var contentRepositoryInstance = new contentRepository();
	contentRepositoryInstance.approveContent(Parse, req.params['userApiKey'],
			req.params['contentId'], req.params['toStatus'], req, res);
});

app.get('/isFeatured/:userApiKey/:contentId/:toStatus',
		function(req, res, next) {
			var contentRepositoryInstance = new contentRepository();
			contentRepositoryInstance.isFeatured(Parse,
					req.params['userApiKey'], req.params['contentId'],
					req.params['toStatus'], req, res);
		});

app.param('userId', function(req, res, next, id) {
	res.send(id);
	next();
});

app.get('/userExist/:userId', function(req, res, next) {
	next();
});

app.get('/getHtmlBlocks/:blockId', function(req, res, next) {
	var themeRepositoryInstance = new themeRepository();
	themeRepositoryInstance.getHtmlBlock(Parse, req, res);
});

// --------------- POST REQUESTS
app.post('/newUser', function(req, res) {
	var userRepositoryInstance = new userRepository();
	var output = userRepositoryInstance.addUser(Parse, req, res);
	console.log(output);
});

app.post('/confirmPassword', function(req, res) {
	var userRepositoryInstance = new userRepository();
	var output = userRepositoryInstance.confirmPassword(Parse, req, res);
});

app.post('/updateItem/:repository', function(req, res) {
	console.log("Profle pic: " + req.body.profilePic);
	var contentRepositoryInstance = new contentRepository();
	var output = contentRepositoryInstance.updateItem(Parse,
			req.params['repository'], req, res);
	console.log(output);
});

app.post('/fileUpload', function(req, res) {
	var base64 = req.body.imgText;
	console.log("Base64 =========> " + base64);
	var file = new Parse.File("myfile.jpg", {
		base64 : base64
	});
	var FileDemo = Parse.Object.extend("files");
	var fileRepo = new FileDemo();
	fileRepo.set("file", file);
	fileRepo.save(null, {
		success : function(fileRepo) {
			console.log("File upladed: " + fileRepo.get("file").url());
			res.send(fileRepo.get("file").url());
		},
		error : function(userRepo, error) {
			res.send("ERROR" + error);
		}
	});

});

app.post('/newPost', function(req, res) {
	var contentRepositoryInstance = new contentRepository();
	var output = contentRepositoryInstance.addPost(Parse, req, res);
	console.log(output);
});

app.get('/signUp', function(req, res) {
	res.send("FFFFFF");
});

app.post('/newAdminGenericContent', function(req, res) {
	var contentRepositoryInstance = new contentRepository();
	var repository = req.body.repository;
	var output = contentRepositoryInstance.addAdminFormContent(Parse, req, res,
			repository);
	console.log(output);
});

app.post('/saveHtmlBlocks', function(req, res) {
	var themeRepositoryInstance = new themeRepository();
	var output = themeRepositoryInstance.saveHtmlBlocks(Parse, req, res);
});

// ------ SAMPLE CODES ------------ //

app.get('/test', function(req, res) {
	Parse.serverURL = parseServerLocation + '/parse';
	var userRepositoryInstance = new userRepository();
	var output = userRepositoryInstance.addUser(Parse, res);
});

app.get('/param/:id/:name', function(req, res, next) {
	res.send(req.params['name']);
});

app.listen(9991, function() {
	console.log('Example app listening on port 9991!');
});
