var emailRepository = function() {
	var sendGridAPI = "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";
	var self = this;
	self.sendMail = function(from, to, subject, body, templateId,
			substitutions) {
		var sendgrid = require("sendgrid")(sendGridAPI);
		var email = new sendgrid.Email();
		email.addTo(to);
		email.setFrom(from);
		email.setSubject(subject);
		email.setHtml(body);
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
		console.log("Email Sent");
	};

};
module.exports = emailRepository;
