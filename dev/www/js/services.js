angular.module('fastpass.services', ['ionic'])

// factory to setup our firebase connection
// used in listController
.factory('listService', ['$firebase', function($firebase) {
  var ref = new Firebase('https://fastpass-connection.firebaseio.com/');
  return $firebase(ref);
}])

.factory('formService', [function() {

}])

.factory('authService', function($firebaseSimpleLogin, $state) {
  // initializing Firebase simple login helper object
  var ref = new Firebase('https://fastpass-connection.firebaseio.com');
  var auth = $firebaseSimpleLogin(ref);

  // TODO research navigation delay until async promise resolves
  // submit email and password for authentication
  var login = function(email, password) {
    auth.$login('password', {
      email: email,
      password: password
    }).then(function(user) {
      console.log('Logged in:' + user.email);
      $state.go('tabs.home');
    }, function(err) {
      console.log('Login failed: ' + err);
      $state.go('tabs.signin');
    });
  };

  // log out current user
  var logout = function() {
    auth.$logout();
  };

  // verify user object exists in auth object
  var isLoggedIn = function() {
    return auth.user !== null;
  };

  // verify user and redirect based on authentication state
  var checkSession = function() {
    if (!isLoggedIn()) {
      console.log('User logged out');
      $state.go('tabs.signin');
    } else {
      console.log('User authenticated: ' + auth.user.email + '(' + auth.user.uid + ')');
    }
  };

  // return factory interface
  return {
    login: login,
    logout: logout,
    checkSession: checkSession,
  };
});



// leftover tutorial junk
// .factory('Friends', function() {
//   // Might use a resource here that returns a JSON array

//   // Some fake testing data
//   var friends = [
//     { id: 0, name: 'Scruff McGruff' },
//     { id: 1, name: 'G.I. Joe' },
//     { id: 2, name: 'Miss Frizzle' },
//     { id: 3, name: 'Ash Ketchum' }
//   ];

//   return {
//     all: function() {
//       return friends;
//     },
//     get: function(friendId) {
//       // Simple index lookup
//       return friends[friendId];
//     }
//   };
// });



