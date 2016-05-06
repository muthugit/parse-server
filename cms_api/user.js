var number = 2;
var signUpTemplateId = "a4fe974f-6240-4af8-b629-3a1e1a037076";
var resetPasswordTemplateId = "";
var emailRepository = require("./email.js");
var localConfig = require("./localConfig.js");
var localConfigInstance = new localConfig();

var resetPasswordUrlPrefix = localConfigInstance.getResetPasswordUrlPrefix();
var adminUrl = localConfigInstance.getAdminUrl();

var userRepository = function() {
	var self = this;
	self.addUser = function(Parse, req, res) {
		var User = Parse.Object.extend("users");
		var userRepo = new User();
		var query = new Parse.Query(User);
		query.equalTo("email", req.body.email);
		query.find({
			success : function(results) {
				console.log("Successfully retrieved " + results.length
						+ " scores.");
				if (results.length > 0) {
					res.send("User exists");
				} else {
					userRepo.save(req.body, {
						success : function(userRepo) {
							var password = userRepo.id;
							var user = new Parse.User();
							user.set("username", req.body.email);
							user.set("password", password);
							user.set("email", req.body.email);
							user.signUp(null, {
								success : function(user) {
									// self.newUserEmailNotification(req, res,
									// password);
									resetPasswordUrl = resetPasswordUrlPrefix
											+ user.id;
									self.resetPasswordNotification(req.body.email,
											resetPasswordUrl,
											"Its time to set the password");
									res.send("User created");
								},
								error : function(user, error) {
									res.send("ERROR");
								}
							});

						},
						error : function(userRepo, error) {
							res.send("ERROR");
						}
					});
				}
			},
			error : function(error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		});
	};

	self.newUserEmailNotification = function(req, res, password) {
		var from = "no-reply@padaippaligalulagam.com";
		var to = req.body.email;
		var subject = "Registration Successful";
		var body = " - ";
		var substitutions = {
			"-name-" : [ req.body.email ],
			"-password-" : [ password ]
		};
		var emailRepositoryInstance = new emailRepository();
		emailRepositoryInstance.sendMail(from, to, subject, body,
				signUpTemplateId, substitutions);
		console.log(signUpTemplateId);

		console.log("Email sent");
	};

	self.resetPasswordNotification = function(email, resetPasswordUrl, subject) {
		console.log("Email is: " + email);
		resetPasswordUrl = "Reset here: " + resetPasswordUrl;
		var from = "no-reply@padaippaligalulagam.com";
		var to = email;
		var body = " - ";
		var substitutions = {
			"-name-" : [ email ],
			"-password-" : [ resetPasswordUrl ]
		};
		var emailRepositoryInstance = new emailRepository();
		emailRepositoryInstance.sendMail(from, to, subject, body,
				signUpTemplateId, substitutions);
		console.log("Email sent");
	};

	self.getUserInfo = function(Parse, userApi, req, res) {
		var User = Parse.Object.extend("users");
		var query = new Parse.Query(User);
		query.get(userApi, {
			success : function(userData) {
				res.send(userData);
			},
			error : function(object, error) {
				res.send("API ERROR");
			}
		});
	};

	self.getSiteUsers = function(Parse, categoryId, page, from, max, req, res) {
		console.log("Received page: " + page);
		var Users = Parse.Object.extend("users");
		var query = new Parse.Query(Users);
		query.limit(parseInt(max));
		if (categoryId != 'any')
			query.equalTo('categoryId', categoryId);
		query.skip(parseInt(from) - 1);
		query.descending("createdAt");
		query.find({
			success : function(results) {
				res.send(results);
			},
			error : function(error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		});
	}

	self.loginUser = function(Parse, userName, password, res) {
		Parse.User.logIn(userName, password, {
			success : function(user) {
				var UserRepo = Parse.Object.extend("users");
				var query = new Parse.Query(UserRepo);
				query.equalTo("email", userName);
				query.find({
					success : function(userData) {
						console.log("User Found: " + userData[0]);
						res.send(userData[0]);
					},
					error : function(userData, error) {
						console.log("User logged in failed");
						res.send("failed");
					}
				});

				// res.send(user.id);
			},
			error : function(user, error) {
				console.log("User logged in failed");
				res.send("failed");
			}
		});
	};

	self.resetPassword = function(Parse, userName, res) {
		console.log("Started reset");
		var query = new Parse.Query(Parse.User);
		query.equalTo("email", userName); // find all the women
		query.find({
			success : function(result) {
				if (result.length > 0) {
					var object = result[0];
					resetPasswordUrl = resetPasswordUrlPrefix + object.id;
					console.log("Reset pwd: " + resetPasswordUrl + " == "
							+ object.id);
					self.resetPasswordNotification(userName, resetPasswordUrl,
							"Reset your password");
					res.send("100");
				} else
					res.send("404");
			}
		});
	};

	self.confirmPassword = function(Parse, req, res) {
		newPassword = req.body.password;
		var User = new Parse.User();
		var query = new Parse.Query(User);
		query.get(req.body.objectId, {
			success : function(user) {
				Parse.Cloud.useMasterKey();
				user.setPassword(newPassword);
				user.save(null, {
					useMasterKey : true
				}).then(
						res.send("Finished. <br><a href='" + adminUrl
								+ "'>Login here</a>"));
			},
			error : function(user, error) {
				console.log("User logged in failed: " + error.message);
				res.send("failed");
			}
		});
	};
};

module.exports = userRepository;
