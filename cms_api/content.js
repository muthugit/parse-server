var number = 2;
var contentRepository = function() {
	var self = this;
	self.addPost = function(Parse, req, res) {
		res.send(req.body.title);
	};

};

module.exports = userRepository;
