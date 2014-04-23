var js2xmlparser = require('js2xmlparser');

function CorsaResponse(res)
{
	this.res = res;
	this.headers = {'X-Powered-By': 'Mimo'};
	this.body = null;
	this.statusCode = 200;
	this.redirectUrl = null;
	this.redirectCode = 302;
	this.pause = 0;
}

/**
 * Export for node
 * @param res
 * @returns {CorsaResponse}
 */
module.exports = function (res)
{
	return new CorsaResponse(res)
};

/**
 * Set Single Header Value
 *
 * @param key   Header
 * @param val   Value
 */
CorsaResponse.prototype.setHeader = function (key, val)
{
	if (key == undefined || val == undefined) {
		return;
	}
	this.headers[key] = val;
};


/**
 * Set body of response
 *
 * @param body
 * @param type
 */
CorsaResponse.prototype.setBody = function (body, type, rootElement)
{
	if (body == null) {
		return;
	}

	if (type == undefined || type == 'json') {
		this.body = body;
		return;
	}

	if (type == "xml") {
		this.setHeader('Content-Type', 'application/xml');
		this.setXMLBody(body, rootElement);
	}
};

/**
 * Set XML Body from JSON object
 *
 * @param json
 * @param rootElement
 */
CorsaResponse.prototype.setXMLBody = function (json, rootElement)
{
	if (json == undefined) {
		this.body = '';
		return;
	}

	if (rootElement == undefined) {
		rootElement = 'root';
	}

	this.body = js2xmlparser(rootElement, json);
};

/**
 * Set Multiple headers
 *
 * @param headers
 */
CorsaResponse.prototype.setHeaders = function (headers)
{
	if (headers == undefined || typeof headers != 'object') {
		return;
	}
	for (var k in headers) {
		this.headers[k] = headers[k];
	}
};

/**
 * Set Status Code
 *
 * @param code
 */
CorsaResponse.prototype.setStatusCode = function (code)
{
	if (code == undefined) {
		return;
	}
	this.statusCode = code;
};

/**
 * Set Content Type to XML or JSON via simple value
 * @param type
 */
CorsaResponse.prototype.setSimpleType = function (type)
{
	switch (type) {
		case "json":
			this.headers['Content-Type'] = 'application/json';
			break;
		case "xml":
			this.headers['Content-Type'] = 'application/xml';
			break;
		case "text":
			this.headers['Content-Type'] = 'text/plain';
			break;
		case "html":
			this.headers['Content-Type'] = 'text/html';
			break;
		default:
			break;
	}
};


/**
 * Set Redirection URL
 *
 * @param url    can be absolute or relative
 * @param code   redirect code, defaults to 302
 */
CorsaResponse.prototype.setRedirect = function (url, code)
{
	if (url == undefined) {
		return;
	}
	this.redirectUrl = url;

	if (code != undefined) {
		this.redirectCode = code;
	}
};

/**
 * Set pause time for response
 * @param secs
 */
CorsaResponse.prototype.setPause = function (secs)
{
	if (secs == undefined) {
		return;
	}

	this.pause = secs;
};

