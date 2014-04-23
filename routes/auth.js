var CorsaHelper = require('../lib/Corsa/helper');
var UserModel = require('../models/user');

exports.login = function (req, res)
{
	if (req.cookieData != undefined && req.cookieData.userId != undefined) {
		res.redirect('/user');
	}

	res.render('auth/login');
};

exports.login_post = function (req, res)
{
	var username = req.postData.username;
	var password = req.postData.password;
	var hash = CorsaHelper.hashPassword(password);

	var q = {'username': username, password: hash};

	UserModel.where(q).all(GLOBAL.connection, function (err, user)
	{
		if (user.first() != undefined) {
			var cookieData = {
				username: user.first().username,
				userId: user.first().id
			};
			CorsaHelper.saveCookie(res, cookieData);
			res.redirect('/user');
			return;
		}
	});

	res.render('auth/login', { msg: "Unable to login, please try again" });
};


exports.signup = function (req, res)
{
	var data = {};

	if (req.cookieData != undefined && req.cookieData.userId != undefined) {
		res.redirect('/user');
		return;
	}

	if (req.method.toLowerCase() == 'post') {

		console.log(req.postData);
		if (req.postData.password != req.postData.password2) {
			data = req.postData;
			data['error'] = "Error: Passwords do not match.";
			res.render('auth/signup', data);
			return;
		}

		var q = {'username': req.postData.username};

		UserModel.where(q).all(GLOBAL.connection, function (err, user)
		{
			if (user.first() != undefined) {
				data = req.postData;
				data['error'] = "Error: Username already exists.";
				res.render('auth/signup', data);
				return;
			} else {

				var postData = req.body;
				delete postData['password2'];
				postData['password'] = CorsaHelper.hashPassword(postData['password']);

				var userModel = new UserModel(postData);

				userModel.save(GLOBAL.connection, function ()
				{
					var cData = {
						userId: userModel.getId(),
						username: req.postData['username']
					};

					CorsaHelper.saveCookie(res, cData);
					res.redirect('/user');
					return;
				});
			}
		});
	} else {
		res.render('auth/signup', data);
		return;
	}
};


exports.signup_post = function (req, res)
{
	if (req.postData['userPwd1'] != req.postData['userPwd2']) {
		res.send(400, "Passwords do not match");
		return;
	}

	var hash = passwordHelper.hashPassword(req.postData['userPwd1']);

	var q = { where: ["username = '" + req.postData['userName'] + "'"]};
	models.User.find(q).on(
		'success', function (resource, created)
		{
			if (resource != null) {
				res.send(400, "User exists, please login");
				return;
			}

			var t = models.User.build({
				username: req.postData['userName'],
				password: hash
			});

			t.save().success(function (anotherTask)
			{
				var q = { where: ["username = '" + req.postData['userName'] + "'"]};
				models.User.find(q).on('success', function (user)
				{
					res.redirect("/user/" + user.id + "/app/");

				});

			}).error(function (error)
				{
					console.log(error);
					res.send(500, "Unable to save");
				});
		}
		, 'error', function (e)
		{
			res.send(400, "Not Unique");
			return;
		}
	);

};
