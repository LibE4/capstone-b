
app.controller("GameCtrl", function ($rootScope, $scope) {

    $rootScope.pattern_input = [], nGridX = 50, nGridY = 50;
    let gridSize = 10, startX = 20, startY = 20;
    
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
    };
    
    $scope.stopGame = function () {
        pauseGame = true;
    };
    
    function getInputPosition() {
        let n = 9;
        $rootScope.pattern_input = [];
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
                $rootScope.pattern_input.push(`(${x},${y})`);
            }
        }
    }
    
    /* Game.js */
    var Game = {};
    Game.canvas = document.getElementById('myCanvas');
    Game.ctx = myCanvas.getContext('2d');
    
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
    gameHubProxy.on('addNewGameDataToPage', function (world) {
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
    });

    connection.start().done(function () {
        // Wire up Send button to the server.
        $scope.startGame = function () {
            getInputPosition(); // collect input pattern
            gameHubProxy.invoke('StartGame', $rootScope.pattern_input);
        };
    });
});



