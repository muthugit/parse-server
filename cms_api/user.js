var number = 2;
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
					var password = req.body['password'];
					delete req.body['passwordVerify'];
					delete req.body['password'];
					userRepo.save(req.body, {
						success : function(userRepo) {
							var user = new Parse.User();
							user.set("username", req.body.email);
							user.set("password", password);
							user.set("email", req.body.email);
							user.signUp(null, {
								success : function(user) {
									res.send("User created");
									console.log("User Created");
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
				console.log("UUUUUUUUU:  " + userName);
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

		/*
		 * var User = Parse.Object.extend("users"); console.log("Logged in user: " +
		 * userName); var userRepo = new User(); var query = new
		 * Parse.Query(User); query.equalTo("email", userName);
		 * query.equalTo("password", password); query.find({ success :
		 * function(results) { console.log(results.length);
		 * console.log(results); if (results.length > 0) { var userObject =
		 * results[0]; res.send(userObject); } else res.send("failed"); }, error :
		 * function(error) { console.log("Error: " + error.code + " " +
		 * error.message); } });
		 */
	};
};

module.exports = userRepository;
