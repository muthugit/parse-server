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

				if (typeof req.body.objectId != 'undefined') {
					postRepo.set("id", req.body.objectId);
				}

				postRepo.set("userItem", userData);
				postRepo.set("status", "Pending");

				var User = Parse.Object.extend("category");
				var query = new Parse.Query(User);

				query.get(req.body.categoryItem, {
					success : function(categoryData) {
						console.log("Saving");
						postRepo.set("categoryItemData", categoryData);
						postRepo.set("categoryItem", req.body.categoryItem);
						cr.saveItem(Parse, postRepo, req, res);
					},
					error : function(categoryData, error) {
						console.log("Error but saving");
						cr.saveItem(Parse, postRepo, req, res);
					}
				});
			},
			error : function(object, error) {
				res.send("API ERROR");
			}
		});

	};

	self.saveItem = function(Parse, postRepo, req, res) {
		console.log("Item==>" + JSON.stringify(postRepo));
		if (typeof req.body.objectId != 'undefined') {
			console.log("Post detail========> " + req.body.content);
			postRepo.set("title", req.body.title);
			postRepo.set("postDetail", req.body.content);
			postRepo.set("description", req.body.description);
			postRepo.set("featureImageURL", req.body.featureImageURL);
			postRepo.save();
			res.send("Post updated: id===> " + req.body.objectId);
		} else {
			postRepo.save(req.body, {
				success : function(userRepo) {
					res.send("Post created: id===> " + userRepo.id);
				},
				error : function(userRepo, error) {
					console.log("Error==> " + JSON.stringify(error));
					console.log("EEEEE=>" + JSON.stringify(userRepo));
					res.send("ERROR");
				}
			});
		}
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

	self.getCategoryList = function(Parse, isAdminCategoryIncluded, req, res) {
		var Categories = Parse.Object.extend("category");
		var query = new Parse.Query(Categories);
		query.equalTo('isAdminOnlyCategory', isAdminCategoryIncluded);
		query.find({
			success : function(results) {
				res.send(results);
			},
			error : function(error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		});
	};

	self.getContentsInfo = function(Parse, categoryId, typeOfContent, from,
			max, authorId, showOnlyApproved, isFeatureImageRequired, req, res) {
		// typeOfContent ==> 1 -> all; 2-> featureonly
		console.log("Received page: " + typeOfContent);
		var Contents = Parse.Object.extend("content");
		var query = new Parse.Query(Contents);
		query.limit(parseInt(max));
		if (authorId != 'all')
			query.equalTo('userApi', authorId);
		if (categoryId != 'any')
			query.equalTo('categoryItem', categoryId);
		if (showOnlyApproved == true)
			query.equalTo('status', 'Approved');
		if (isFeatureImageRequired == "true") {
			query.notEqualTo('featureImageURL', "");
		}
		if (typeOfContent == "2") {
			query.equalTo('isFeatured', 'Yes');
		}
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

	self.getGenericContentsById = function(Parse, repository, objectId, req,
			res) {
		var Contents = Parse.Object.extend(repository);
		var query = new Parse.Query(Contents);
		query.get(objectId, {
			success : function(results) {
				res.send(results);
			},
			error : function(error) {
				console.log("Error: " + error);
			}
		});
	};

	self.getSingleContent = function(Parse, postId, req, res) {
		var Contents = Parse.Object.extend("content");
		var query = new Parse.Query(Contents);
		query.include("userItem");
		query.include("categoryItemData");
		query.get(postId, {
			success : function(results) {
				res.send(results);
			},
			error : function(error) {
				console.log("Error: " + error);
			}
		});
	};

	self.getContentList = function(Parse, categoryId, req, res) {
		var Contents = Parse.Object.extend("content");
		var query = new Parse.Query(Contents);
		query.equalTo('categoryItem', categoryId);
		query.include("userItem");
		query.include("categoryItemData");
		query.descending("createdAt");
		query.find({
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

	self.isFeatured = function(Parse, userApiKey, contentId, toStatus, req, res) {
		console.log("User API: " + userApiKey);
		var GameScore = Parse.Object.extend("content");
		var query = new Parse.Query(GameScore);
		query.get(contentId, {
			success : function(gameScore) {
				gameScore.set("isFeatured", toStatus);
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
		query.descending("createdAt");
		query.find({
			success : function(results) {
				console.log("Success");
				res.send(results);
			},
			error : function(error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		});
	};

	self.updateItem = function(Parse, repository, req, res) {
		var Item = Parse.Object.extend(repository);
		var itemRepo = new Item();
		itemRepo.id = req.body['objectId'];
		itemRepo.save(req.body, {
			success : function(itemResponse) {
				res.send(itemResponse);
			},
			error : function(itemResponse, error) {
				console.log("Error==> " + error);
				res.send("ERROR");
			}
		});
	};

	self.find = function(Parse, repository, item, content, req, res) {
		var Contents = Parse.Object.extend(repository);
		var query = new Parse.Query(Contents);
		query.equalTo(item, content);
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
