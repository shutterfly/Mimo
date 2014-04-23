var appscategApp = angular.module('appscategApp', []);

appscategApp.controller('MainCtrl', function MainCtrl($scope) {
    $scope.apps = [
        {'name': 'App-Shutterfly',
            'url': 'http://localhost:3000/',
            'description': 'SFLY- Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut'},
        {'name': 'App-Tinyprints',
            'url': 'http://localhost:3000/',
            'description': 'TP- Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut'},
        {'name': 'App-WeddingPaperDivas',
            'url': 'http://localhost:3000/',
            'description': 'WPD- Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut'},
        {'name': 'App-Treat',
            'url': 'http://localhost:3000/',
            'description': 'TRT- Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut'},
        {'name': 'App-ThisLife',
            'url': 'http://localhost:3000/',
            'description': 'TSLF- Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut'},
        {'name': 'App-MyPublisher',
            'url': 'http://localhost:3000/',
            'description': 'MYPB- Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut'}
    ];
});