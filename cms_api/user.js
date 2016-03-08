var number = 2;
var userRepository = function() {
	var self = this;
	self.addUser = function(Parse, res) {
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
	};
};

module.exports = userRepository;
