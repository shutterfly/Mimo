# Welcome to Mimo


Mimo is a HTTP/API Mocking Platform that enables you to Mock APIs.
Emulations can be simple responses with a JSON body and headers, or they can be dynamically changed using JavaScript functions. 

The purpose of creating Mimo was to enable a single user or a group of users to emulate their own APIs or HTTP requests. This could be for testing positive and negative scenarios, mocking an external API locally or as testing environment for other developers to use while the full API is being developed.

The name Mimo was choosen for it's Italian translation meaning Mocking Bird.

## Users and Applications

Once a user creates a login all of their APIs will be available at {host}/{username}/{appName}/{resource}.  Each user can have multiple applications and each application can have multiple endpoints/resources.


## Dynamic APIs

Using JavaScript helper functions `request` and `response` the incoming request data can be accessed and the response can be modified.  For example if the request is a POST and the API being mocked should not accept POST calls the following dynamic API response can be used:

```javascript
if (request.getMethod() == "post")  {
    var body = {'error': 'POST Method not supported'};
    response.setBody(body);
} else {
    var body = {'success': 'true'};
    response.setBody(body);
}
```

Other `request` and `response` functions available:

- `request.getHeader()`
- `request.getPath()`
- `request.getQueryParam()`
- `request.getBody()`
- `request.getParsedBody()` - supports XML and JSON Parsing
- `response.setHeader()`
- `responsesetBody()`
- `responsesetStatusCode()`
- `responsesetPause()`
- `responsesetRedirect()`

A full list of available functions can be found [here](docs/functions.md).


## Getting Started

1. Clone git repo
2. cd into mimo folder
3. Type: `npm install`
4. Start node: `npm start` or `node app.js`
5. Open: http://localhost:3000 in your browser
6. Either sign up at http://localhost:3000 or login as demo:passw0rd
7. Docs can be viewed at http://localhost:3000/docs

Note: you must have node.js binaries installed and in your PATH to work


## Data Storage

All Mimo data is stored in a SQLite Database allowing the package to be portable, sharable and only require Node.js to be installed on the host system.


## History

Mimo was created as part of Shutterfly's Hack Day 2013 and a collaboration between [Brad Vernon](https://github.com/ibspoof), [Sarah Pugliaresi](https://github.com/spugliaresi) and [Vasu Jain](https://github.com/vasujain).

Mimo is built using [Express.js](http://expressjs.com), [Angular.js](https://angularjs.org/) and [Bootstrap](http://getbootstrap.com).


## Issues
Please use the [GitHub Issues](https://github.com/shutterfly/Mimo/issues) to report any problems.


