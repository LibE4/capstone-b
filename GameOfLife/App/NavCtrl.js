
app.controller("NavCtrl", ["$scope", "$rootScope", "$location", function ($scope, $rootScope, $location) {
    $scope.navItems = [

		{
		    name: "Tetris",
		    url: "/tetris"
		},
		{
		    name: "All Patterns",
		    url: "/pattern/all"
		},
		{
		    name: "New Pattern",
		    url: "/pattern"
		},
		{
		    name: "Home",
		    url: "/home"
		}
    ];

    $scope.loadPartials = function (link) {
        if (link == "/logout") {
            $rootScope.user = "";
        } 
        $location.url(link);
    }
}]);
