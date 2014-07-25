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

.controller('myConvosController', function($scope, $rootScope, $ionicLoading, authService) {

  // display page loading overlay while retrieving information from Firebase
  $ionicLoading.show({
    template: '<i class="icon ion-loading-c"></i>'
  });

  // retrieve chat partner information
  $scope.chatPartnerArray = [];
  var chatSessions = new Firebase('https://fastpass-connection.firebaseio.com/messages/' + authService.getUserId());
  chatSessions.on('value', function(snapshot) {
    snapshot.forEach(function(elem) {
      $scope.chatPartnerArray.push({
        uid: elem.name(),
        name: elem.child('displayName').val() + " (" + elem.child('offer/ride').val() + ")",
      });
    });
    $ionicLoading.hide();
  });

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

.controller('myOffersController', function($scope, $ionicLoading, $firebase, authService, $ionicPopup) {

  // display page loading overlay while retrieving information from Firebase
  $ionicLoading.show({
    template: '<i class="icon ion-loading-c"></i>'
  });

  // for display of logged in user's offers from database
  $scope.usersOffers = new Firebase('https://fastpass-connection.firebaseio.com/users/' + authService.getUserId() + '/offers');
  console.log($scope.usersOffers);
  $scope.usersOffers.on('value', function(snapshot) {
    $scope.offers = snapshot.val();
    $ionicLoading.hide();
  });

  //allow logged in user to delete any of the offers they have made by clicking on it in dashboard
  //offer clicked on is passed in
//allow logged in user to delete any of the offers they have made by clicking on it in dashboard
  //offer clicked on is passed in
  $scope.deleteOffer = function(offer) {
    //set offer's available property to "false" in both the user's offers AND in the offers section of DB

   $scope.showConfirm = function() {
       console.log('offer: ', offer);
       var confirmPopup = $ionicPopup.confirm({
       title: 'Delete Offer',
       template: 'Are you sure you want to delete this offer?',
       // buttons: [
       // { type: 'button-stable' },
       // {
       //   // text: '<b>Save</b>',
       //   type: 'button-dark'
       // }

       // buttons: [{
       // //  text: 'Cancel',
       //  type: 'button-stable'
       // } , {
       // //  text: 'OK',
       //  type: 'button-dark'
       // }
       // ]
     });
     confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
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
       } else {
         console.log('You are not sure');
       }
     });
   };

   $scope.showConfirm();


  };
})

//handles functionality relating to what's displayed in logged in user's dashboard
// .controller('dashboardController', function($scope, $rootScope, $firebase, $ionicLoading, authService, listService, $ionicPopup) {
//   $ionicLoading.show({
//     template: '<i class="icon ion-looping"></i>'
//   });

//   // retrieve chat partner information
//   $scope.chatPartnerArray = [];
//   var chatSessions = new Firebase('https://fastpass-connection.firebaseio.com/messages/' + authService.getUserId());
//   chatSessions.on('value', function(snapshot) {
//     snapshot.forEach(function(elem) {
//       $scope.chatPartnerArray.push({
//         uid: elem.name(),
//         name: elem.child('displayName').val() + " (" + elem.child('offer/ride').val() + ")",
//       });
//     });
//   });

//   // for display of logged in user's offers from database
//   $scope.usersOffers = new Firebase('https://fastpass-connection.firebaseio.com/users/' + authService.getUserId() + '/offers');
//   console.log($scope.usersOffers);
//   $scope.usersOffers.on('value', function(snapshot) {
//     $scope.offers = snapshot.val();
//     $ionicLoading.hide();
//   });



//   // $scope.watchedConversations = new Firebase('https://fastpass-connection.firebaseio.com/messages/' + authService.getUserId());
//   // $scope.watchedConversations.on('value', function(convos) {
//   //   $scope.pulledConvoIds = convos.val();
//   // //   console.log('newConversationMessage: ', newConversationMessage);
//   // //   console.log('prevChildName: ', prevChildName);
//   // });

//   // var index = 0;
//   // var watchedConversations=[];

//   // for (var personImChattingWith in $scope.pulledConvoIds) {
//   //   console.log('personImChattingWith: ', personImChattingWith);
//   //   console.log('index: ', index);
//   //   watchedConversations[index] = new Firebase('https://fastpass-connection.firebaseio.com/messages/' + authService.getUserId() + '/' + personImChattingWith);

//   //     $firebase(watchedConversations[index]).$on('child_removed', function(oldChildSnapshot) {
//   //       console.log(oldChildSnapshot);
//   //     });
//   //   index++;
//   // }

//   //allow logged in user to delete any of the offers they have made by clicking on it in dashboard
//   //offer clicked on is passed in
//   $scope.deleteOffer = function(offer) {
//     //set offer's available property to "false" in both the user's offers AND in the offers section of DB

//    $scope.showConfirm = function() {
//        console.log('offer: ', offer);
//        var confirmPopup = $ionicPopup.confirm({
//        title: 'Delete Offer',
//        template: 'Are you sure you want to delete this offer?'
//      });
//      confirmPopup.then(function(res) {
//        if(res) {
//          console.log('You are sure');
//         //set offer to false in user's offers
//         //grab logged in user's offers
//         $scope.yourOffers = new Firebase('https://fastpass-connection.firebaseio.com/users/' + authService.getUserId() + '/offers');
//         $scope.yourOffers.on('value', function(snapshot) {
//           //iterate through offers
//           snapshot.forEach(function(offerChild) {
//             $scope.offerRef = offerChild.val();
//             $scope.offerName = offerChild.name();
//             //grab offer in DB that matches offer clicked on
//             if ($scope.offerRef.createdAt === offer.createdAt) {
//               $scope.selectedOffer = new Firebase('https://fastpass-connection.firebaseio.com/users/' + authService.getUserId() + '/offers/' + $scope.offerName);
//               // "delete" the offer from user's dashboard by setting its available property to false; offer is retained in DB
//               $firebase($scope.selectedOffer).$update({available: false});
//             }
//           });
//         });

//         //set offer to false in offers section of DB
//         $scope.offerList = new Firebase('https://fastpass-connection.firebaseio.com/offers/');
//         $scope.offerList.on('value', function(snapshot) {
//           snapshot.forEach(function(offerChild) {
//             $scope.offerRef = offerChild.val();
//             $scope.offerName = offerChild.name();
//             if ($scope.offerRef.createdAt === offer.createdAt) {
//               $scope.selectedOfferInList = new Firebase('https://fastpass-connection.firebaseio.com/offers/' + $scope.offerName);
//               $firebase($scope.selectedOfferInList).$update({available: false});
//             }
//           });
//         });
//        } else {
//          console.log('You are not sure');
//        }
//      });
//    };

//    $scope.showConfirm();


//   };

//   //grabs interacting with about offers
//   $scope.chatRetriever = function (partnerId) {
//     //grab all messages between logged in user and user clicked on in dashboard
//     $scope.chatSessions3 = new Firebase('https://fastpass-connection.firebaseio.com/messages/' + authService.getUserId() + '/' + partnerId);
//     $scope.chatSessions3.on('value', function (snapshot) {
//       //reset $rootscope.selected (it also gets set when another user selects an offer from the offers list)
//       $rootScope.selected = {};
//       //all messages between LIU and other user
//       var convoParts = snapshot.val();
//       for (var key in convoParts) {
//         //in DB, each collection of messages between two users also has an offer key
//         //loop through the message keys to find the offer that the two users are interacting about
//         if (key === "offer") {
//           $rootScope.selected = convoParts[key];
//         }
//       }
//       $rootScope.selected.offererId = partnerId;
//     });
//   };
// })

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

.controller('offerController', function($scope, $firebase, authService, $state, timerService) {
  // $scope properties for drop down menus
  
  $scope.rides = [
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
  ];

  $scope.passTimeHour = [
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
  ];

  $scope.passTimeMin = [
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
  ];

  $scope.passTimeAmPm = [
    {name: '', value: ''},
    {name: 'AM', value: 'AM'},
    {name: 'PM', value: 'PM'}
  ];

  $scope.locations = [
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

  ];

  $scope.numbers_give = [
    {name: '', value: ''},
    {name: '1 Fastpass', value: '1 Fastpass'},
    {name: '2 Fastpasses', value: '2 Fastpasses'},
    {name: '3 Fastpasses', value: '3 Fastpasses'},
    {name: '4 Fastpasses', value: '4 Fastpasses'},
    {name: '5 Fastpasses', value: '5 Fastpasses'},
  ];

  $scope.comments = [
    {name: '', value: ''},
    {name: 'Free', value: 'free'},
    {name: 'Trade', value: 'trade'}
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
    $scope.offer.time = '';
    
    // model for input time
    $scope.returnTime = '';

  };

  // form validation function
  var isDataValid = function() {
    if ($scope.offer.ride === '') {
      $scope.errorMsg = "Please select a ride.";
      return false;
    }
    if ($scope.offer.time === '') {
      $scope.errorMsg = "Please set a time";
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

  var formatReturnTime = function (time) {
    var newTime = new Date();
    time = time.split(':');

    newTime.setHours(time[0]);
    newTime.setMinutes(time[0]);
    
    return newTime.toUTCString();
  }

  // when user submits an offer do this
  $scope.addOffer = function() {
    
    console.log($scope.returnTime, "time");
   
    $scope.offer.createdAt = new Date();
    $scope.offer.offererId = authService.getUserId();
    $scope.offer.displayName = authService.getDisplayName();
    $scope.offer.available = true;
    $scope.statusMsg = '';
    $scope.offer.time = formatReturnTime($scope.returnTime);
    
    if (isDataValid()) {
      console.log('submitted data is valid');
      if (timerService.isOfferAfterTimeLimit()){
        // get all offers from the database
        var offerRef = new Firebase('https://fastpass-connection.firebaseio.com/offers');
        // add new offer to the database
        $firebase(offerRef).$add($scope.offer);

        // add to user's offer hash
        var usersOffers = new Firebase('https://fastpass-connection.firebaseio.com/users/' + $scope.offer.offererId + '/offers');
        // add offer hash to logged in users offers hash
        $firebase(usersOffers).$add($scope.offer).then(function(ref){
          $state.go('app.myOffers');
        });

        // update last offer time
        timerService.setLastOfferTime($scope.offer.createdAt);

        // clear input fields of form
        initVars();

        // set status message

        $scope.statusMsg = "New Offer Submitted.";
      } else {
        $scope.errorMsg = "Please wait 30 minutes between submitting offers.";
      }
    }
  };
})

.controller('detailController', function($scope, $firebase) {

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

.controller('chatController', function($scope, $rootScope, $ionicScrollDelegate, $ionicLoading, $timeout,$firebase, listService, authService) {
  // initialize object for message contents
  $scope.comment = {};
  // the name associated with the selected offer
  $scope.to = $rootScope.selected.offererId;
  // the name of the person talking to
  $scope.talkingTo = $rootScope.selected.displayName;
  // current logged in user
  $scope.from = authService.getUserId();

  var messageRef = new Firebase('https://fastpass-connection.firebaseio.com/messages/' + $scope.from + '/' + $scope.to);
  var otherMessageRef = new Firebase('https://fastpass-connection.firebaseio.com/messages/' + $scope.to + '/' + $scope.from);

  messageRef.on('value', function(snapshot) {
    $scope.userMessages = snapshot.val();
    // using timeout to set scroll at end of loop.
    $timeout(function () {
      $ionicScrollDelegate.scrollBottom();
    }, 0);
  });

  console.log('userMessages: ', $scope.userMessages);

  $scope.sendComment = function() {
   
    $scope.comment.createdAt = new Date();
    $scope.comment.senderDisplayName = authService.getDisplayName();

    // add new message to the database
    $firebase(messageRef).$add($scope.comment);
    $firebase(otherMessageRef).$add($scope.comment);

    $firebase(messageRef).$update({offer: $rootScope.selected, displayName: $rootScope.selected.displayName});
    $firebase(otherMessageRef).$update({offer: $rootScope.selected, displayName: $scope.comment.senderDisplayName});

    $scope.comment.content = '';  
  };


})

// .controller('scrollController', function($scope, $rootScope, $ionicScrollDelegate, $timeout, $firebase, listService, authService) {

//    $ionicScrollDelegate.scrollBottom();

//   // initialize object for message contents
//   $scope.comment = {};
//   // the name associated with the selected offer
//   $scope.to = $rootScope.selected.offererId;
//   console.log('selected: ', $rootScope.selected);
//   // current logged in user
//   $scope.from = authService.getUserId();

//   var messageRef = new Firebase('https://fastpass-connection.firebaseio.com/messages/' + $scope.from + '/' + $scope.to);
//   var otherMessageRef = new Firebase('https://fastpass-connection.firebaseio.com/messages/' + $scope.to + '/' + $scope.from);

//   messageRef.on('value', function(snapshot) {
//     $scope.userMessages = snapshot.val();
//   });
//   console.log('userMessages: ', $scope.userMessages);





// })

// log in user
.controller('loginController', function($scope, authService) {
  $scope.validateUser = function(type) {
    authService.login(type);
  };
  authService.logout();
})

// // log out user
// .controller('logoutController', function(authService, $state) {
//   authService.logout();
//   $state.go('app.home');
// })

.controller('HomeTabCtrl', function($scope) {
});
