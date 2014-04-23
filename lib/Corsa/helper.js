var Cache = require('memory-cache');
var crypto = require('crypto');
var et = require('elementtree');
var vm = require('vm');

(function ()
{
	var CorsaHelper = {};

	/**
	 * Find Path
	 * @param currentUrl
	 * @param findIn
	 * @returns {*}
	 */
	CorsaHelper.findPath = function (currentUrl, findIn)
	{
		var resource = null;
		var resourceKey = null;

		if (currentUrl == undefined || currentUrl == "") {
			currentUrl = '/';
		}

		currentUrl = this.removeTrailingSlash(currentUrl).toLowerCase();

		for (var i in findIn) {

			if (currentUrl == findIn[i].toLowerCase()) {
				resource = findIn[i];
				resourceKey = i;
			}

			var re = findIn[i].toLowerCase() + "/(.*)";
			var p1_matches = currentUrl.match(re);

			if (p1_matches != null) {
				resource = findIn[i];
				resourceKey = i;
			}
		}

		return {path: resource, key: resourceKey};
	};

	/**
	 * Put value in cache
	 * Will auto convert JSON to string before saving
	 *
	 * @param key
	 * @param val
	 * @returns {*}
	 */
	CorsaHelper.cachePut = function (key, val)
	{
		if (key == undefined || val == undefined) {
			return false;
		}
		if (typeof val === 'object') {
			val = JSON.stringify(val);
		}

		return Cache.put(key, val);
	};


	/**
	 * Get Cached value
	 * Will auto try to parse JSON
	 *
	 * @param key
	 * @returns {*}
	 */
	CorsaHelper.cacheGet = function (key)
	{
		if (key == undefined) {
			return false;
		}
		var val = Cache.get(key);

		if (val == null) {
			//	console.log("Missed cache %s", key);
			return null;
		}

		var parsed = JSON.parse(val);

		if (typeof parsed == 'object') {
			return parsed;
		}

		return val;
	};


	/**
	 * Remove trailing slash of URLs to better match resource paths
	 *
	 * @param url
	 * @returns {*}
	 */
	CorsaHelper.removeTrailingSlash = function (url)
	{
		if (url.slice(-1) == '/') {
			url = url.substring(0, url.length - 1);
		}
		return url;
	};

	/**
	 * Add preSLash for urls to fix Express stripping
	 *
	 * @param url
	 * @returns {*}
	 */
	CorsaHelper.addPreSlash = function (url)
	{
		if (url == undefined) {
			return '/';
		}
		if (url.substring(0, 1) != '/') {
			url = '/' + url;
		}
		return url;
	};


	/**
	 * Encrypt Cookie String using hash
	 *
	 * @param str
	 * @returns {*}
	 */
	CorsaHelper.encryptCookieString = function (str)
	{
		var cipher = crypto.createCipher("aes192", GLOBAL.cookieHash);
		return cipher.update(str, "binary", "hex") + cipher.final("hex");
	};

	/**
	 * Decrypt Cookie String
	 *
	 * @param str
	 * @returns {*}
	 */
	CorsaHelper.decryptCookieString = function (str)
	{
		var decipher = crypto.createDecipher("aes192", GLOBAL.cookieHash);
		return decipher.update(str, "hex", "binary") + decipher.final("binary");
	};


	/**
	 * Hash Password of user
	 * Yes, it's weak, but it works and isn't public
	 * @todo make with salt
	 *
	 * @param plainText
	 * @returns {*}
	 */
	CorsaHelper.hashPassword = function (plainText)
	{
		return crypto.createHmac('sha1', GLOBAL.hash).update(plainText).digest('hex');
	};

	/**
	 * Encrypt and save cookie
	 *
	 * @param res
	 * @param data
	 * @param age
	 */
	CorsaHelper.saveCookie = function (res, data, age)
	{
		if (age == undefined) {
			age = 84000;
		}
		var cookieData = this.encryptCookieString(JSON.stringify(data));
		res.cookie(GLOBAL.cookieName, cookieData, {expires: new Date(Date.now() + age * 1000)});
	};

	/**
	 * Read cookie and decrypt
	 *
	 * @param req
	 * @returns {*}
	 */
	CorsaHelper.readCookie = function (req)
	{
		try {
			var c = req.cookies[GLOBAL.cookieName];
			return JSON.parse(this.decryptCookieString(c));
		} catch (err) {
			return null
		}
	};

	/**
	 * Run Simple App
	 *
	 * @param res
	 * @param resourceSettings
	 */
	CorsaHelper.runSimpleApp = function (res, resourceSettings)
	{
		if (resourceSettings.headers != "") {
			response.setHeader('Content-Type', resourceSettings.content_type);
		}

		response.statusCode = resourceSettings['http_code'];
		response.body = resourceSettings['body'];
		this.applyResponse(res);
	};


	/**
	 * Apply user settings
	 *
	 * @param res
	 */
	CorsaHelper.applyResponse = function (res)
	{
		if (response.headers) {
			res.set(response.headers);
		}

		if (response.redirectUrl != null) {
			if (response.pause != null && response.pause > 0) {
				setTimeout(function ()
				{
					res.redirect(response.redirectUrl, response.redirectCode);
					return;
				}, (response.pause * 1000));
			} else {
				res.redirect(response.redirectUrl, response.redirectCode);
			}
			return;
		}

		if (typeof response.pause == 'number' && response.pause > 0) {
			setTimeout(function ()
			{
				res.send(response.statusCode, response.body);
			}, (response.pause * 1000));
		} else {
			res.send(response.statusCode, response.body);
		}
	};


	/**
	 * Run JS based Resource/App
	 *
	 * @param res
	 * @param req
	 * @param resourceSettings
	 * @param appSettings
	 */
	CorsaHelper.runJSApp = function (res, req, resourceSettings, appSettings, returnResponse)
	{
		if (resourceSettings.headers != "") {
			response.setHeader('Content-Type', resourceSettings.content_type);
		}

		try {
			var userScript = "" + resourceSettings['body'] + "";
			var script = vm.createScript(userScript, appSettings.appName);
			script.runInThisContext()
		} catch (e) {
//			console.log(e);
			if (returnResponse != undefined) {
				return {status: false, msg: "Warning: Body Script is invalid. Message: " + e.message};
			}
			var output = {
				errorNum: 5001,
				errorMsg: "Resource Javascript threw error: " + e.message,
				requestedUrl: req.originalUrl,
				recommendedUrl: "/documentation"
			};
			res.send(500, output);
			return;
		}

		if (returnResponse != undefined) {
			return true;
		}

		this.applyResponse(res);
	};

	/**
	 * Validate Input is JSON
	 *
	 * @param input
	 * @returns {boolean}
	 */
	CorsaHelper.validateJSON = function (input)
	{
		var json = false;

		try {
			if (JSON.parse(input)) {
				json = true;
			}
		} catch (e) {

		}

		return json;
	};


	/**
	 * Validate Input is Proper XML
	 *
	 * @param input
	 * @returns {boolean}
	 */
	CorsaHelper.validateXML = function (input)
	{
		var etree = false;

		try {
			etree = et.parse(input);
		} catch (err) {
		}

		return etree;
	};


	/**
	 * Validate body of Submitted form
	 *
	 * @param bodyData
	 * @returns {{status: boolean, msg: string}}
	 */
	CorsaHelper.validateBody = function (bodyData, res, req)
	{
		var status = true, msg = "";

		if (bodyData.type == 'simple') {
			switch (bodyData.content_type) {
				case 'application/json':
					if (this.validateJSON(bodyData.body) == false) {
						status = false;
						msg = "Warning: Content type set to JSON, but Body is invalid. Resource was still saved.";
					}
					break;
				case 'application/xml':
				case 'text/xml':
					if (this.validateXML(bodyData.body) == false) {
						status = false;
						msg = "Warning: Content type set to XML, but Body is invalid. Resource was still saved.";
					}
					break;
			}
		}

		if (bodyData.type == 'js') {
			var appSettings = {appName: "test", appId: "0"};

			request = require('./request.js')(req);
			response = require('./response.js')(res);

			var res = this.runJSApp(res, req, bodyData, appSettings, true);

			if (res.status == false) {
				status = res.status;
				msg = res.msg;
			}
		}

		return {status: status, msg: msg};
	};


	/**
	 * Make Salt for Passwords
	 *
	 * @returns {string}
	 */
	CorsaHelper.makeSalt = function ()
	{
		return Math.round((new Date().valueOf() * Math.random())) + '';
	};

	module.exports = CorsaHelper;

}());


Array.prototype.first = function ()
{
	return this[0];
};