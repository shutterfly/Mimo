var mimoApp = angular.module('mimoApp', ['ngRoute'])

	.config(['$routeProvider', function ($routeProvider)
	{
		$routeProvider

			.when('/', {
				templateUrl: '/js/views/home.html',
				controller: 'MainCtrl'
			})

			.when('/app/create', {
				templateUrl: '/js/views/application/create.html',
				controller: 'ApplicationCtrl',
				action: 'Create'
			})

			.when('/app/:id', {
				templateUrl: '/js/views/application/view.html',
				controller: 'ApplicationCtrl',
				action: 'View'
			})

			.when('/app/:id/edit', {
				templateUrl: '/js/views/application/create.html',
				controller: 'ApplicationCtrl',
				action: 'Edit'
			})

			.when('/app/:id/rsrc/create', {
				templateUrl: '/js/views/rsrc/create.html',
				controller: 'RsrcCtrl',
				action: 'Create'
			})

			.when('/app/:id/rsrc/:rId/edit', {
				templateUrl: '/js/views/rsrc/create.html',
				controller: 'RsrcCtrl',
				action: 'Edit'
			})

			.otherwise({
				redirectTo: '/'
			}
		);

	}]);

function MainCtrl($scope, $http)
{
	$http.get("/user/app")
		.success(function (apps)
		{
			$scope.apps = apps;
		});

	$scope.apps = null;
}


function ApplicationCtrl($scope, $http, $location, $routeParams, $route)
{
	$scope.id = $routeParams.id;
	$scope.action = $route.current.action;
	$scope.resources = null;
	$scope.app = null;
	$scope.error = null;

	$scope.app = {
		name: "",
		short_name: "",
		active: 1,
		description: "",
		public: 1
	};

	if ($scope.action != 'Create') {
		$http.get('/user/app/' + $scope.id).success(function (response)
		{
			$scope.app = response;
		});
	}

	$scope.submit = function ()
	{
		if ($scope.action == 'Create') {
			$http.post('/user/app', $scope.app).success(function (response)
			{
				$location.path("/app/" + response.id);
			}).error(function (e)
				{
					$scope.error = "Error: " + e;
				});
		} else {
			$http.put('/user/app/' + $scope.app.id, $scope.app).success(function (response)
			{
				$location.path("/app/" + $scope.app.id);
			}).error(function (e)
				{
					$scope.error = "Error: " + e;
				});
		}
	};


	if ($scope.action == 'View') {
		$http.get('/user/app/' + $scope.id + '/rsrc').success(function (response)
		{
//			console.log(response);
			$scope.resources = response;
		});
	}

	$scope.delete = function ()
	{
		var con = confirm("Are you sure you want to delete app and all it's resources?");
		if (con) {
			$http.delete('/user/app/' + $scope.id).success(function (response)
			{
				$location.path("/");
			}).error(function (e)
				{
					$scope.error = "Error: " + e;
				});
		}
	};


	$scope.keyup = function ()
	{
		$scope.app.short_name = $scope.app.short_name.replace(/[^\w]/gi, '');
	}


}


function RsrcCtrl($scope, $http, $location, $routeParams, $route)
{
	$scope.appId = $routeParams.id;
	$scope.rsrcId = $routeParams.rId;
	$scope.action = $route.current.action.capitalize();
	$scope.app = null;
	$scope.error = null;
	$scope.warning = null;

	$scope.res = {
		type: 'simple',
		http_code: 200,
		content_type: 'application/json',
		body: ""
	};

	// get app settings
	$http.get('/user/app/' + $scope.appId).success(function (response)
	{
		$scope.app = response;
	});


	if ($scope.action != 'Create') {
		$http.get('/user/app/' + $scope.appId + "/rsrc/" + $scope.rsrcId).success(function (response)
		{
			$scope.res = response;
		});
	}

	$scope.codes = [
		{'name': '200', 'value': '200 - OK'},
		{'name': '201', 'value': '201 - Created'},
		{'name': '202', 'value': '202 - Accepted'},
		{'name': '203', 'value': '203 - Non-Authoritative Information'},
		{'name': '204', 'value': '204 - No Content'},
		{'name': '205', 'value': '205 - Reset Content'},
		{'name': '206', 'value': '206 - Partial Content'},
		{'name': '207', 'value': '207 - Multi-Status'},
//		{'name': '208', 'value': '208 - Already Reported'},
//		{'name': '209', 'value': '209 - IM Used'},
		{'name': '300', 'value': '300 - Multiple Choices'},
		{'name': '301', 'value': '301 - Moved Permanently'},
		{'name': '302', 'value': '302 - Found'},
		{'name': '303', 'value': '303 - See Other'},
		{'name': '304', 'value': '304 - Not Modified'},
		{'name': '305', 'value': '305 - Use Proxy'},
		{'name': '306', 'value': '306 - Switch Proxy'},
		{'name': '307', 'value': '307 - Temporary Redirect'},
		{'name': '308', 'value': '308 - Permanent Redirect'},
		{'name': '400', 'value': '400 - Bad Request'},
		{'name': '401', 'value': '401 - Unauthorized'},
		{'name': '402', 'value': '402 - Bad Payment Required'},
		{'name': '403', 'value': '403 - Forbidden'},
		{'name': '404', 'value': '404 - Not Found'},
		{'name': '405', 'value': '405 - Method Not Allowed'},
		{'name': '406', 'value': '406 - Not Acceptable'},
		{'name': '407', 'value': '407 - Proxy Authentication Required'},
		{'name': '408', 'value': '408 - Request Time Out'},
		{'name': '409', 'value': '409 - Conflict'},
		{'name': '410', 'value': '410 - Gone'},
		{'name': '500', 'value': '500 - Internal Server Error'},
		{'name': '501', 'value': '501 - Not Implemented'},
		{'name': '502', 'value': '502 - Bad Gateway'},
		{'name': '503', 'value': '503 - Service Unavailable'},
		{'name': '504', 'value': '504 - Gateway Timeout'},
//		{'name': '505', 'value': '505 HTTP Version Not Supported'},
//		{'name': '506', 'value': '506 Variant Also Negotiates'},
//		{'name': '507', 'value': '507 Insufficient Storage'},
//		{'name': '508', 'value': '508 Loop Detected'},
//		{'name': '509', 'value': '509 Bandwith Limit Exceeded'},
//		{'name': '510', 'value': '510 Not Extended'},
//		{'name': '511', 'value': '511 Network Authentication Required'},
//		{'name': '522', 'value': '522 Connection timed out'},
//		{'name': '524', 'value': '524 A timeout occurred'},
//		{'name': '598', 'value': '598 Network read timeout error'},
//		{'name': '599', 'value': '599 Network connect timeout error'}
	];

	$scope.contentTypes = [
		{'name': 'application/json', 'type': 'application/json'},
		{'name': 'application/xml', 'type': 'application/xml'},
		{'name': 'text/xml', 'type': 'text/xml'},
		{'name': 'text/csv', 'type': 'text/csv'},
		{'name': 'text/html', 'type': 'text/html'},
		{'name': 'text/plain', 'type': 'text/plain'}
	];


	$scope.submit = function ()
	{
		if ($scope.action == 'Create') {

			$http.post('/user/app/' + $scope.appId + "/rsrc", $scope.res).success(function (response)
			{
				if (response.valid == true) {
					$location.path("/app/" + $scope.appId);
				}

				$scope.warning = response.validMsg;
				$scope.action = 'Edit';
				$scope.res.id = response.id;

			}).error(function (e)
				{
					$scope.error = "Error: " + e;
				});

		} else {
			$http.put('/user/app/' + $scope.appId + "/rsrc/" + $scope.res.id, $scope.res).success(function (response)
			{
				if (response.valid == true) {
					$location.path("/app/" + $scope.appId);
				}

				$scope.warning = response.validMsg;

			}).error(function (e)
				{
					$scope.error = "Error: " + e;
				});
		}
	};

	$scope.delete = function ()
	{
		var con = confirm("Are you sure you want to delete resource?");
		if (con) {
			$http.delete('/user/app/' + $scope.appId + "/rsrc/" + $scope.res.id).success(function (response)
			{
				$location.path("/app/" + $scope.appId);
			}).error(function (e)
				{
					$scope.error = "Error: " + e;
				});
		}
	};

}

String.prototype.capitalize = function ()
{
	return this.charAt(0).toUpperCase() + this.slice(1);
};
