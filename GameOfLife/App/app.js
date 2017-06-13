var app = angular.module("GameOfLifeApp", ["ngRoute"]);

var isAuth = ($rootScope) => new Promise((resolve, reject) => {
    if ($rootScope.user ? true : false) {
        resolve();
    } else {
        reject();
    }
})

app.config(function ($routeProvider) {
    $routeProvider
		.when('/auth', {
		    templateUrl: 'App/partials/auth.html',
		    controller: 'AuthCtrl'
		})
		.when('/chat', {
		    templateUrl: 'App/partials/chat.html',
		    controller: 'ChatCtrl',
		    resolve: { isAuth }
		})
        .when('/pattern/small', {
		    templateUrl: 'App/partials/PatternSmall.html',
		    controller: 'PatternSmallCtrl',
		    resolve: { isAuth }
		})
        .when('/pattern/big', {
        	templateUrl: 'App/partials/PatternBig.html',
        	controller: 'PatternBigCtrl',
        	resolve: { isAuth }
        })
		.when('/pattern/all', {
		    templateUrl: 'App/partials/PatternAll.html',
		    controller: 'PatternAllCtrl',
		    resolve: { isAuth }
		})
        .when('/logout', {
		    templateUrl: 'App/partials/auth.html',
		    controller: 'AuthCtrl'
		})
        .when('/base', {
            templateUrl: 'App/partials/home.html',
            controller: 'HomeCtrl'
        })
		.otherwise('/auth');
});