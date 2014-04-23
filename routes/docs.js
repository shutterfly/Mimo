exports.index = function (req, res)
{

    var data = {};
    data['title'] = "Docs";
    data['request'] = [
        {
            "title": "getMethod()",
            "description": "Retrieves the requested information from the defined URL or incoming client request",
            "example": "request.getMethod();",
            "result": "get"
        },
        {
            "title": "getHeader({headerName})",
            "description": "Retrieves a single header from incoming client request, not case sensitive",
            "example": "request.getHeader('Content-Type');",
            "result": ""
        },
        {
            "title": "getHeaders()",
            "description": "Retrieves all header values from incoming client request",
            "example": "request.getHeaders();",
            "result": ""
        },
        {
            "title": "getPath()",
            "description": "Returns full path of URL, excluding current user and application name",
            "example": "request.getPath();",
            "result": ""
        },
        {
            "title": "getPathSegment({int})",
            "description": "Returns requested path segment for URL",
            "example": "request.getPathSegment(0);",
            "result": ""
        },
        {
            "title": "getFullPath()",
            "description": "Returns full URL path including current user and application name",
            "example": "request.getFullPath();",
            "result": ""
        },
        {
            "title": "getFullUrl()",
            "description": "Retrieves the complete URL with Query Parameters",
            "example": "request.getFullUrl();",
            "result": ""
        },
        {
            "title": "getProtocol()",
            "description": "Returns returns http or https",
            "example": "request.getProtocol();",
            "result": "https"
        },
        {
            "title": "isSecure()",
            "description": "Returns true or false depending on secure state",
            "example": "request.isSecure();",
            "result": ""
        },
        {
            "title": "getQueryParam({queryParam})",
            "description": "Retrieves specified query parameters",
            "example": "request.getQueryParam('user');",
            "result": ""
        },
        {
            "title": "getQueryParams()",
            "description": "Retrieves all query parameters",
            "example": "request.getQueryParams();",
            "result": ""
        },
        {
            "title": "getPostParam({param})",
            "description": "Retrieves specified post parameters",
            "example": "request.getPostParam('user');",
            "result": ""
        },
        {
            "title": "getPostParams()",
            "description": "Retrieves all post parameters",
            "example": "request.getPostParams();",
            "result": ""
        },
        {
            "title": "getBody()",
            "description": "Returns raw content data",
            "example": "request.getBody()",
            "result": ""
        },
        {
            "title": "getParsedBody()",
            "description": "Returns the body content of XML or JSON parsed in object form rather than string",
            "example": "request.getBodyParsed();",
            "result": ""
        },

        {
            "title": "getAppName()",
            "description": "Returns application name",
            "example": "request.getAppName();",
            "result": ""
        },
        {
            "title": "getUser()",
            "description": "Retrieves User name",
            "example": "request.getUser();",
            "result": ""
        },
        {
            "title": "getSimpleType()",
            "description": "Returns content type header with simplified value",
            "example": "request.getSimpleType(); -> application/json == json",
            "result": ""
        },
        {
            "title": "isType({type})",
            "description": "Verifies content type against simplified value",
            "example": "request.isType('json');",
            "result": ""
        }
    ];

    data['response'] = [
        {
            "title": "setHeader()",
            "description": "Defines a current header with a new value",
            "example": "response.setHeader('X-Type', 'Yes');",
            "result": ""
        },
        {
            "title": "setHeaders()",
            "description": "Adds or replaces all current header values with a new values",
            "example": "response.setHeaders({'X-Type': 'Brad', 'X-Reason': 'Why'});",
            "result": ""
        },
        {
            "title": "setBody()",
            "description": "Defines body data based on an object or string and converts to json or xml if optional type provided",
            "example": "response.setBody(bodyObj, 'json');",
            "result": ""
        },
        {
            "title": "setXMLBody()",
            "description": "Defines body data based on an object or string and converts to XML.  Root element supported",
            "example": "response.setXMLBody(bodyObj, 'root');",
            "result": ""
        },
		
        {
            "title": "setSimpleType()",
            "description": "Defines the simple type value for the application based on the data type",
            "example": "response.setSimpleType('json');",
            "result": ""
        },
        {
            "title": "setStatusCode()",
            "description": "Defines the status code that is sent in response to incoming client request ",
            "example": "response.setStatusCode(204);",
            "result": ""
        },
        {
            "title": "setRedirect()",
            "description": "Used to redirect to an outside service or potentially an application",
            "example": "response.setRedirect('http://google.com');",
            "result": ""
        },
        {
            "title": "setPause()",
            "description": "Used to pause the response by X seconds",
            "example": "response.setPause(5);",
            "result": "Response takes 5 seconds to return to client"
        }
		
    ];


    res.render('docs/index', data);
};
