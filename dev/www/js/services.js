angular.module('fastpass.services', ['ionic'])

// factory to setup our firebase connection
// used in listController
.factory('listService', ['$firebase', '$ionicLoading', function($firebase, $ionicLoading) {
  $ionicLoading.show({
    // template: '<i class="icon ion-looping"></i>'
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
      {name: 'Roger Rabbit', value: 'Roger Rabbit'},
      {name: 'California Screamin', value: 'California Screamin'},
      {name: 'Goofy\'s Sky School', value: 'Goofy\'s Sky School'},
      {name: 'Grizzly River Run', value: 'Grizzly River Run'},
      {name: 'Radiator Racers', value: 'Radiator Racers'},
      {name: 'Soarin Over CA', value: 'Soarin Over CA'},
      {name: 'Tower Of Terror', value: 'Tower Of Terror'}
    ],

    passTimeHour: [
      {name: 'Hour', value: ''},
      {name: '1', value: '1'},
      {name: '2', value: '2'},
      {name: '3', value: '3'},
      {name: '4', value: '4'},
      {name: '5', value: '5'},
      {name: '6', value: '6'},
      {name: '7', value: '7'},
      {name: '8', value: '8'},
      {name: '9', value: '9'},
      {name: '10', value: '10'},
      {name: '11', value: '11'},
      {name: '12', value: '12'}
    ],

    passTimeMin: [
      {name: '', value: ''},
      {name: '00', value: '00'},
      {name: '05', value: '05'},
      {name: '10', value: '10'},
      {name: '15', value: '15'},
      {name: '20', value: '20'},
      {name: '25', value: '25'},
      {name: '30', value: '30'},
      {name: '35', value: '35'},
      {name: '40', value: '40'},
      {name: '45', value: '45'},
      {name: '50', value: '50'},
      {name: '55', value: '55'}
    ],

    passTimeAmPm: [
      {name: '', value: ''},
      {name: 'AM', value: 'AM'},
      {name: 'PM', value: 'PM'}
    ],

    locations: [
      {name: '', value: ''},
      {name: 'AdventureLand', value: 'Adventureland'},
      {name: 'Critter Country', value: 'Critter Country'},
      {name: 'Fantasyland', value: 'Fantasyland'},
      {name: 'Frontierland', value: 'Frontierland'},
      {name: 'Main Street', value: 'Main Street'},
      {name: 'Mickey\'s Toontown', value: 'Mickey\'s Toontown'},
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
      {name: 'Downtown Disney', value: 'Downtown Disney'},
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
      {name: 'Free', value: 'free'},
      {name: 'Trade', value: 'trade'}
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
      console.log("attempting auth service login");
      $ionicLoading.show({
        template: '<i class="icon ion-loading-c"></i>'
      });
      auth.$login(type)
      .then(function(user) {
        console.log('Logged in:' + user.displayName);
        console.dir(user);

        var newUser = new Firebase('https://fastpass-connection.firebaseio.com/users/' + user.uid);

        newUser.update({displayName: user.displayName});

        // update user's geolocation position
        geolocationService.updateUserGeolocation(function(){
          console.log("updateUserCallback");
          $ionicLoading.hide();
          $state.go('app.getPass');
        });
      }, function(err) {
        console.log('Login failed: ' + err);
        $ionicLoading.hide();
      });
    }else{
      console.log('Unrecognized login type');
      $state.go('app.home');
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
    console.log("inside updateUserGeo");
    var options = { timeout: 20000, enableHighAccuracy: true, maximumAge: 90000 };
    navigator.geolocation.getCurrentPosition(function(position){
      console.log('inside navigator');
      userCoords.lat = /*33.812*/position.coords.latitude;
      userCoords.lng = /*-117.92*/position.coords.longitude;
      console.log("updated Lat :" + userCoords.lat + ", updated Lng :" + userCoords.lng);
      callback(position);
    }, function(error) {
      console.log("FAIL geolocation: " + error);
      console.dir(error);
      $ionicLoading.hide();
    }, options);
  };

  // checks whether user is within Disneyland
  var inDisneyLand = function(){
    console.log("inside inDisneyLand");
    // set boundaries
    var boundaries = hackReactorBoundaries;
    if (boundaries.minLat < userCoords.lat &&
      userCoords.lat < boundaries.maxLat &&
      boundaries.minLng < userCoords.lng &&
      userCoords.lng < boundaries.maxLng){
      console.log('insideBoundaries true');
      return true;
    } else{
      console.log('insideBoundaries false');
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