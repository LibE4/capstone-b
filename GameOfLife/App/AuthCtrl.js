
app.controller("AuthCtrl", function ($scope, $rootScope, $location, $http) {
    $scope.loginContainer = true;
    $scope.registerContainer = false;

    $scope.register = {};
    $scope.register.username = 'b@b.com';
    $scope.register.email = 'b@b.com';
    $scope.register.password = '123456Nss!';
    $scope.register.passwordconfirm = '123456Nss!';
    $scope.login = {};
    $scope.login.email = 'b@b.com';
    $scope.login.username = 'b@b.com';
    $scope.login.password = '123456Nss!';

    if ($location.path() === "/logout") {
        sessionStorage.removeItem('token');
        $http.defaults.headers.common['Authorization'] = "";
        $rootScope = {};
        $location.url("/auth");
    }

    $scope.setLoginContainer = function () {
        $scope.loginContainer = true;
        $scope.registerContainer = false;

    };

    $scope.setRegisterContainer = function () {
        $scope.loginContainer = false;
        $scope.registerContainer = true;

    };

    $scope.registerUser = function (registerNewUser) {
        $http({
            method: 'POST',
            url: "api/Account/Register",
            data: {
                "Email": registerNewUser.username,
                "Password": registerNewUser.password,
                "ConfirmPassword": registerNewUser.passwordconfirm
            }
        })
        .then(function (result) {
            console.log("result", result);
        });
    };

    $scope.loginUser = function (login) {
        $http({
            method: 'POST',
            url: "/Token",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
            },
            data: { grant_type: "password", username: login.username, password: login.password }
        })
        .then(function (result) {
            console.log(result);
            sessionStorage.setItem('token', result.data.access_token);
            $rootScope.user = result.data;
            $http.defaults.headers.common['Authorization'] = `bearer ${result.data.access_token}`;
            $rootScope.connection = $.hubConnection();
            $rootScope.chatHubProxy = $rootScope.connection.createHubProxy('ChatHub');
            $location.url("/base");
        });
    };

});