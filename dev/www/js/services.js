angular.module('fastpass.services', ['ionic'])

// factory to setup our firebase connection
// used in listController
.factory('listService', ['$firebase', function($firebase) {
  var ref = new Firebase('https://fastpass-connection.firebaseio.com/');
  return $firebase(ref);
}])

.factory('formService', [function() {

}])

.factory('authService', function($firebaseSimpleLogin, $location) {
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
    }, function(err) {
      console.log('Login failed: ' + err);
    });
  };

  // verify user object exists in auth object
  var isLoggedIn = function() {
    return auth.user !== null;
  };

  // verify user and redirect based on authentication state
  var checkSession = function() {
    if (!this.isLoggedIn()) {
      console.log('User logged out');
      $location.path('/tabs/signin');
    }
    console.log('User authenticated: ' + auth.user.email + '(' + auth.user.uid + ')');
  };

  // TODO remove debugging code
  var loginTestUser = function() {
    var testuser = 'fastpassuser@fastpassdomain.com';
    var testpass = 'fastpasspass';
    login(testuser, testpass);
  };

  // return factory interface
  return {
    login: login,
    isLoggedIn: isLoggedIn,
    checkSession: checkSession,
    loginTestUser: loginTestUser
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



