var ResourceModel = require('../models/resource');
var CorsaHelper = require('../lib/Corsa/helper.js');

exports.index = function (req, res)
{
	request = require('../lib/Corsa/request.js')(req);
	response = require('../lib/Corsa/response.js')(res);

	var appId = req.appSettings.appId;
	var urlPath = CorsaHelper.addPreSlash(req.params[0]);

	ResourceModel.where({'application_id': appId}).all(GLOBAL.connection, function (err, resources)
	{
		if (err || resources.first() == undefined) {
			if (req.appSettings.appName == undefined) {
				req.appSettings.appName = "n/a";
			}
			var output = {
				errorNum: 4001,
				errorMsg: "Unable to find application or resources: " + req.appSettings.appName,
				requestedUrl: req.originalUrl,
				recommendedUrl: "/signUp"
			};
			res.send(404, output);
		} else {

			var paths = {};
			var appResources = {};

			for (var r in resources) {
				var current = resources[r];
				if (current.id == undefined) {
					continue;
				}
				appResources[current.id] = current;
				paths[current.id] = current.path;
			}

			var pathInfo = CorsaHelper.findPath(urlPath, paths);

			if (pathInfo.key == null) {
				var output = {
					errorNum: 4010,
					errorMsg: "Unable to find resources for app: " + req.appSettings.appName,
					requestedUrl: req.originalUrl,
					recommendedUrl: "/signUp"
				};

				return res.send(404, output);
			}

			var resourceSettings = appResources[pathInfo.key];

			if (resourceSettings.type == 'simple') {
				return CorsaHelper.runSimpleApp(res, resourceSettings);
			} else {
				return CorsaHelper.runJSApp(res, req, resourceSettings, req.appSettings);
			}
		}
	});
};
