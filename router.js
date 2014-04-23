var fs = require('fs');

var CorsaHelper = require('./lib/Corsa/helper.js');

var routes = require('./routes')
	, user = require('./routes/user')
	, application = require('./routes/application')
	, index = require('./routes/index')
	, docs = require('./routes/docs')
	, auth = require('./routes/auth')
	, resource = require('./routes/resource')
	, launch = require('./routes/launch');

var UserModel = require('./models/user');
ApplicationModel = require('./models/application');

module.exports = function (app)
{
	app.all('*', function (req, res, next)
	{
		if (req.cookies[GLOBAL.cookieName] != undefined) {
			req.cookieData = CorsaHelper.readCookie(req);

			if (req.cookieData.userId != undefined) {
				req.loggedin = app.locals.loggedin = 1;
			}
		}
		next();
	});

	app.get('/', routes.index);
	app.get('/docs', docs.index);

	// check auth for all user settings urls
	app.all('/user*', function (req, res, next)
	{
		if (req.cookieData == undefined || req.cookieData.userId == undefined) {
			res.redirect('/login');
		}
		next();
	});

	app.get('/login', auth.login);
	app.post('/login', auth.login_post);

	app.get('/logout', function (req, res, next)
	{
		res.clearCookie(GLOBAL.cookieName);
		res.redirect('/login');
	});

	app.get('/user', user.index);

	app.get('/user/app', application.index);  // list apps
	app.post('/user/app', application.post); // create app
	app.get('/user/app/:appId', application.view);  // view app
	app.put('/user/app/:appId', application.update);  // update app
	app.delete('/user/app/:appId', application.delete);  // delete app

	app.get('/user/app/:appId/rsrc', resource.index); // list resources
	app.post('/user/app/:appId/rsrc', resource.post); // create resource
	app.put('/user/app/:appId/rsrc/:rsrcId', resource.update); // create resource
	app.get('/user/app/:appId/rsrc/:rsrcId', resource.view); // create resource

	app.delete('/user/app/:appId/rsrc/:rsrcId', resource.delete); // delete resource


	app.get('/signup', auth.signup);
	app.post('/signup', auth.signup);


	app.all('/:user/:appName/*', launch.index);
	app.all('/:user/:appName', launch.index);
	app.all('/:user*', launch.index);

	app.param('user', function (req, res, next, val)
	{
		if (!req.appSettings) {
			req.appSettings = {};
		}

		var cacheKey = "userSet_" + val;
		var cache = CorsaHelper.cacheGet(cacheKey);
		if (cache) {
			req.appSettings = cache;
			next();
			return;
		}

		var q = {'username': val};
		UserModel.where().all(GLOBAL.connection, function (err, user)
		{
			if (err || user.first() == undefined) {
				var output = {
					errorNum: 4001,
					errorMsg: "Unable to find user: " + val,
					requestedUrl: req.originalUrl,
					recommendedUrl: "/signUp"
				};
				res.send(404, output);
				return;
			} else {
				req.appSettings.username = user.first().username;
				req.appSettings.userId = user.first().id;
				CorsaHelper.cachePut(cacheKey, req.appSettings);
			}
			next();
		});
	});

	app.param('appName', function (req, res, next, val)
	{
		var cacheKey = "userSet_" + val;
		var cache = CorsaHelper.cacheGet(cacheKey);
		if (cache) {
			req.appSettings = cache;
			next();
			return;
		}

		ApplicationModel.where({'short_name': val}).all(GLOBAL.connection, function (err, application)
		{
			if (err || application.first() == undefined) {
				var output = {
					errorNum: 4004,
					errorMsg: "Unable to find application: " + val,
					requestedUrl: req.originalUrl,
					recommendedUrl: "/user/app/create"
				};
				res.send(404, output);
				return;
			} else {

				if (application.first().active < 1) {
					var output = {
						errorNum: 4005,
						errorMsg: "Application " + val + " is not active.",
						requestedUrl: req.originalUrl,
						recommendedUrl: "/user/#/"
					};
					res.send(410, output);
					return;
				}

				req.appSettings.appName = application.first().short_name;
				req.appSettings.appId = application.first().id;
				CorsaHelper.cachePut(cacheKey, req.appSettings);
			}
			next();
		});
	});

};