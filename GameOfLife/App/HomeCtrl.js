app.controller("HomeCtrl", ['$scope', '$rootScope', '$http', '$location', function ($scope, $rootScope, $http, $location) {

    $scope.currentUser = $rootScope.user;
    $scope.worldGame =
    [
      {
          name: "Can Your Creatures Survive?",
          url: "/pattern/all",
          description: "A world under Conway's rules is unforgiving. Any live cell with fewer than two live neighbours dies.  Any live cell with two or three live neighbours lives on. Any live cell with more than three live neighbours dies.  Any dead cell with exactly three live neighbours becomes a live cell."
      },
      {
          name: "Sharpen Your Tetris Skills",
          url: "/tetris",
          description: "Classic Teris rules applied in this game. There is a bonus feature, you can move the piece up! Feel confident about your skill? Live show to your friends!"
      },
      {
          name: "Stay Connected With Friends",
          url: "#/chat",
          description: "Texting! Texting! Texting! Chatting with your friends is fun!"
      }
    ];

    $rootScope.ShowOnlineUserWindow = true;
    $scope.loadLinks = function (link) {
        if (link === "#/chat") {
            $rootScope.ShowOnlineUserWindow = true;
            return;
        }
        $location.url(link);
    }
}]);
