app.controller("ChatCtrl", ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {

    var connection = $rootScope.connection;
    var chatHubProxy = $rootScope.chatHubProxy;

    // chat login
    $rootScope.OnlineUsers = [];
    chatHubProxy.on('GetOnlineUsers', function (onlineUsers) {
        console.log("chatuser");
        $rootScope.OnlineUsers = $.parseJSON(onlineUsers);
        $scope.$apply();
    });
    chatHubProxy.on('NewOnlineUser', function (user) {
        $rootScope.OnlineUsers.push(user);
        $scope.$apply();
    });

    $scope.sendMsg = function () {
        chatHubProxy.invoke('ChatMessage', $scope.pvtmessage);
    };

    $scope.login = function () {
        $scope.isLogin = true;
        chatHubProxy.invoke('Login', $rootScope.user.userName);
    };
    $scope.logoff = function () {
        $scope.isLogin = false;
        chatHubProxy.invoke('Logoff', $rootScope.user.userName);
    };
    // direct message
    $scope.ShowPrivateWindow = false;
    $scope.isBroadcastOn = false;
    $scope.UserInPrivateChat = null;
    $scope.PrivateMessages = [];
    $scope.currentprivatemessages = {};
    $scope.pvtmessage = '';

    // opne broadcast window
    $scope.broadcastOn = function () {
        $scope.ShowPrivateWindow = true;
        $scope.isBroadcastOn = true;
        $scope.UserInPrivateChat = { name: "BroadCast To All" };
    };
    // open PrivateMessage($index) window
    $scope.PrivateMessage = function (index) {
        var user = $rootScope.OnlineUsers[index];
        if (user.ConnectionId === connection.id) return;
        $scope.ShowPrivateWindow = true;
        $scope.isBroadcastOn = false;
        $scope.UserInPrivateChat = user;
    };
    $scope.ClosePrivateWindow = function () {
        $scope.ShowPrivateWindow = false;
        $scope.UserInPrivateChat = null;
    };
    $scope.CloseOnlineUserWindow = function () {
        $rootScope.ShowOnlineUserWindow = false;
    };
    $scope.SendPrivateMessage = function () {
            chatHubProxy.invoke('SendPrivateMessage', $scope.UserInPrivateChat.ConnectionId, $scope.pvtmessage);
            $scope.pvtmessage = '';
        };
    chatHubProxy.on('RecievingPrivateMessage', function (fromname, fromcid, msg) {
        if ($scope.ShowPrivateWindow === false) {
            $scope.ShowPrivateWindow = true;
        }
        $scope.PrivateMessages.push({ from: fromname, message: msg });

        if ($rootScope.user.userName !== fromname) // otheruser's pm
        {
            if ($scope.UserInPrivateChat === null) {
                $scope.UserInPrivateChat = { name: fromname, ConnectionId: fromcid };
            }
        }

        // To Scroll the message window.
        if ($("#PrivateChatArea div.panel-body").length === 1) {
            var $container = $("#PrivateChatArea div.panel-body");
            $container[0].scrollTop = $container[0].scrollHeight;
            $container.animate({ scrollTop: $container[0].scrollHeight }, "fast");
        }
        $scope.$evalAsync();
    });

    $scope.SkeyPress = function (e) {
        if (e.which === 13) {
            $scope.SendPrivateMessage();
            $scope.usertyping = '';
        }
        else if (e.which === 46 || e.which === 8) {
            chatHubProxy.invoke('UserTyping', $scope.UserInPrivateChat.ConnectionId, 'Deleting..');
            window.setTimeout(function () {
                $scope.usertyping = '';
            }, 500);
        }
        else {
            chatHubProxy.invoke('UserTyping', $scope.UserInPrivateChat.ConnectionId, 'Typing..');
            window.setTimeout(function () {
                $scope.usertyping = '';
            }, 500);
        }
    };

    $scope.usertyping = '';
    chatHubProxy.on('IsTyping', function (connectionid, msg) {
        if ($scope.UserInPrivateChat !== null)
            $scope.usertyping = msg;
        else
            $scope.usertyping = '';
        $scope.$apply();
        window.setTimeout(function () {
            $scope.usertyping = '';
            $scope.$apply();
        }, 500);
    });

    chatHubProxy.on('StatusChanged', function (connectionId, status) {
        for (let i = 0, len = $rootScope.OnlineUsers.length; i < len; i++) {
            if ($rootScope.OnlineUsers[i].ConnectionId === connectionId) {
                $rootScope.OnlineUsers[i].status = status;
            }
        }
        $scope.$apply();
    });

        $scope.ChangeStatus = function (status) {
            chatHubProxy.invoke('UpdateStatus', status);
            $scope.pvtmessage = '';
        };

}]);
