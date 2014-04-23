var UserModel = require('../models/user');
var ApplicationModel = require('../models/application');
var ResourceModel = require('../models/resource');


exports.post = function (req, res)
{
	var q = {'short_name': req.body['short_name']};

	ApplicationModel.where(q).all(GLOBAL.connection, function (err, application)
	{
		if (err) {
			res.send(400, {});
		}
		else if (application.first() != undefined) {
			res.send(400, "Application Short Name Already Exists");
		} else {

			var data = req.body;
			data['user_id'] = req.cookieData.userId;

			var appModel = new ApplicationModel(data);

			appModel.save(GLOBAL.connection, function ()
			{
				data['id'] = appModel.getId();
				res.send(200, data)
			});
		}
	});

};

exports.index = function (req, res)
{
	ApplicationModel.where({'user_id': req.cookieData.userId}).orderBy('short_name').all(GLOBAL.connection, function (err, application)
	{
		if (err || application.first() == undefined) {
			res.send(404, {});
			return;
		} else {
			var out = [];
			for (var a in application) {
				if (application[a].id == undefined) {
					continue;
				}
				application[a]['base_url'] = "/" + req.cookieData.username + "/" + application[a]['short_name'];
				out.push(application[a]);
			}
			res.send(out);
		}
	});
};


exports.view = function (req, res)
{
	var q = {'user_id': req.cookieData.userId, id: req.params.appId};
	ApplicationModel.where(q)
		.all(GLOBAL.connection, function (err, application)
		{
			if (err || application.first() == undefined) {
				res.send(404, "oh oh");
				return;
			} else {
				var out = application.first();
				out['base_url'] = "/" + req.cookieData.username + "/" + out['short_name'];
				res.send(out);
			}
		});
};


exports.update = function (req, res)
{
	var data = req.body;
	var id = req.params.appId;
	delete data['base_url'];

	ApplicationModel.update(GLOBAL.connection, id, data, function ()
	{
		data['id'] = req.params.appId;
		res.send(200, data)
	});
};


exports.delete = function (req, res)
{
	var id = req.params.appId;

	var rModel = new ResourceModel({application_id: id});

	rModel.delete(GLOBAL.connection, function ()
	{
		var aModel = new ApplicationModel({id: id});
		aModel.delete(GLOBAL.connection, function ()
		{
			res.send(204);
		});
	});
};

