var themeRepository = function() {
	var self = this;
	self.saveHtmlBlocks = function(Parse, req, res) {
		console.log("Theme Repository: " + req.body.htmlContent);
		var HtmlBlocks = Parse.Object.extend("htmlBlocks");
		var query = new Parse.Query(HtmlBlocks);
		console.log("Checking block id: " + req.body.blockId);
		query.equalTo('blockId', req.body.blockId);
		query.find({
			success : function(htmlBlockObject) {
				var object = htmlBlockObject[0];
				if (htmlBlockObject.length == 0) {
					console.log("HTML Content not exist");
					self.createHtmlBlocks(Parse, req, res);
				} else {
					console.log("Started editing object: "
							+ htmlBlockObject.length);
					self.updateHtmlBlocks(Parse, req, res, object);
				}
				res.send(htmlBlockObject);
			},
			error : function(error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		});
	};

	self.createHtmlBlocks = function(Parse, req, res) {
		var HtmlBlocks = Parse.Object.extend("htmlBlocks");
		var htmlBlocksRepo = new HtmlBlocks();
		htmlBlocksRepo.save(req.body, {
			success : function(htmlBlocksObject) {
				console.log("HTML Block created successfully");
				console.log(htmlBlocksObject.id);
			},
			error : function(userRepo, error) {
				console.log("ERROR");
			}
		});
		console.log("Creating new HTML Blocks");
	};

	self.updateHtmlBlocks = function(Parse, req, res, htmlBlockObject) {
		console.log("Getting ready to update: " + htmlBlockObject.id);
		var Item = Parse.Object.extend("htmlBlocks");
		var itemRepo = new Item();
		itemRepo.id = htmlBlockObject.id;
		itemRepo.save(req.body, {
			success : function(itemResponse) {
				console.log("Updated==============");
				res.send(itemResponse);
			},
			error : function(itemResponse, error) {
				console.log("Error==> " + error);
				res.send("ERROR");
			}
		});
	};

	self.getHtmlBlock = function(Parse, req, res) {
		blockId = req.params['blockId'];
		var HtmlBlocks = Parse.Object.extend("htmlBlocks");
		var query = new Parse.Query(HtmlBlocks);
		console.log("Checking block id: " + blockId);
		query.equalTo('blockId', blockId);
		query.find({
			success : function(htmlBlockObject) {
				console.log("Success");
				res.send(htmlBlockObject);
			},
			error : function(error) {
				console.log("Error: " + error.code + " " + error.message);
			}
		});

	}

};

module.exports = themeRepository;
