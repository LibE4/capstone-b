app.controller("PatternNewCtrl", ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {
    $scope.newPattern = {};
    $scope.newPattern.name = "PP";
    $rootScope.pattern_input = []

    // to create grids
    let displayElement = document.getElementById("ttt");
    var createGame = function (n) {
        displayElement.innerHTML = "";
        for (let i = 1, gridSize = 95 / n; i <= n * n; i++) {
            let productElement = document.createElement("div");
            productElement.style.width = gridSize + "%";
            productElement.style.height = gridSize + "%";
            productElement.setAttribute("id", `grid-${i}`);
            productElement.className = "blocks";
            displayElement.appendChild(productElement);
        }
    };
    createGame(9);

    // process events
    $scope.handleEvents = function () {
        if (event.target.innerHTML === "") {
            event.target.innerHTML = "x";
            event.target.style.color = "black";
            event.target.style.backgroundColor = "black";
        } else {
            event.target.innerHTML = "";
            event.target.style.color = "";
            event.target.style.backgroundColor = "";
        }
    };

    $scope.clearInput = function () {
        let n = 9;
        for (let i = 1; i <= n * n; i++) {
            let targetEmt = document.getElementById(`grid-${i}`);
            targetEmt.innerHTML = "";
            targetEmt.style.color = "";
            targetEmt.style.backgroundColor = "";
        }
    }

    function getInputPosition() {
        let n = 9;
        $rootScope.pattern_input = [];
        for (let i = 1; i <= n * n; i++) {
            let targetEmt = document.getElementById(`grid-${i}`);
            if (targetEmt.innerHTML == "x") {
                //get index of current item
                let blockIndex = i;
                let arr = [];
                let x = 0, y = 0;
                for (let i = 0; i < n; i++) {
                    arr[i] = [];
                    for (let j = 0; j < n; j++) {
                        arr[i][j] = i * n + j + 1;
                        if (arr[i][j] === blockIndex) {
                            x = i;
                            y = j;
                        }
                    }
                }
                $rootScope.pattern_input.push(`(${x},${y})`);
            }
        }
    }

    $scope.savePattern = function () {
        console.log("save")
        $http.post('/api/pattern', { "Name": $scope.newPattern.name })
            .then(function (res) {
                //$location.url("/items/list");
                $scope.newPattern = {};
            })
    };
}]);
