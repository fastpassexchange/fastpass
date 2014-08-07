angular.module('fastpass.services', ['ionic'])

// factory to setup our firebase connection
// used in listController
.factory('listService', ['$firebase', '$ionicLoading', function($firebase, $ionicLoading) {
  $ionicLoading.show({
    template: '<i class="icon ion-loading-c"></i>'
  });
  var ref = new Firebase('https://fastpass-connection.firebaseio.com/offers/');
  ref.on('value', function() {
    $ionicLoading.hide();
  });

  return $firebase(ref);
}])

.factory('giveFastPassService', function(){
  return {
    rides: [
      {name: '', value: ''},
      {name: 'Splash Mountain', value: 'Splash Mountain'},
      {name: 'Space Mountain', value: 'Space Mountain'},
      {name: 'Thunder Mtn Railroad', value: 'Thunder Mtn Railroad'},
      {name: 'Indiana Jones', value: 'Indiana Jones'},
      {name: 'Star Tours', value: 'Star Tours'},
      {name: 'Autopia', value: 'Autopia'},
      {name: 'Car Toon Spin', value: 'Car Toon Spin'},
      {name: 'Cal Screamin', value: 'Cal Screamin'},
      {name: 'Sky School', value: 'Sky School'},
      {name: 'Grizzly River Run', value: 'Grizzly River Run'},
      {name: 'Radiator Racers', value: 'Radiator Racers'},
      {name: 'Soarin Over CA', value: 'Soarin Over Cal'},
      {name: 'Tower Of Terror', value: 'Tower Of Terror'}
    ],

    locations: [
      {name: '', value: ''},
      {name: 'AdventureLand', value: 'Adventureland'},
      {name: 'Critter Country', value: 'Critter Country'},
      {name: 'Fantasyland', value: 'Fantasyland'},
      {name: 'Frontierland', value: 'Frontierland'},
      {name: 'Main Street', value: 'Main Street'},
      {name: 'Toontown', value: 'Toontown'},
      {name: 'New Orleans Square', value: 'New Orleans Square'},
      {name: 'Tomorrowland', value: 'Tomorrowland'},
      {name: 'Condor Flats', value: 'Condor Flats'},
      {name: 'Buena Vista', value: 'Buena Vista'},
      {name: 'Hollywood', value: 'Hollywood'},
      {name: 'Grizzy Peak', value: 'Grizzy Peak'},
      {name: 'Bug\'s Land', value: 'Bug\'s Land'},
      {name: 'Paradise Pier', value: 'Paradise Pier'},
      {name: 'Pacific Wharf', value: 'Pacific Wharf'},
      {name: 'Car\'s Land', value: 'Car\'s Land'},
    ],

    numbers_give: [
      {name: '', value: ''},
      {name: '1 Fastpass', value: '1 Fastpass'},
      {name: '2 Fastpasses', value: '2 Fastpasses'},
      {name: '3 Fastpasses', value: '3 Fastpasses'},
      {name: '4 Fastpasses', value: '4 Fastpasses'},
      {name: '5 Fastpasses', value: '5 Fastpasses'},
    ],

    comments: [
      {name: '', value: ''},
      {name: 'Free', value: 'Free'},
      {name: 'Trade', value: 'Trade'}
    ]
  };
})

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

    if (type === 'facebook' || type === 'twitter' || 'google'){
      $ionicLoading.show({
        template: '<i class="icon ion-loading-c"></i>'
      });
      auth.$login(type)
      .then(function(user) {
        console.dir(user);

        var newUser = new Firebase('https://fastpass-connection.firebaseio.com/users/' + user.uid);

        newUser.update({displayName: user.displayName});
        $ionicLoading.hide();
        $state.go('app.getPass');
      }, function(err) {
        $ionicLoading.hide();
      });
    }else{
      $state.go('app.home');
    }
  };

  // log out current user
  var logout = function() {
    if(window.cookies){
      window.cookies.clear(function() {
      });
    }
    if (isLoggedIn()){
      auth.$logout();
    }
  };

  var isAuthenticated = function() {
    return isLoggedIn();
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

  // Disneyland boundaries
  var disneyLandBoundaries = {
    maxLat: 33.814641,
    minLat: 33.803622,
    maxLng: -117.915745,
    minLng: -117.923684
  };

  // // HR boundaries for testing
  var hackReactorBoundaries = {
    maxLat: 38,
    minLat: 37,
    maxLng: -121,
    minLng: -123
  };

  var userCoords = {
    lat: 0,
    lng: 0,
  };

  // updates user coord with current geolocation position
  // hard coded numbers for debugging
  var updateUserGeolocation = function(callback){
    var options = { timeout: 20000, enableHighAccuracy: true, maximumAge: 90000 };
    navigator.geolocation.getCurrentPosition(function(position){
      userCoords.lat = /*33.812*/position.coords.latitude;
      userCoords.lng = /*-117.92*/position.coords.longitude;
      callback(position);
    }, function(error) {
      $ionicLoading.hide();
    }, options);
  };

  // checks whether user is within Disneyland
  var inDisneyLand = function(){
    // set boundaries
    var boundaries = disneyLandBoundaries;
    return true;
    if (boundaries.minLat < userCoords.lat &&
      userCoords.lat < boundaries.maxLat &&
      boundaries.minLng < userCoords.lng &&
      userCoords.lng < boundaries.maxLng){
      return true;
    } else{
      // for testing purposes
      return true;
      // return false;
    }
  };

  return {
    updateUserGeolocation: updateUserGeolocation,
    inDisneyLand: inDisneyLand,
  };

})
.factory('conversationsFactory', function ($firebase) {
  var currentUser = {};
  var conversations = {};
  // set currentUser
  var setCurrentUser = function (user) {
    currentUser = user;
  }

  var sendMessage = function (to) {
  }

  var addConversation = function (partner) {
    var messageRef = new Firebase('https://fastpass-connection.firebaseio.com/messages/' + $scope.from + '/' + partner);
    conversations[partner] = messagesRef;    
  }

  var trackConversation = function (partner) {

  }
  return {
    'setUser' : setCurrentUser,
    'send'  : sendMessage,
    'addConversation' : addConversation

  };
});