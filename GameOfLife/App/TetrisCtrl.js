app.controller("TetrisCtrl", function($scope, $rootScope, $location){
    var thisPlayer = $rootScope.user.username;
    $rootScope.tetris = {};
    const nGridX = 10, nGridY = 20, gridSize = 20;
    // for status of all drawBlocks
    var gameArea = [];
    for (let r = 0; r < nGridY; r++) {
        gameArea[r] = [];
        for (let c = 0; c < nGridX; c++) {
            gameArea[r][c] = null;
        }
    }

    /* Game.js */
    var Game = {};
    Game.canvas = document.getElementById('myTetrisCanvas');
    Game.ctx = myTetrisCanvas.getContext('2d');

    // draw.js
    function drawBlock(dx, dy, color) {
        Game.ctx.fillStyle = color;
        Game.ctx.fillRect(dx * gridSize, dy * gridSize, gridSize, gridSize);
        Game.ctx.strokeRect(dx * gridSize, dy * gridSize, gridSize, gridSize);
    }

    function drawCurrentShape(currentShape) {
        currentShape.dw = currentShape.layout[0].length;
        currentShape.dh = currentShape.layout.length;
        for (let r = 0; r < currentShape.dh; r++) {
            for (let c = 0; c < currentShape.dw; c++) {
                if (currentShape.layout[r][c] === 1) {
                    drawBlock(currentShape.dx + c, currentShape.dy + r, currentShape.color);
                }
            }
        }
    }

    function drawGameArea(gameArea, rowBuildup) {
        for (let r = rowBuildup; r < gameArea.length; r++) {
            for (let c = 0; c < gameArea[0].length; c++) {
                if (gameArea[r][c] !== null) {
                    drawBlock(c, r, gameArea[r][c]);
                }
            }
        }
    }

    var connection = $.hubConnection();
    var tetrisHubProxy = connection.createHubProxy('GameHub');
    tetrisHubProxy.on('updateTetrisInPage', function (currentShape, world, rowBuildup, fromCID) {
        // stop processing if data from other connection id and view window not open
        if (connection.id === fromCID && $scope.playMode
            || connection.id !== fromCID && !$scope.playMode) {
            console.log(connection.id, fromCID);
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
            drawCurrentShape(currentShape);
            drawGameArea(world, rowBuildup);
            $scope.$apply();
        }
    });

    $scope.playMode = true;
    $scope.selfMode = true;

    connection.start().done(function () {
        // Wire up Send button to the server.
        var startGame = function () {
            if ($scope.selfMode) tetrisHubProxy.invoke('StartTetrisSelfGame');
            else tetrisHubProxy.invoke('StartAllTetrisGame');
        };
        var pauseGame = function () {
            tetrisHubProxy.invoke('PauseTetrisGame');
        };
        var stopGame = function () {
            tetrisHubProxy.invoke('StopTetrisGame');
        };
        var closeplayMode = function () {
            $scope.playMode = false;
            tetrisHubProxy.invoke('StopTetrisGame');
        };
        var sendAction = function (action) {
            tetrisHubProxy.invoke('storeAction', action);
        }

        $scope.changeMode = function () {
            stopGame();
            $scope.selfMode = !$scope.selfMode;
        };
        $scope.goView = function () {
            stopGame();
            $scope.playMode = false;
            Game.canvas = document.getElementById('viewTetrisCanvas');
            Game.ctx = viewTetrisCanvas.getContext('2d');
        };
        $scope.goPlay = function () {
            $scope.playMode = true;
            Game.canvas = document.getElementById('myTetrisCanvas');
            Game.ctx = myTetrisCanvas.getContext('2d');
        };
        // Keyboard Controls
        window.onkeydown = function () {
            if (event.keyCode === 13) {
                startGame(); //new game
            } else if (event.keyCode === 80) {
                pauseGame();
            } else if (event.keyCode === 78) {
                pauseGame();
                startGame(); //new game
            } else {
                sendAction(event.keyCode);
            }
        };
    });


});