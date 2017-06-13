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
        // Wire up Send button to call NewChatMessage on the server.
        $scope.sendMsg = function () {
        console.log("send");
        chatHubProxy.invoke('ChatMessage', $rootScope.user.userName, $scope.message);
        };
    });

    // chat login
    $scope.OnlineUsers = [];
    $scope.currentUser = $rootScope.user;
    connection.start().done(function () {
        console.log($rootScope.user.userName);
        chatHubProxy.invoke('Login', $rootScope.user.userName);
    });
    chatHubProxy.on('GetOnlineUsers', function (onlineUsers) {
        $scope.OnlineUsers = $.parseJSON(onlineUsers);
        console.log("ddd", $scope.OnlineUsers);
        $scope.$apply();
    });
    chatHubProxy.on('NewOnlineUser', function (user) {
        console.log("aa", user);
        $scope.OnlineUsers.push(user);
        $scope.$apply();
    });

    // direct message
    $scope.ShowPrivateWindow = false;
    $scope.UserInPrivateChat = null;
    $scope.PrivateMessages = [];
    $scope.currentprivatemessages = {};
    $scope.pvtmessage = '';

    // open PrivateMessage($index) window
    $scope.PrivateMessage = function (index) {
        var user = $scope.OnlineUsers[index];
        $scope.ShowPrivateWindow = true;
        $scope.UserInPrivateChat = user;
        console.log($scope.OnlineUsers);
    };
    $scope.ClosePrivateWindow = function () {
        $scope.ShowPrivateWindow = false;
        $scope.UserInPrivateChat = null;
    };
    connection.start().done(function () {
        $scope.SendPrivateMessage = function () {
            console.log("send: ", $scope.pvtmessage);
            chatHubProxy.invoke('SendPrivateMessage', $scope.UserInPrivateChat.ConnectionId, $scope.pvtmessage);
            $scope.pvtmessage = '';
        };
    });
    chatHubProxy.on('RecievingPrivateMessage', function (fromname, fromcid, msg) {
        console.log("received");
        console.log(fromname, msg);
        if ($scope.ShowPrivateWindow === false) {
            $scope.ShowPrivateWindow = true;
        }
        $scope.PrivateMessages.push({ from: fromname, message: msg });
        console.log($scope.PrivateMessages);

        if ($scope.currentUser.userName !== fromname) // otheruser's pm
        {
            if ($scope.UserInPrivateChat === null) {
                $scope.UserInPrivateChat = { name: fromname, ConnectionId: fromcid };
            }
        }

        // To Scroll the message window.
        //if ($("#PrivateChatArea div.panel-body").length === 1) {
        //    var $container = $("#PrivateChatArea div.panel-body");
        //    $container[0].scrollTop = $container[0].scrollHeight;
        //    $container.animate({ scrollTop: $container[0].scrollHeight }, "fast");
        //}
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
            console.log("outside", msg);
        $scope.$apply();
        window.setTimeout(function () {
            $scope.usertyping = '';
            $scope.$apply();
        }, 500);
    });

    connection.start().done(function () {
        $scope.ChangeStatus = function (status) {
            chatHubProxy.invoke('UpdateStatus', status);
            $scope.pvtmessage = '';
        };
    });

    chatHubProxy.on('StatusChanged', function (connectionId, status) {
        $.each($scope.OnlineUsers, function (i) {
            if ($scope.OnlineUsers[i].ConnectionId === connectionId) {
                $scope.OnlineUsers[i].status = status;
            }
        });
        $scope.$apply();
    });

}]);
