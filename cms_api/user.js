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
					userRepo.save(req.body, {
						success : function(userRepo) {
							res.send("User created");
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
		query.select('email', 'name');
		query.get(userApi, {
			success : function(userData) {
				res.send(userData);
			},
			error : function(object, error) {
				res.send("API ERROR");
			}
		});
	};

	self.loginUser = function(Parse, userName, password, res) {
		var User = Parse.Object.extend("users");
		console.log("Logged in user: " + userName);
		var userRepo = new User();
		var query = new Parse.Query(User);
		query.equalTo("email", userName);
		query.equalTo("password", password);
		query.find({
			success : function(results) {
				console.log(results.length);
				console.log(results);
				if (results.length > 0) {
					var userObject = results[0];
					res.send(userObject);
				} else
					res.send("failed");
			},
			error : function(error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		});
	};
};

module.exports = userRepository;
