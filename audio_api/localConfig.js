var parseServerLocation = "http://192.157.251.27:1337";
var localConfig = function() {
	var self = this;
	self.getServerLocation = function() {
		return parseServerLocation;
	};
};

module.exports = localConfig;
