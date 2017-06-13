app.controller("PatternAllCtrl", ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {
    $scope.items = [];
    $rootScope.patternDetails = [];

    let getItems = function () {
        $http.get('/api/pattern')
            .then(function (res) {
                $scope.items = res.data;
            });
    }
    getItems();

    $scope.deleteItem = function (itemId) {
        $http.delete(`/api/patterndetail/${itemId}`)
            .then(function (res) {
                $http.delete(`/api/pattern/${itemId}`)
                    .then(function (res) {
                        getItems();
                    });
            });
    };

    $scope.loadItem = function (item) {
        $http.get(`api/patterndetail/${item.Id}`)
            .then(function (res) {
                $rootScope.patternDetails = [];
                for (var i = 0, len = res.data.length; i < len; i++) {
                    $rootScope.patternName = item.Name;
                    $rootScope.patternDetails.push(res.data[i].Coordinate);
                    $location.url("/pattern/big");
                }
            });
    }
}]);
