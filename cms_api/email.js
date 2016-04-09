var emailRepository = function() {
	var sendGridAPI = "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";
	var self = this;
	self.sendMail = function(req, res, templateId, substitutions) {
		var sendgrid = require("sendgrid")(sendGridAPI);
		var email = new sendgrid.Email();
		email.addTo("mthangarajan@citrisys.com");
		email.setFrom("base.muthupandian@gmail.com");
		email.setSubject("Welcome to Tamil Creators");
		email.setHtml("--");
		email.setFilters({
			"templates" : {
				"settings" : {
					"enable" : 1,
					"template_id" : templateId
				}
			}
		});
		email.setSubstitutions(substitutions);
		sendgrid.send(email);
		res.send("Email Sent");
	};

};
module.exports = emailRepository;
