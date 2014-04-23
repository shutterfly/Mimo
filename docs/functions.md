# Mimo Dynamic Response Functions


## Request



getMethod()
----------
Retrieves the requested information from the defined URL or incoming client request

#### Example: 
``request.getMethod();``

#### Result: 
`get`, `post`, `put`, `delete`, `option`



getHeader({headerName})
----------
Retrieves a single header from incoming client request, not case sensitive

#### Example: 
`request.getHeader('Content-Type');`

#### Result: 
`application/json`



getHeaders()
----------
Retrieves all header values from incoming client request

#### Example: 
`var headers = request.getHeaders();`

#### Result: 
`headers['content-type'] = "application/json"` - jsonObject



getPath()
----------
Returns full path of URL, excluding current user and application name
#### Example: 
`request.getPath();`

#### Result: 
`/resourceName/path`



getPathSegment({int})
----------
Returns requested path segment for URL
#### Example: 
`request.getPathSegment(1);`

#### Result: 
`testApp` from `/demoUser/testApp/resourceName/path`



getFullPath()
----------
Returns full URL path including current user and application name
#### Example: 

`request.getFullPath();`
#### Result: 
`/demoUser/testApp/resourceName/path`


getFullUrl()
----------
Retrieves the complete URL with Query Parameters
#### Example: 
`request.getFullUrl();`
#### Result: 
`/demoUser/testApp/resourceName/path?q=Searched`



getProtocol()
----------
Returns returns http or https
#### Example: 
`request.getProtocol();`
#### Result: 
`https`



isSecure()
----------
Returns true or false depending on secure state
#### Example: 
`request.isSecure();`
#### Result: 
`true`, `false`



getQueryParam({queryParam})
----------
Retrieves specified query parameters

#### Example: 
URL: `/demoUser/testApp/resourceName/path?q=Searched`

`request.getQueryParam('q');`

#### Result: 
`Searched`




getQueryParams()
----------
Retrieves all query parameters
#### Example: 
URL: `/demoUser/testApp/resourceName/path?q=Searched`

`request.getQueryParams();`

#### Result: 
`{q: "Searched"}`


getPostParam({param})
----------
Retrieves specified post parameters
#### Example:
`request.getPostParam('user');`

#### Result:
`testUser`


getPostParams()
----------
Retrieves all Post parameters
#### Example: 
POST Data: `"test=User"`

`request.getPostParams();`

#### Result: 
`{test: "User"}`



getBody()
----------
Returns raw content data
#### Example: 
`request.getBody()`
#### Result: 
`"{test:"Body"}"` -- Note: returns string


getParsedBody()
----------
Returns the body content of XML or JSON parsed in object form rather than string

#### Example:
Body: `{test:"Body"}`

`request.getBodyParsed();`

#### Result: 
`{test:"Body"}` Note: return is JSON Object



getAppName()
----------
Returns application name

#### Example: 
`request.getAppName();`
#### Result:
`testApp` 


getUser()
----------
Retrieves User name
#### Example: 
`request.getUser();`

#### Result: 
`demoUser`


getSimpleType()
----------
Returns content type header with simplified value
#### Example: 
`request.getSimpleType();`

#### Result: 
`json`  - inferred from `application/json`



isType({simpleType}')
----------
Verifies content type against simplified value
#### Example: 
`request.isType('json');`
#### Result: 
`true`, `false`
 
 
 
 
 
 
## Response


setHeader()
----------
Defines a current header with a new value
#### Example: r
`response.setHeader('X-Type', 'Yes');`

Header: `X-Type: Yes`



setHeaders()
----------
Adds or replaces all current header values with a new values
#### Example: 
`response.setHeaders({'X-Type': 'Test', 'X-Reason': 'Why'});`



setBody()
----------
Defines body data based on an object or string and converts to json or xml if optional type provided
#### Example: 
`response.setBody({test: "MyTest"}, 'json');`
#### Result: 
Header: `Content-Type: application/json`

Body: `{test:"MyTest"}`



setXMLBody()
----------
Defines body data based on an object or string and converts to XML.  Root element supported
#### Example: 
`response.setXMLBody({test:"MyTest"}, 'root');`
#### Result: 

Header: `Content-Type: application/xml`

Body: `<root><test>MyTest</test></root>`


setSimpleType()
----------
Defines the simple type value for the application based on the data type
#### Example: 
`response.setSimpleType('json');`
#### Result: 
Header: `Content-Type: application/json`


setStatusCode({httpCode})
----------
Defines the status code that is sent in response to incoming client request 
#### Example: 
`response.setStatusCode(204);`
#### Result: 

Header: `HTTP/1.1 204 No Content`



setRedirect()
------------
Used to redirect to an outside service or potentially an application
#### Example: 
`response.setRedirect('http://google.com');`
#### Result: 
Headers:

- `HTTP/1.1 301 Moved Permanently`
- `Location: hhttp://google.com`


setPause({secondsToPause}))
------------
Used to pause the response by X seconds
#### Example: 
`response.setPause(5);`
#### Result: 
Response takes 5 seconds to return to client
