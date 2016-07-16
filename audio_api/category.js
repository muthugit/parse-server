var categoryRepository = function() {
	var self = this;
	self.updateCategory = function(Parse, object, req, res) {
		var Category = Parse.Object.extend("audioCategory");
		var categoryObj = new Category();
		var categoryQuery = new Parse.Query(Category);
		console.log("Category id in soundcloud: " + object["id"]);
		console.log("Category id in soundcloud: " + object["permalink"]);
		categoryQuery.equalTo("categoryId", object["id"]);
		categoryQuery.find({
			success : function(categoryResponse) {
				if (categoryResponse.length > 0) {
					categoryObj = categoryResponse[0];
					console.log("Need updation");
				}
				self.saveCategory(categoryObj, object);
			}
		});
	};

	self.saveCategory = function(categoryObj, object) {
		console.log("Updating: " + object['id']);
		categoryObj.set("permalink", object['permalink']);
		categoryObj.set("title", object['title']);
		categoryObj.set("categoryId", object["id"]);
		categoryObj.save(null,
				{
					success : function(categorySaveObject) {
						console.log("Content created: id===> "
								+ categorySaveObject.id);
					},
					error : function(userRepo, error) {
						console.log("ERROR");
					}
				});
	};
};
module.exports = categoryRepository;