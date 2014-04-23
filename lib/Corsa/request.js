var xml2json = require('xml2json');
var et = require('elementtree');

function CorsaRequest(req)
{
	this.req = req;
	this.etree = null;
}

/**
 * Export for Node
 *
 * @param req
 * @returns {CorsaRequest}
 */
module.exports = function (req)
{
	return new CorsaRequest(req)
};

/**
 * Returns single header from Request
 *
 * @param header
 * @returns {*}
 */
CorsaRequest.prototype.getHeader = function (header)
{
	if (header == undefined) {
		return null;
	}
	return this.req.get(header);
};


/**
 * Returns raw body of request message
 *
 * @returns {*}
 */
CorsaRequest.prototype.getBody = function ()
{
	if (this.req.rawBody == undefined || this.req.rawBody == "") {
		return null;
	}
	return this.req.rawBody
};


/**
 * Return all headers
 *
 * @returns {headers|*|headers|headers|headers|headers}
 */
CorsaRequest.prototype.getHeaders = function ()
{
	return this.req.headers;
};

/**
 * Returns single Query param
 *
 * @param param
 * @returns {*}
 */
CorsaRequest.prototype.getQueryParam = function (param)
{
	if (param == undefined || this.req.query.param == undefined) {
		return null;
	}

	return this.req.query.param
};


/**
 * Returns all Query Params
 *
 * @returns {*}
 */
CorsaRequest.prototype.getQueryParams = function ()
{
	if (Object.keys(this.req.query).length < 1) {
		return null
	}
	return this.req.query;
};

/**
 * Returns all Post Params
 *
 * @returns {*}
 */
CorsaRequest.prototype.getPostParams = function ()
{
	if (this.req.postData == undefined) {
		return null
	}
	return this.req.postData;
};

/**
 * Returns requested postParam
 *
 * @param param
 * @returns {*}
 */
CorsaRequest.prototype.getPostParam = function (param)
{
	if (this.req.postData[param] == undefined) {
		return null
	}
	return this.req.postData[param];
};

/**
 * Returns path of resource
 *
 * @returns {*}
 */
CorsaRequest.prototype.getPath = function ()
{
	if (this.req.params[0] == undefined || this.req.params[0] == '') {
		return null;
	}
	return this.req.params[0];
};

/**
 * Returns path segment start at 0 from the appName
 *
 * @param seg
 * @returns {*}
 */
CorsaRequest.prototype.getPathSegment = function (seg)
{
	if (seg == undefined) {
		return null;
	}
	var splitPath = this.req.params[0].split('/');

	if (splitPath[seg] == undefined) {
		return null;
	}

	return splitPath[seg];
};

/**
 * Returns full Path w/o query params
 *
 * @returns {path|*|path|path|path|path}
 */
CorsaRequest.prototype.getFullPath = function ()
{
	return this.req.path;
};

/**
 * Returns Full url including user and AppName and QueryParams
 *
 * @returns {originalUrl|*}
 */
CorsaRequest.prototype.getFullUrl = function ()
{
	return this.req.originalUrl;
};

/**
 * Returns current application
 * @returns {*}
 */
CorsaRequest.prototype.getAppName = function ()
{
	if (this.req.params.appName == undefined) {
		return null;
	}
	return this.req.params.appName;
};

/**
 * Returns current user
 *
 * @returns {*}
 */
CorsaRequest.prototype.getUser = function ()
{
	if (this.req.params.user == undefined) {
		return null;
	}
	return this.req.params.user;
};

/**
 * Returns SimpleType of request content
 * Example: application/json = json
 *
 * @returns {*}
 */
CorsaRequest.prototype.getSimpleType = function ()
{
	if (this.isType('json')) {
		return 'json';
	}

	if (this.isType('xml')) {
		return 'xml';
	}

	if (this.isType('text')) {
		return 'text';
	}

	if (this.isType('html')) {
		return 'html';
	}

	var contentType = this.req.get('Content-Type');
	switch (contentType) {
		case 'application/x-www-form-urlencoded':
			return 'form';
		case 'multipart/form-data':
			return 'multipart';
		default :
			return null;
	}
};

/**
 * Get Parsed Body
 * @returns {*}
 */
CorsaRequest.prototype.getParsedBody = function ()
{
	if (this.getMethod() == 'get' || this.getMethod() == 'delete') {
		return null;
	}

	var body = this.req.rawBody.trim();
	var type = this.getSimpleType();

	switch (type) {
		case "json":
			return JSON.parse(body);
		case "xml":
			return xml2json.toJson(body, {object: true});
		default:
			var response = null;

			try {
				response = JSON.parse(body);
			} catch (e) {
			}

			if (response == null) {
				try {
					response = xml2json.toJson(body, {object: true});
				} catch (e) {
				}
			}
			return response;
	}
};

/**
 * Get Method ie GET, PUT, POST, DELETE
 *
 * @returns {method|*|method|method|method|method}
 */
CorsaRequest.prototype.getMethod = function ()
{
	return this.req.route.method
};

/**
 * Get current protocol
 * @returns {string}   http/https
 */
CorsaRequest.prototype.getProtocol = function ()
{
	if (this.req.protocol) {
		return 'https';
	}
	return 'http';
};

/**
 * Simple Helper to find if basic type matches incoming type
 * Example: isType('json') == application/json == true
 *
 * @param type
 * @returns {*}
 */
CorsaRequest.prototype.isType = function (type)
{
	if (type == undefined) {
		return false;
	}

	return this.req.is(type)
};

/**
 * Helper if request is HTTPS
 *
 * @returns {secure|*|secure|secure|secure}
 */
CorsaRequest.prototype.isSecure = function ()
{
	return this.req.secure;
};


/**
 * Helper if request is HTTPS
 *
 * @returns {secure|*|secure|secure|secure}
 */
CorsaRequest.prototype.getXPath = function (search, type)
{
	var out = null
		, body = this.req.rawBody.trim();

	if (body == "") {
		return null;
	}

	if (this.etree == null) {
		try {
			this.etree = et.parse(body);
		} catch (err) {
			this.etree = false;
			return null;
		}
	}

	if (this.etree == null || this.etree == false) {
		return null;
	}

	switch (type) {
		case "text":
			out = this.etree.findtext(search);
			break;

		case "one":
			out = this.etree.find(search);
			break;

		default:
			out = this.etree.findall(search);
			break;
	}

	return out;
};

/**
 * Get Basic Auth username/password
 * @returns {*}
 */
CorsaRequest.prototype.getBasicAuth = function ()
{
	var auth = this.req.get('Authorization');

	if (auth == null) {
		return null;
	}

	var authSplit = auth.split(" ");

	if (authSplit[0].toLowerCase() != 'basic') {
		return null;
	}

	var parsed = new Buffer(authSplit[1], 'base64').toString();
	var parsedSplit = parsed.split(':');

	return {
		username: parsedSplit[0],
		password: parsedSplit[1]
	};
};
