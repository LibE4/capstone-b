
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
		    url: "/pattern/all"
		},
		{
		    name: "New Big Pattern",
		    url: "/pattern/big"
		},
        {
        	name: "New Small Pattern",
        	url: "/pattern/small"
        }
    ];

    $scope.loadPartials = function (link) {
        if (link == "/logout") {
            $rootScope.user = "";
        } 
        $location.url(link);
    }
}]);
