angular.module('fastpass.services', ['ionic'])

// factory to setup our firebase connection
// used in listController
.factory('listService', ['$firebase', function($firebase) {
  var ref = new Firebase('https://fastpass-connection.firebaseio.com/');
  return $firebase(ref);
}])

.factory('timerService', function(){

  var lastOfferTime = null;

  var isOfferAfterTimeLimit = function(){
    var currentTime = new Date();
    if (currentTime - lastOfferTime > 1800000 || lastOfferTime === null){
      return true;
    } else{
      return false;
    }
  };

  var setLastOfferTime = function(time){
    lastOfferTime = time;
  };

  return {
    isOfferAfterTimeLimit: isOfferAfterTimeLimit,
    setLastOfferTime: setLastOfferTime
  };
})

.factory('authService', function($firebaseSimpleLogin, $state, $firebase, $ionicLoading, geolocationService) {
  // initializing Firebase simple login helper object
  var ref = new Firebase('https://fastpass-connection.firebaseio.com');
  var auth = $firebaseSimpleLogin(ref);

  // OAuth login: FB / twitter
  var login = function(type) {
    console.log("entered auth service login");

    if (type === 'facebook' || type === 'twitter' || 'google'){
      console.log("attempting auth service login");
      $ionicLoading.show({
        template: 'Loading...'
      });
      auth.$login(type)
      .then(function(user) {
        console.log('Logged in:' + user.displayName);
        console.dir(user);

        var newUser = new Firebase('https://fastpass-connection.firebaseio.com/users/' + user.uid);

        newUser.update({displayName: user.displayName});

        // update user's geolocation position
        geolocationService.updateUserGeolocation(function(){
          console.log("updateUserCallback")
          $ionicLoading.hide();
          $state.go('tabs.home');
        });
      }, function(err) {
        console.log('Login failed: ' + err);
        $ionicLoading.hide();
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
    if (isLoggedIn()){
      auth.$logout();
    }
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

.factory('geolocationService', function($ionicLoading) {

  var disneyLandBoundaries = {
    maxLat: 33.814641,
    minLat: 33.803622,
    maxLng: -117.915745,
    minLng: -117.923684
  };

  // SF testing
  // var hackReactorBoundaries = {
  //   maxLat: 37.784115,
  //   minLat: 37.782903,
  //   maxLong: -122.408381,
  //   minLong: -122.409636
  // };

  var userCoords = {
    lat: 0,
    lng: 0,
  };

  // updates user coord with current geolocation position
  // hard coded numbers for debugging
  var updateUserGeolocation = function(callback){
    console.log("inside updateUserGeo");
    var options = { timeout: 20000, enableHighAccuracy: true, maximumAge: 90000 };
    navigator.geolocation.getCurrentPosition(function(position){
      console.log('inside navigator');
      userCoords.lat = 33.812/*position.coords.latitude*/;
      userCoords.lng = -117.92/*position.coords.longitude*/;
      console.log("updated Lat :" + userCoords.lat + ", updated Lng :" + userCoords.lng)
      callback(position);
    }, function(error){
      console.log("FAIL geolocation: " + error);
      console.dir(error);
      $ionicLoading.hide();
    }, options);
  };

  // checks whether user is within Disneyland
  var inDisneyLand = function(){
    console.log("inside inDisneyLand");
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



