app.controller("ChatCtrl", ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {
    $scope.Msgs = [];

    var connection = $.hubConnection();
    var chatHubProxy = connection.createHubProxy('ChatHub');
    chatHubProxy.on('addNewMessageToPage', function (name, message) {
        console.log("received");
        console.log(name + ' ' + message);
        $scope.Msgs.push({ name: name, message: message });
        $scope.$apply();
    });
    connection.start().done(function () {
        // Wire up Send button to call NewContosoChatMessage on the server.
        $scope.sendMsg = function () {
        console.log("send");
        chatHubProxy.invoke('ChatMessage', $rootScope.user.userName, $scope.message);
        };
    });
}]);
