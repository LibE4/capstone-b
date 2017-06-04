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
        .when('/game', {
		    templateUrl: 'App/partials/game.html',
		    controller: 'GameCtrl',
		    resolve: { isAuth }
		})
        .when('/pattern/new', {
        	templateUrl: 'App/partials/PatternNew.html',
        	controller: 'PatternNewCtrl',
        	resolve: { isAuth }
        })
		.when('/logout', {
		    templateUrl: 'App/partials/auth.html',
		    controller: 'AuthCtrl'
		})
		.otherwise('/auth');
});