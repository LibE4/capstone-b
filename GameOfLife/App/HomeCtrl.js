app.controller("HomeCtrl", ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {


    $scope.currentUser = $rootScope.user;

}]);
