
app.controller("NavCtrl", ["$scope", "$rootScope", "$location", function ($scope, $rootScope, $location) {
    $scope.navItems = [
		{
		    name: "Logout",
		    url: "/logout"
		},
		{
		    name: "Chat",
		    url: "/chat"
		},
		{
		    name: "All Patterns",
		    url: "/pattern/list"
		},
		{
		    name: "New Pattern",
		    url: "/pattern/new"
		}
    ];

    $scope.loadPartials = function (link) {
        if (link == "/logout") {
            $rootScope.user = "";
        } 
        $location.url(link);
    }
}]);
