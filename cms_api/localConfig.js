var parseServerLocation = "http://128.199.93.125"
var localConfig = function() {
	var self = this;
	self.getServerLocation = function() {
		return parseServerLocation;
	}
};

module.exports = localConfig;
