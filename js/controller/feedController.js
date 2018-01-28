angular.module('BooksApp').controller("feedController", ['$scope', function ($scope) {  
    $scope.isAuth = false;
    $scope.listCategory = ["фантастика", "научное", "классика"];
    $scope.viewGroup=function(e, group) {
        $scope.currentGroup = group;
    };

	$scope.loadFeed=function(e,url) {
    };
    
    var token = '';
    $scope.getBooks = function() {
        $.ajax({
              type: "GET",
              url: "http://localhost:3000/books",
              success: function(data) {
                  $scope.listBooks = data.books;
                  console.log($scope.listBooks);
              },
              dataType: "json"
            });
    }
    
    $scope.getBooks();
    
    $scope.checkIn = function(e) {
        $.ajax({
              type: "POST",
              url: "http://localhost:3000/register",
              data: {
                    name: $scope.registerLogin,
                    email: $scope.registerEmail,
                    password: $scope.registerPass,
                    passwordConfirm: $scope.registerConfirmPass
              },
              success: function(data) {
                  token = data.token;
                  $scope.isAuth = true;
                  console.log(token);
              },
              dataType: "json"
            });
    }
    
    $scope.logIn = function(e) {
        $.ajax({
              type: "POST",
              url: "http://localhost:3000/auth",
              data: {
                    email: $scope.logInEmail,
                    password: $scope.logInPass,
              },
              success: function(data) {
                  token = data.token;
                  $scope.isAuth = true;
                  console.log(token);
              },
              dataType: "json"
            });
    }
    
    $scope.LogOut = function(e) {
        token = '';
        $scope.isAuth = false
    }
    
    $scope.addBook = function(e) {  
        console.log(token);
        $.ajax({
              type: "POST",
              headers: {"x-access-token": token},
              url: "http://localhost:3000/books",
              data: {
                    name: $scope.titleNewBook,
                    author: $scope.newBookAuthor,
                    description: $scope.newBookDescription,
                    genre: $scope.selectNewBookCategory
              },
              success: function(data) {
                  $scope.listBooks.push(data);
                  console.log(data);
              },
              dataType: "json"
            });
    };
    
    $scope.saveCurrentFeed = function(feed) {
        $scope.currentFeedId = feed.id;
        $scope.editName = feed.name;
        $scope.editUrl = feed.url;
        $scope.editGroup = feed.group;
    };
    
    $scope.editBook = function() {
    };
    
    $scope.deleteFeed = function(item) {
        for (var i = 0; i < $scope.listRSS.length; i++) {
            if ($scope.listRSS[i].id == item.id) {
                $scope.listRSS.splice(i, 1);
            }
        }
    };
    
    $scope.editMarkerList = function(marker) {
        $scope.currentMarkerGroup = marker;
    };
    
    $scope.deleteGroup = function(index, num) {
    };
    
    $scope.saveReadNews = function(name, flag) {
        if ($scope.listReadNews.indexOf(name) == -1) {
            $scope.listReadNews.push(name);
        }
        return !flag;
    };
}]);
