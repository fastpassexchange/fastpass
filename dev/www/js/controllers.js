angular.module('fastpass.controllers', ['ionic', 'firebase'])

// need to implement loading feature
// .controller('LoadingCtrl', function($scope, $ionicLoading) {
//   $scope.show = function() {
//     $ionicLoading.show({
//       template: 'Loading...'
//     });
//   };
//   $scope.hide = function(){
//     $ionicLoading.hide();
//   };
// })

//handles functionality relating to what's displayed in logged in user's dashboard
.controller('dashboardController', function($scope, $rootScope, $firebase, authService, listService) {
  // retrieve logged in user's chat partner information
  $scope.chatPartnerArray = [];
  var chatSessions = new Firebase('https://fastpass-connection.firebaseio.com/messages/' + authService.getUserId());
  chatSessions.on('value', function(snapshot) {
    snapshot.forEach(function(elem) {
      $scope.chatPartnerArray.push({
        uid: elem.name(),
        name: elem.child('displayName').val() + " (" + elem.child('offer/ride').val() + ")",
      });
    });
  });

  // for display of logged in user's offers from database
  $scope.usersOffers = new Firebase('https://fastpass-connection.firebaseio.com/users/' + authService.getUserId() + '/offers');
  console.log($scope.usersOffers);
  $scope.usersOffers.on('value', function(snapshot) {
    $scope.offers = snapshot.val();
  });

  //grab all of logged in user's conversations form the database
  $scope.watchedConversations = new Firebase('https://fastpass-connection.firebaseio.com/messages/' + authService.getUserId());
  $scope.watchedConversations.on('value', function(convos) {
    //grab the ID of each conversation
    $scope.pulledConvoIds = convos.val();
  });

  var index = 0;
  var watchedConversations=[];
  
// iterate through each of the conversations
  for (var personImChattingWith in $scope.pulledConvoIds) {
    console.log('personImChattingWith: ', personImChattingWith);
    console.log('index: ', index);
    watchedConversations[index] = new Firebase('https://fastpass-connection.firebaseio.com/messages/' + authService.getUserId() + '/' + personImChattingWith);
      
      $firebase(watchedConversations[index]).$on('child_removed', function(oldChildSnapshot) {
        console.log(oldChildSnapshot);
      });  
    index++;
  }

  //allow logged in user to delete any of the offers they have made by clicking on it in dashboard
  //offer clicked on is passed in
  $scope.deleteOffer = function(offer) {
    //set offer's available property to "false" in both the user's offers AND in the offers section of DB

    //set offer to false in user's offers
    //grab logged in user's offers
    $scope.yourOffers = new Firebase('https://fastpass-connection.firebaseio.com/users/' + authService.getUserId() + '/offers');
    $scope.yourOffers.on('value', function(snapshot) {
      //iterate through offers
      snapshot.forEach(function(offerChild) {
        $scope.offerRef = offerChild.val();
        $scope.offerName = offerChild.name();
        //grab offer in DB that matches offer clicked on
        if ($scope.offerRef.createdAt === offer.createdAt) {
          $scope.selectedOffer = new Firebase('https://fastpass-connection.firebaseio.com/users/' + authService.getUserId() + '/offers/' + $scope.offerName);
          // "delete" the offer from user's dashboard by setting its available property to false; offer is retained in DB
          $firebase($scope.selectedOffer).$update({available: false});
        }
      });
    });

    //set offer to false in offers section of DB
    $scope.offerList = new Firebase('https://fastpass-connection.firebaseio.com/offers/');
    $scope.offerList.on('value', function(snapshot) {
      snapshot.forEach(function(offerChild) {
        $scope.offerRef = offerChild.val();
        $scope.offerName = offerChild.name();
        if ($scope.offerRef.createdAt === offer.createdAt) {
          $scope.selectedOfferInList = new Firebase('https://fastpass-connection.firebaseio.com/offers/' + $scope.offerName);
          $firebase($scope.selectedOfferInList).$update({available: false});
        }
      });
    });
  };

  //grabs interacting with about offers
  $scope.chatRetriever = function (partnerId) {
    //grab all messages between logged in user and user clicked on in dashboard
    $scope.chatSessions3 = new Firebase('https://fastpass-connection.firebaseio.com/messages/' + authService.getUserId() + '/' + partnerId);
    $scope.chatSessions3.on('value', function (snapshot) {
      //reset $rootscope.selected (it also gets set when another user selects an offer from the offers list)
      $rootScope.selected = {};
      //all messages between LIU and other user
      var convoParts = snapshot.val();
      for (var key in convoParts) {
        //in DB, each collection of messages between two users also has an offer key
        //loop through the message keys to find the offer that the two users are interacting about
        if (key === "offer") {
          $rootScope.selected = convoParts[key];
        }
      }
      $rootScope.selected.offererId = partnerId;
    });
  };
})

//controls list of offers
.controller('listController', function($scope, $state, $rootScope, listService, authService) {
  $scope.text = listService;
   // getting object that we click on to see detailed view
  $scope.setMaster = function(offer) {
    // setting this object on the rootscope so that we can access it in the detailed view
    $rootScope.selected = offer;
  };

  $scope.isNotYourOffer = function(offererId) {
    return authService.getUserId() !== offererId;
  };

})

// couldn't get three way data binding to work :(
// .controller('listController', ['$scope', 'listService',
//   function($scope, service) {
//     service.$bind($scope, 'text');
//   }
// ])

.controller('offerController', function($scope, $firebase, authService, timerService) {
  // $scope properties for drop down menus
  $scope.rides = [
    {name: 'Select A Ride', value: ''},
    {name: 'Splash Mountain', value: 'Splash Mountain'},
    {name: 'Space Mountain', value: 'Space Mountain'},
    {name: 'Big Thunder Mountain Railroad', value: 'Big Thunder Mountain Railroad'},
    {name: 'Buzz Lightyear Astro Blasters', value: 'Buzz Lightyear Astro Blasters'},
    {name: 'Haunted Mansion', value: 'Haunted Mansion'},
    {name: 'Indiana Jones', value: 'Indiana Jones'},
    {name: 'Matterhorn Bobsleds', value: 'Matterhorn Bobsleds'},
    {name: 'Star Tours', value: 'Star Tours'},
  ];

  $scope.locations = [
    {name: 'Select Your Current Location', value: ''},
    {name: 'AdventureLand', value: 'Adventureland'},
    {name: 'Critter Country', value: 'Critter Country'},
    {name: 'Fantasyland', value: 'Fantasyland'},
    {name: 'Frontierland', value: 'Frontierland'},
    {name: 'Main Street', value: 'Main Street'},
    {name: 'Mickey\'s Toontown', value: 'Mickey\'s Toontown'},
    {name: 'New Orleans Square', value: 'New Orleans Square'},
    {name: 'Tomorrowland', value: 'Tomorrowland'},
  ];

  $scope.numbers_give = [
    {name: 'Select Number of Passes', value: ''},
    {name: '1 Fastpass', value: '1 Fastpass'},
    {name: '2 Fastpasses', value: '2 Fastpasses'},
    {name: '3 Fastpasses', value: '3 Fastpasses'},
    {name: '4 Fastpasses', value: '4 Fastpasses'},
    {name: '5 Fastpasses', value: '5 Fastpasses'},
  ];

  $scope.comments = [
    {name: 'Select Free or Trade', value: ''},
    {name: 'Free', value: 'Free'},
    {name: 'Trade', value: 'Trade'}
  ];

  var initVars = function() {
    // clear status and error message
    $scope.statusMsg = '';
    $scope.errorMsg = '';

    // initialize offer scope and default values
    $scope.offer = {};
    $scope.offer.ride = '';
    $scope.offer.location = '';
    $scope.offer.number_give = '';
    $scope.offer.comment = '';
  };

  // form validation function
  var isDataValid = function() {
    if ($scope.offer.ride === '') {
      $scope.errorMsg = "Please select a ride.";
      return false;
    }
    if ($scope.offer.location === '') {
      $scope.errorMsg = "Please select your current location.";
      return false;
    }
    if ($scope.offer.number_give === '') {
      $scope.errorMsg = "Please select number of passes.";
      return false;
    }
    if ($scope.offer.comment === '') {
      $scope.errorMsg = "Please select Free or Trade.";
      return false;
    }
    return true;
  };

  // initialize variables
  initVars();

  // when user submits an offer do this
  $scope.addOffer = function() {
    // set a createdAt property that is equal to the current date/time
    $scope.offer.createdAt = new Date();
    $scope.offer.offererId = authService.getUserId();
    $scope.offer.displayName = authService.getDisplayName();
    $scope.offer.available = true;
    $scope.statusMsg = '';
    
    if (isDataValid()) {
      if (timerService.isOfferAfterTimeLimit()){
        // get all offers from the database
        var offerRef = new Firebase('https://fastpass-connection.firebaseio.com/offers');
        // add new offer to the database
        $firebase(offerRef).$add($scope.offer);

        // add to user's offer hash
        var usersOffers = new Firebase('https://fastpass-connection.firebaseio.com/users/' + $scope.offer.offererId + '/offers');
        // add offer hash to logged in users offers hash
        $firebase(usersOffers).$add($scope.offer);

        // update last offer time
        timerService.setLastOfferTime($scope.offer.createdAt);

        // clear input fields of form
        initVars();

        // set status message
        $scope.statusMsg = "New Offer Submitted";
      } else {
        $scope.errorMsg = "Please wait 30 minutes between submitting offers.";
      }
    }
  };
})

//mostly map and geolocation functionality to ensure user is in the park before they can use the app
//TODO: actually use the map to allow users to see other users' locations since we're currently only using geolocation services
.controller('connectionController', function($scope, $firebase, $rootScope, $ionicModal, authService, listService) {
  // reset comment
  $scope.comment = {
    text: ''
  };
  // if(map) {
  //   map.remove();
  // }
  // create map and properties
  var map = L.mapbox.map('map', 'jamesjsdev.io6o2ok3', {
    maxZoom: 18,
    dragging: true,
    touchZoom: true,
    tap: true,
    inertia: true
  });

  // find current location and watch it (track)
  map.locate({setView: true, watch: true, maxZoom: 16});
  // L.control.locate().addTo(map);
  
  // set user connected with to the marker location

  // reference user connected to
  // use $scope.selected.name when not using dummy info
  var connectedUser = "somebody else(user connecting with)";
  // get the lat and long from the database of the user you are connecting to
  var connectedUserLat = new Firebase('https://fastpass-connection.firebaseio.com/users/' + connectedUser + '/location/latitude');
  var connectedUserLng = new Firebase('https://fastpass-connection.firebaseio.com/users/' + connectedUser + '/location/longitude');

  connectedUserLat.on('value', function(snapshot) {
    $scope.connectedUserLat = snapshot.val();
  });

  connectedUserLng.on('value', function(snapshot) {
    $scope.connectedUserLng = snapshot.val();
  });
  
  // put marker on map of the user you are connecting to
  L.marker([$scope.connectedUserLat, $scope.connectedUserLng]).addTo(map);
 
  // intialize lat and long for onLocationFound function
  var latitude = 0;
  var longitude = 0;
  var nextCircles = false;

  var first = true;
  var onLocationFound = function (e) {
    // represents presently logged in user
    var user = 'somebody(logged in user)';
    // create latitude and longitude parameters for logged in user
    var userLat = new Firebase('https://fastpass-connection.firebaseio.com/users/' + user + '/location/latitude');
    var userLng = new Firebase('https://fastpass-connection.firebaseio.com/users/' + user + '/location/longitude');
    // use set instead of add to overwrite any previous values
    $firebase(userLat).$set(e.latitude);
    $firebase(userLng).$set(e.longitude);
    // access properties of the locationfound event
    // latitude = e.latitude;
    // longitude = e.longitude;
    // var distance = e.latlng.distanceTo([latitude, longitude]);
    // console.log(distance);
    // create a circle for display
    // Todo: make circle refresh when location changes
    // if (!nextCircles) {  
      var radius = e.accuracy / 2;
      if (first){
        me = L.circleMarker(e.latlng, radius);
        map.addLayer(me);
        first = false;
      } else{
        map.removeLayer(me);
        me = L.circleMarker(e.latlng, radius);
        map.addLayer(me);
      } 
      // nextCircles = true;
    // } else {
      // circle.update();
      // circle.removeFrom(map);
      // circle.setLatLng(e.latitude, e.longitude);
    // }
  };
 
   // event locationfound will trigger every time the user's position changes
   map.on('locationfound', onLocationFound);

  // unused modal functionality
//   $ionicModal.fromTemplateUrl('templates/my-modal.html', {
//     scope: $scope,
//     animation: 'slide-in-up'
//   }).then(function(modal) {
//     $scope.modal = modal;
//   });

//   $scope.openModal = function() {
//     $scope.modal.show();
//   };
//   $scope.closeModal = function() {
//     $scope.modal.hide();
//   };
//   //Cleanup the modal when we're done with it!
//   $scope.$on('$destroy', function() {
//     $scope.modal.remove();
//   });
//   // Execute action on hide modal
//   $scope.$on('modal.hidden', function() {
//     // Execute action
//   });
//   // Execute action on remove modal
//   $scope.$on('modal.removed', function() {
//     // Execute action
//   });

})

.controller('chatController', function($scope, $rootScope, $timeout, $firebase, listService, authService) {
  // initialize object for message contents
  $scope.comment = {};
  // the name associated with the selected offer
  $scope.to = $rootScope.selected.offererId;
  console.log('selected: ', $rootScope.selected);
  // current logged in user
  $scope.from = authService.getUserId();
  
  var messageRef = new Firebase('https://fastpass-connection.firebaseio.com/messages/' + $scope.from + '/' + $scope.to);
  var otherMessageRef = new Firebase('https://fastpass-connection.firebaseio.com/messages/' + $scope.to + '/' + $scope.from);

  messageRef.on('value', function(snapshot) {
    $scope.userMessages = snapshot.val();
  });
  console.log('userMessages: ', $scope.userMessages);

  $scope.sendComment = function() {
    $scope.comment.createdAt = new Date();
    $scope.comment.senderDisplayName = authService.getDisplayName();
    // add new message to the database
    // todo: refactor with transaction
    $firebase(messageRef).$add($scope.comment);
    $firebase(otherMessageRef).$add($scope.comment);

    $firebase(messageRef).$update({offer: $rootScope.selected, displayName: $rootScope.selected.displayName});
    $firebase(otherMessageRef).$update({offer: $rootScope.selected, displayName: $scope.comment.senderDisplayName});


    $scope.comment.content = '';
    

    // todo: try to use modal for successful send of message
    // $scope.openModal();
  };
})

// log in user
.controller('loginController', function($scope, authService) {
  $scope.validateUser = function(type) {
    authService.login(type);
  };
})

// log out user
.controller('logoutController', function(authService) {
  authService.logout();
})

.controller('HomeTabCtrl', function($scope) {
});
