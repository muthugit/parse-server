var number = 2;
var userRepository = function() {
	var self = this;

	self.addUser = function(Parse, req, res) {
		var GameScore = Parse.Object.extend("users");
		var gameScore = new GameScore();
		var query = new Parse.Query(GameScore);
		query.equalTo("email", req.body.email);
		query.find({
			success : function(results) {
				console.log("Successfully retrieved " + results.length
						+ " scores.");
				if (results.length > 0) {
					res.send("User exists");
				} else {
					gameScore.save(req.body, {
						success : function(gameScore) {
							res.send("User created");
						},
						error : function(gameScore, error) {
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
};

module.exports = userRepository;
