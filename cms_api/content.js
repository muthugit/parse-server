var number = 2;
var contentRepository = function() {
	var self = this;
	self.addPost = function(Parse, req, res) {
		var cr = new contentRepository();
		var User = Parse.Object.extend("users");
		var query = new Parse.Query(User);
		query.get(req.body.userApi, {
			success : function(userData) {

				var Post = Parse.Object.extend("content");
				var postRepo = new Post();

				postRepo.set("userItem", userData);
				postRepo.set("status", "Pending");

				var User = Parse.Object.extend("category");
				var query = new Parse.Query(User);
				query.get(req.body.categoryItem, {
					success : function(categoryData) {
						postRepo.set("categoryItemData", categoryData);
						cr.saveItem(postRepo, req, res);
					},
					error : function(categoryData, error) {
						cr.saveItem(postRepo, req, res);
					}
				});
			},
			error : function(object, error) {
				res.send("API ERROR");
			}
		});

	};

	self.saveItem = function(postRepo, req, res) {
		postRepo.save(req.body, {
			success : function(userRepo) {
				res.send("Post created: id===> " + userRepo.id);
			},
			error : function(userRepo, error) {
				console.log("Error==> " + error);
				res.send("ERROR");
			}
		});
	};

	self.addAdminFormContent = function(Parse, req, res, repository) {
		var User = Parse.Object.extend("users");
		var query = new Parse.Query(User);
		query.get(req.body.userApi, {
			success : function(userData) {
				var Repository = Parse.Object.extend(repository);
				var repo = new Repository();
				repo.save(req.body, {
					success : function(output) {
						res.send("Content created: id===> " + output.id);
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

	self.getCategoryContents = function(Parse, categoryId, req, res) {
		var Contents = Parse.Object.extend("content");
		var query = new Parse.Query(Contents);
		if (categoryId != 'any')
			query.equalTo('categoryId', categoryId);
		query.descending("createdAt");
		query.include('userItem');
		query.include('categoryItemData');
		query.find({
			success : function(results) {
				res.send(results);
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
		query.equalTo('status', 'Approved');
		query.skip(parseInt(from) - 1);
		query.descending("createdAt");
		query.include('userItem');
		query.include('categoryItemData');
		query.find({
			success : function(results) {
				res.send(results);
			},
			error : function(error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		});
	};

	self.getGenericContents = function(Parse, repository, req, res) {
		var Contents = Parse.Object.extend(repository);
		var query = new Parse.Query(Contents);
		query.find({
			success : function(results) {
				res.send(results);
			},
			error : function(error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		});
	};

	self.getSingleContent = function(Parse, postId, req, res) {

		console.log(postId);

		var Contents = Parse.Object.extend("content");
		var query = new Parse.Query(Contents);
		query.include("userItem");
		query.include("categoryItemData");
		query.get(postId, {
			success : function(results) {
				res.send(results);
			},
			error : function(error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		});
	};

	self.approveContent = function(Parse, userApiKey, contentId, toStatus, req,
			res) {
		console.log("User API: " + userApiKey);
		var GameScore = Parse.Object.extend("content");
		var query = new Parse.Query(GameScore);
		query.get(contentId, {
			success : function(gameScore) {
				gameScore.set("status", toStatus);
				gameScore.save();
				res.send(toStatus);
			},
			error : function(object, error) {
				res.send("ERROR");
			}
		});
	};

	self.getContents = function(Parse, userApiKey, req, res) {
		var Contents = Parse.Object.extend("content");
		var query = new Parse.Query(Contents);
		query.include("userItem");
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
