var ResourceModel = require('../models/resource');
var CorsaHelper = require('../lib/Corsa/helper');


exports.post = function (req, res)
{
	var validInput = CorsaHelper.validateBody(req.body);

	var appId = req.params.appId;
	var q = {application_id: req.params.appId, path: req.body.path};

	ResourceModel.where(q).all(GLOBAL.connection, function (err, application)
	{
		if (err) {
			res.send(400, {});
		}
		else if (application.first() != undefined) {
			res.send(400, "Path for App Already Exists");
			return;
		} else {
			var data = req.body;
			data['user_id'] = req.cookieData.userId;
			data['application_id'] = appId;

			var resModel = new ResourceModel(data);

			resModel.save(GLOBAL.connection, function ()
			{
				data['id'] = resModel.getId();
				data['valid'] = validInput.status;
				data['validMsg'] = validInput.msg;

				res.send(200, data)
			});
		}
	});
};

exports.index = function (req, res)
{
	var q = {'user_id': req.cookieData.userId, application_id: req.params.appId};

	ResourceModel.where(q).orderBy('path')
		.all(GLOBAL.connection, function (err, resources)
		{
			if (err || resources.first() == undefined) {
				res.send(404, "oh oh");
				return;
			} else {
				var out = [];
				for (var r in resources) {
					if (resources[r].id == undefined) {
						continue;
					}
					out.push(resources[r]);
				}
				res.send(out);
			}
		});
};

exports.update = function (req, res)
{
	var data = req.body;
	var validInput = CorsaHelper.validateBody(req.body, req, res);

	data['application_id'] = req.params.appId;
	data['user_id'] = req.cookieData.userId;
	var id = req.params.rsrcId;

	ResourceModel.update(GLOBAL.connection, id, data, function ()
	{
		data['id'] = req.params.appId;
		data['valid'] = validInput.status;
		data['validMsg'] = validInput.msg;

		res.send(200, data)
	});

};


exports.delete = function (req, res)
{
	var id = req.params.rsrcId;
	var rModel = new ResourceModel({id: id});
	rModel.delete(GLOBAL.connection, function ()
	{
		res.send(204);
	});
};


exports.view = function (req, res)
{
	var q = {'user_id': req.cookieData.userId, application_id: req.params.appId, id: req.params.rsrcId};

	ResourceModel.where(q)
		.all(GLOBAL.connection, function (err, resource)
		{
			if (err || resource.first() == undefined) {
				res.send(404, "oh oh");
				return;
			} else {
				var out = resource.first();
				res.send(out);
			}
		});
};

