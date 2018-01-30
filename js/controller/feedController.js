angular.module('BooksApp').controller("feedController", ['$scope', '$http', function ($scope, $http) {  
    $scope.isAuth = false;
    $scope.login = "";
    $scope.loginError = false;
    var token = '';
    
    $scope.getBooks = function() {       
        $http({
          method: "GET",
          url: "http://localhost:3000/books",
          dataType: "json" }).then(
          function successCallback(response) {
              
              if(token == '') {
                  $scope.listBooks = response.data.books;
              } else {
                  var list = response.data.books;
                  for (var i = 0; i < list.length; i++) {
                      list[i].favorite = false;
                      list[i].read = false;
                  }
                  
                  var readBooks = [];
                  var favoriteBooks = [];
                  $http({
                      method: "GET",
                      url: "http://localhost:3000/books/reads",
                      headers: {"x-access-token": token},
                      dataType: "json" }).then(
                      function successCallback(response) {
                          readBooks = response.data.books;
                          console.log(readBooks);
                   });
                  
                   $http({
                      method: "GET",
                      url: "http://localhost:3000/books/favorites",
                      headers: {"x-access-token": token},
                      dataType: "json" }).then(
                      function successCallback(response) {
                          favoriteBooks = response.data.books;
                          console.log(favoriteBooks);
 
                          for (var i = 0; i < list.length; i++) {
                              console.log(list[i]);
                              if (readBooks.length > 0) {
                                  for (var j = 0; j < readBooks.length; j++) {
                                      if (list[i]._id == readBooks[j]._id) {
                                          list[i].read = readBooks[j].read;
                                      }
                                  };
                               }

                              for (var k = 0; k < favoriteBooks.length; k++) {
                                  if (list[i]._id === favoriteBooks[k]._id) {
                                      list[i].favorite = favoriteBooks[k].favorite;
                                      console.log(favoriteBooks[k]);
                                  }
                              };
                          }

                          $scope.listBooks = list;
                          
                  });
              }
          });
    }
    
    $scope.getBooks();
    
    $scope.getReadBooks=function(e) {
        $http({
          method: "GET",
          url: "http://localhost:3000/books/reads",
          headers: {"x-access-token": token},
          dataType: "json" }).then(
          function successCallback(response) {
              $scope.listBooks = response.data.books;
              console.log(response);
          });
    };

	$scope.getAllBooks=function(e) {
        $scope.getBooks();
    };
    
    $scope.getFavoritesBooks = function(e) {
        $http({
          method: "GET",
          url: "http://localhost:3000/books/favorites",
          headers: {"x-access-token": token},
          dataType: "json" }).then(
          function successCallback(response) {
              $scope.listBooks = response.data.books;
              console.log(response);
          });
    }

    $scope.checkIn = function(e) {
        $http({
          method: "POST",
          url: "http://localhost:3000/register",
          data:{
            name: $scope.registerLogin,
            email: $scope.registerEmail,
            password: $scope.registerPass,
            passwordConfirm: $scope.registerConfirmPass
          },
          dataType: "json" }).then(
          function successCallback(response) {
              token = response.data.token;
              $scope.login = $scope.registerLogin;
              $scope.isAuth = true;
              $scope.loginError = false;
              $scope.registerLogin = "";
              $scope.registerEmail = "";
              $scope.registerPass = "";
              $scope.registerConfirmPass = "";
              console.log(token);
          }, function error(response) {
              $scope.loginError = true;
              console.log(response);
          });
    }
    
    $scope.logIn = function(e) {     
        $http({
          method: "POST",
          url: "http://localhost:3000/auth",
          data:{
            email: $scope.logInEmail,
            password: $scope.logInPass,
          },
          dataType: "json" }).then(
          function successCallback(response) {
              token = response.data.token;
              $scope.isAuth = true;
              $scope.login = response.data.name;
              $scope.logInEmail = "";
              $scope.logInPass = "";
              $scope.loginError = false;
              $scope.getBooks();
              console.log(token);
          }, function error(response) {
              $scope.loginError = true;
              console.log(response);
          });
    }
    
    $scope.logOut = function(e) {
        token = '';
        $scope.isAuth = false
    }
    
    $scope.addBook = function(e) {
        $http({
          method: "POST",
          headers: {"x-access-token": token},
          url: "http://localhost:3000/books",
          data: {
                name: $scope.titleNewBook,
                author: $scope.newBookAuthor,
                description: $scope.newBookDescription,
                genre: $scope.newBookGenre
          },
          dataType: "json" }).then(
          function successCallback(response) {
              $scope.listBooks.push(response.data);
              $scope.titleNewBook = "";
              $scope.newBookAuthor = "";
              $scope.newBookDescription = "";
              $scope.newBookGenre = "";
              console.log(response);
          });
    };
    
    $scope.saveCurrentBook = function(book) {
        $scope.editBookId = book._id;
        $scope.editBookTitle = book.name;
        $scope.editBookAuth = book.author;
        $scope.editBookDescription = book.description;
        $scope.editBookGenre = book.genre;
    }
    
    $scope.saveEditBook = function(id) {
        $http({
          method: "PUT",
          headers: {"x-access-token": token},
          url: "http://localhost:3000/books/" + id,
          data: {
                name: $scope.editBookTitle,
                author: $scope.editBookAuth,
                description: $scope.editBookDescription,
                genre: $scope.editBookGenre
          },
          dataType: "json" }).then(
          function successCallback(response) {
              console.log(response);
              for (var i = 0; i < $scope.listBooks.length; i++) {
                if ($scope.listBooks[i]._id == id) {
                    $scope.listBooks[i].name = $scope.editBookTitle;
                    $scope.listBooks[i].author = $scope.editBookAuth;
                    $scope.listBooks[i].description = $scope.editBookDescription;
                    $scope.listBooks[i].genre = $scope.editBookGenre;
                 }
              }
          });
    };
    
    $scope.getFavorits = function(id) {
        $http({
          method: "POST",
          url: "http://localhost:3000/books/" + id + "/vaforite",
          headers: {"x-access-token": token},
          dataType: "json" }).then(
          function successCallback(response) {
              for (var i = 0; i < $scope.listBooks.length; i++) {
                if ($scope.listBooks[i]._id == id) {
                    $scope.listBooks[i].favorite = !$scope.listBooks[i].favorite;
              }

          }, function error(response) {
              console.log(response);
          });
    };
    
    $scope.getRead = function(id) {
        $http({
          method: "POST",
          url: "http://localhost:3000/books/" + id + "/read",
          headers: {"x-access-token": token},
          dataType: "json" }).then(
          function successCallback(response) {
              for (var i = 0; i < $scope.listBooks.length; i++) {
                if ($scope.listBooks[i]._id == id) {
                    $scope.listBooks[i].read = !$scope.listBooks[i].read;
              }
          }, function error(response) {
              console.log(response);
          });
    }  
}]);
