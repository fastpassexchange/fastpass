angular.module('fastpass.services', ['ionic'])

// factory to setup our firebase connection
// used in listController
.factory('listService', ['$firebase', function($firebase) {
  var ref = new Firebase('https://fastpass-connection.firebaseio.com/');
  return $firebase(ref);
}])

.factory('formService', [function() {

}])

.factory('authService', function($firebaseSimpleLogin, $state, $firebase, $ionicLoading, geolocationService) {
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

        // update user's geolocation position
        geolocationService.updateUserGeolocation();

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

  var isAuthenticated = function() {
    console.log("Inside isAuthenticated");
    return isLoggedIn() && geolocationService.inDisneyLand();
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
    isAuthenticated: isAuthenticated,
    login: login,
    logout: logout,
    getUserId: getUserId,
    getDisplayName: getDisplayName,
    getProvider: getProvider
  };
})

.factory('geolocationService', function() {

  var disneyLandBoundaries = {
    maxLat: 33.814641,
    minLat: 33.810112,
    maxLng: -117.915745,
    minLng: -117.923899
  };

  // SF testing
  // var hackReactorBoundaries = {
  //   maxLat: 33.814641,
  //   minLat: 33.810112,
  //   maxLong: -117.915745,
  //   minLong: -117.923899
  // };

  var userCoords = {
    lat: 0,
    lng: 0,
  };

  // updates user coord with current geolocation position
  // hard coded numbers for debugging
  var updateUserGeolocation = function(){
    navigator.geolocation.getCurrentPosition(function(position){
      userCoords.lat = 33.812/*position.coords.latitude*/;
      userCoords.lng = -117.92/*position.coords.longitude*/;
      console.log("updated Lat :" + userCoords.lat + ", updated Lng :" + userCoords.lng)
    });
  };

  // checks whether user is within Disneyland
  var inDisneyLand = function(){
    console.log("inside inDisneyLand")
    if (disneyLandBoundaries.minLat < userCoords.lat &&
      userCoords.lat < disneyLandBoundaries.maxLat &&
      disneyLandBoundaries.minLng < userCoords.lng &&
      userCoords.lng < disneyLandBoundaries.maxLng){
      console.log('inDisneyLand true');
      return true;
    } else{
      console.log('inDisneyLand false');
      return false;
    }
  };

  return {
    updateUserGeolocation: updateUserGeolocation,
    inDisneyLand: inDisneyLand,
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



