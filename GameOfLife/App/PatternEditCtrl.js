app.controller("PatternEditCtrl", ["$scope", "$routeParams", "$http", "$location", function ($scope, $routeParams, $http, $location) {
    $scope.pattern = {};
    let PatternId = $routeParams.id;
    $http.get(`/api/pattern/${PatternId}`)
        .then(function (onePattern) {
            $scope.pattern = onePattern.data;
        });

    $scope.saveChange = function () {
        $http.put('/api/pattern', $scope.pattern)
            .then(function (res) {
                $location.url("/pattern/all");
                $scope.pattern = {};
            })
    };
}]);
