var number = 2;
var contentRepository = function() {
	var self = this;
	self.addPost = function(Parse, req, res) {
		var User = Parse.Object.extend("users");
		var query = new Parse.Query(User);
		query.get(req.body.userApi, {
			success : function(userData) {
				var Post = Parse.Object.extend("content");
				var postRepo = new Post();
				postRepo.set("userItem", userData);
				postRepo.set("status", "Pending");
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
		var Posts = Parse.Object.extend("content");
		var query = new Parse.Query(Posts);
		query.equalTo("userApi", userApiKey);
		query.find({
			success : function(results) {
				console.log("Posts found");
				console.log("Total posts: " + results.length);
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

	self.getUsers = function(Parse, userApiKey, req, res) {
		var Users = Parse.Object.extend("users");
		var query = new Parse.Query(Users);
		query.find({
			success : function(results) {
				console.log("Posts found");
				console.log("Total posts: " + results.length);
				res.send(results);
				for (var i = 0; i < results.length; i++) {
					var object = results[i];
					console.log(object.id + ' - ' + object.get('name'));
				}
			},
			error : function(error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		});
	};

	self.getSiteContents = function(Parse, categoryId, page, from, max,
			authorId, req, res) {
		console.log("Received page: " + page);
		var Contents = Parse.Object.extend("content");
		var query = new Parse.Query(Contents);
		query.limit(parseInt(max));
		if (authorId != 'all')
			query.equalTo('userApi', authorId);
		if (categoryId != 'any')
			query.equalTo('categoryId', categoryId);
		query.skip(parseInt(from) - 1);
		query.descending("createdAt");
		query.include('userItem');
		query.find({
			success : function(results) {
				res.send(results);
			},
			error : function(error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		});
	}

	self.getContents = function(Parse, userApiKey, req, res) {
		var Contents = Parse.Object.extend("content");
		var query = new Parse.Query(Contents);
		query.include("users");
		query.find({
			success : function(results) {
				res.send(results);
			},
			error : function(error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		});
	};

};

module.exports = contentRepository;