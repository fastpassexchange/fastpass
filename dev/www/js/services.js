angular.module('fastpass.services', ['ionic'])

// factory to setup our firebase connection
// used in listController
.factory('listService', ['$firebase', function($firebase) {
  var ref = new Firebase('https://fastpass-connection.firebaseio.com/');
  return $firebase(ref);
}])

.factory('formService', [function() {

}])

.factory('authService', function($firebaseSimpleLogin, $state, $firebase, $ionicLoading) {
  // initializing Firebase simple login helper object
  var ref = new Firebase('https://fastpass-connection.firebaseio.com');
  var auth = $firebaseSimpleLogin(ref);

  // OAuth login: FB / twitter
  var login = function(type) {
    console.log("entered auth service login");

    //console.log('window.cookies: ', window.cookies);
    //console.log('window.cookie: ', window.cookie);
    console.dir(document.cookie);
    //console.log('document.cookies: ', document.cookies);

    if(document.cookie !== undefined){
      // document.cookie.clear(function() {
        console.log('Cookies cleared!');
        // document.cookie = name + '=;expires=Thu, 05 Oct 1990 00:00:01 GMT;';
      // });
    }

    if (type === 'facebook' || type === 'twitter'){
      console.log("attempting auth service login");
      $ionicLoading.show({
        template: 'Loading...'
      });
      auth.$login(type)
      .then(function(user) {
        console.log('Logged in:' + user.displayName);
        console.dir(user);

        var newUser = new Firebase('https://fastpass-connection.firebaseio.com/users/' + user.uid);

        newUser.set({displayName: user.displayName});

        $ionicLoading.hide();
        $state.go('tabs.home');
      }, function(err) {
        console.log('Login failed: ' + err);
        $ionicLoading.hide();
        $state.go('tabs.signin');
      });
      console.log("crappy async bug");
    }else{
      console.log('Unrecognized login type');
      $state.go('tabs.signin');
    }
  };

  // log out current user
  var logout = function() {
    if(window.cookies){
      window.cookies.clear(function() {
      console.log('Cookies cleared!');
    });
}
    auth.$logout();
  };

  // verify user object exists in auth object
  var isLoggedIn = function() {
    return auth.user !== null;
  };

  // getter for user uid
  var getUserId = function() {
    return auth.user.uid;
  };

  // getter for user display name
  var getDisplayName = function() {
    return auth.user.displayName;
  };

  var getProvider = function() {
    return auth.user.provider;
  };

  // return factory interface
  return {
    isLoggedIn: isLoggedIn,
    login: login,
    logout: logout,
    getUserId: getUserId,
    getDisplayName: getDisplayName,
    getProvider: getProvider
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



