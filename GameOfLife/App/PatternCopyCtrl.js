
app.controller("PatternBigcopyCtrl", ['$scope', '$http', '$location', '$rootScope', function ($scope, $http, $location, $rootScope) {
    let pattern_input = [], nGridX = 50, nGridY = 50;
    let gridSize = 8, startOffsetX = 5, startOffsetY = 5;
    $scope.runMode = false;
    $scope.paused = false;
    let n = 50;

    var worldArr = [];
    for (let r = 0; r < nGridY; r++) {
        worldArr[r] = [];
        for (let c = 0; c < nGridX; c++) {
            worldArr[r][c] = 0;
        }
    }

    // to create grids for pattern input
    let displayElement = document.getElementById("ttt");
    var createGame = function (n) {
        displayElement.innerHTML = "";
        for (let i = 1, gridSize = 99 / n; i <= n * n; i++) {
            let productElement = document.createElement("div");
            productElement.style.width = gridSize + "%";
            productElement.style.height = gridSize + "%";
            productElement.setAttribute("id", `grid-${i}`);
            productElement.className = "blocks";
            displayElement.appendChild(productElement);
        }
    };
    createGame(n);

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
        for (let i = 1; i <= n * n; i++) {
            let targetEmt = document.getElementById(`grid-${i}`);
            targetEmt.innerHTML = "";
            targetEmt.style.color = "";
            targetEmt.style.backgroundColor = "";
        }
    };

    $scope.loadPattern = function () {
        getInputPosition();
        $scope.runMode = true;
        $scope.viewMode = false;
        if (pattern_input.length > 0) {
            pattern_input.forEach(function (cell) {
                let match = cell.match(/\d+/g);
                let x = parseInt(match[0]);
                let y = parseInt(match[1]);
                worldArr[x + startOffsetX][y + startOffsetY] = 1;
            }
            );
        }
        Game.canvas = document.getElementById('myBigCanvas');
        Game.ctx = myBigCanvas.getContext('2d');
        Game.run();
    };

    $scope.inputShow = false;
    $scope.initSave = function () {
        $scope.inputShow = true;
    };
    $scope.cancelSave = function () {
        $scope.inputShow = false;
    };

    $scope.isValid = true;
    $scope.savePattern = function () {
        if ($scope.patternName !== "" || pattern_input.length === 0) {
            $http.get('/api/pattern')
                .then(function (res) {
                    for (var i = 0, len = res.data.length; i < len; i++) {
                        if ($scope.patternName === res.data.Name) break;
                        if (i === len - 1) {
                            getInputPosition();
                            console.log("save", pattern_input);
                            $http.post('/api/pattern', { "Name": $scope.patternName, "newPatternDetail": pattern_input })
                                .then(function (res) {
                                    $scope.newPattern = {};
                                    pattern_input = [];
                                    $location.url("/pattern/all");
                                });
                        }
                    }
                });
        }
        $scope.isValid = false;
        setTimeout(function () {
            $scope.isValid = true;
            $scope.$apply();
        }, 2000);
    };

    function getInputPosition() {
        pattern_input = [];
        for (let i = 1; i <= n * n; i++) {
            let targetEmt = document.getElementById(`grid-${i}`);
            if (targetEmt.innerHTML === "x") {
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
                pattern_input.push(`(${x},${y})`);
            }
        }
    }

    /* Game.js */
    var Game = {};
    Game.canvas = document.getElementById('myBigCanvas');
    Game.ctx = myBigCanvas.getContext('2d');

    Game.run = function () {
        // Clear the canvas.
        Game.ctx.fillStyle = "black";
        Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);

        // draw vertical helping lines
        Game.ctx.setLineDash([2, 18]);
        Game.ctx.strokeStyle = '#CCCECB';
        for (let i = 1; i < nGridX; i++) {
            Game.ctx.beginPath();
            Game.ctx.moveTo(i * gridSize, 0);
            Game.ctx.lineTo(i * gridSize, 500);
            Game.ctx.stroke();
            Game.ctx.beginPath();
            Game.ctx.moveTo(0, i * gridSize);
            Game.ctx.lineTo(500, i * gridSize);
            Game.ctx.stroke();
        }
        Game.ctx.setLineDash([]);
        Game.ctx.strokeStyle = 'black';

        // Draw code goes here.
        drawGameArea(worldArr);
    };

    // draw.js
    function drawBlock(dx, dy, color) {
        Game.ctx.fillStyle = color;
        Game.ctx.fillRect(dx * gridSize, dy * gridSize, gridSize, gridSize);
        Game.ctx.strokeRect(dx * gridSize, dy * gridSize, gridSize, gridSize);
    }

    function drawGameArea(worldArr) {
        for (let r = 0; r < worldArr.length; r++) {
            for (let c = 0; c < worldArr[0].length; c++) {
                if (worldArr[r][c] === 1) {
                    drawBlock(c, r, "green");
                }
            }
        }
    }

    var connection = $.hubConnection();
    var gameHubProxy = connection.createHubProxy('GameHub');
    gameHubProxy.on('addNewGameDataToPage', function (world, fromCID) {
        // stop processing if data from other connection id and view window not open
        if ((connection.id == fromCID && $scope.runMode)
            || (connection.id != fromCID && $scope.viewMode)) {
            // Clear the canvas.
            Game.ctx.fillStyle = "black";
            Game.ctx.fillRect(0, 0, Game.canvas.width, Game.canvas.height);
            // draw vertical helping lines
            Game.ctx.setLineDash([2, 18]);
            Game.ctx.strokeStyle = '#CCCECB';
            for (let i = 1; i < nGridX; i++) {
                Game.ctx.beginPath();
                Game.ctx.moveTo(i * gridSize, 0);
                Game.ctx.lineTo(i * gridSize, 500);
                Game.ctx.stroke();
                Game.ctx.beginPath();
                Game.ctx.moveTo(0, i * gridSize);
                Game.ctx.lineTo(500, i * gridSize);
                Game.ctx.stroke();
            }
            Game.ctx.setLineDash([]);
            Game.ctx.strokeStyle = 'black';
            drawGameArea(world);
            $scope.$apply();
        }
    });

    connection.start().done(function () {
        // Wire up Send button to the server.
        $scope.startGame = function () {
            $scope.paused = false;
            getInputPosition(); // collect input pattern
            if ($scope.selfMode) gameHubProxy.invoke('StartSelfGame', $rootScope.patternDetails);
            else gameHubProxy.invoke('StartAllGame', $rootScope.patternDetails);
        };
        $scope.pauseGame = function () {
            $scope.paused = !$scope.paused;
            gameHubProxy.invoke('PauseGame');
        };
        $scope.stopGame = function () {
            $scope.paused = false;
            gameHubProxy.invoke('StopGame');
        };
        $scope.closeRunMode = function () {
            $scope.runMode = false;
            gameHubProxy.invoke('StopGame');
        };
    });

    $scope.selfMode = true;
    $scope.viewMode = false;
    $scope.changeMode = function () {
        $scope.selfMode = !$scope.selfMode;
    };
    $scope.viewShow = function () {
        Game.canvas = document.getElementById('viewCanvas');
        Game.ctx = viewCanvas.getContext('2d');
        $scope.viewMode = true;
        $scope.runMode = false;
    };
    $scope.closeViewMode = function () {
        $scope.viewMode = false;
    };
}]);
