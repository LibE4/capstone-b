
app.controller("NavCtrl", ["$scope", "$rootScope", "$location", function ($scope, $rootScope, $location) {

    //Hub
    $rootScope.connection = $.hubConnection();
    $rootScope.chatHubProxy = $rootScope.connection.createHubProxy('ChatHub');

    $scope.navItems = [
		{
		    name: "Chat",
		    url: "#/Chat"
		},
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
        if (link === "#/chat") {
            $rootScope.ShowOnlineUserWindow = true;
            return;
        }
        if (link === "/logout") {
            $rootScope.isLogin = false;
            $rootScope.chatHubProxy.invoke('Logoff', $rootScope.user.userName);
            $rootScope.user = "";
        } 
        $location.url(link);
    }
}]);
