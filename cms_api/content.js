var number = 2;
var contentRepository = function() {
	var self = this;
	self.addPost = function(Parse, req, res) {
		var User = Parse.Object.extend("users");
		var query = new Parse.Query(User);
		query.get(req.body.userApi, {
			success : function(gameScore) {
				console.log("User Found");
				var Post = Parse.Object.extend("post");
				var postRepo = new Post();
				postRepo.save(req.body, {
					success : function(userRepo) {
						res.send("Post created: id===> " + userRepo.id);
					},
					error : function(userRepo, error) {
						res.send("ERROR");
					}
				});
			},
			error : function(object, error) {
				res.send("API ERROR");
			}
		});

	};

	self.getMultiplePost = function(Parse, userApiKey, req, res) {
		var Posts = Parse.Object.extend("post");
		var query = new Parse.Query(Posts);
		query.equalTo("userApi", userApiKey);
		query.find({
			success : function(results) {
				console.log("Posts found");
				console.log("Total posts: "+results.length);
				res.send(results);
				for (var i = 0; i < results.length; i++) {
					var object = results[i];
					console.log(object.id + ' - ' + object.get('title'));
				}
			},
			error : function(error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		});
	};

};

module.exports = contentRepository;
