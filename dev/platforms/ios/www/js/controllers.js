angular.module('fastpass.controllers', ['ionic', 'firebase'])

.controller('myConvosController', function($scope, $rootScope, $ionicLoading, authService) {
   
  // default message when no conversations shown
  $scope.defaultMsg = "You currently have no active conversations.  Initiate a conversation by selecting an offer under \"Get Fastpass\" or submit an offer under \"Give Fastpass\" and see who contacts you.";
  // display page loading overlay while retrieving information from Firebase
  $ionicLoading.show({
    template: '<i class="icon ion-loading-c"></i>'
  });

  // retrieve chat partner information
  var chatSessions = new Firebase('https://fastpass-connection.firebaseio.com/messages/' + authService.getUserId());
  chatSessions.on('value', function(snapshot) {
    $scope.chatPartnerArray = [];
    snapshot.forEach(function(elem) {
      console.log('convos names', elem.name());
      $scope.chatPartnerArray.push({
        uid: elem.name(),
        name: elem.child('displayName').val() + " (" + elem.child('offer/ride').val() + ")",
      });
      console.log('$scope.chatPartnerArray', $scope.chatPartnerArray);
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

  // initiate default message for when no offers are shown
  $scope.defaultMsg = "You currently have no offers submitted.  Go to \"Give Fastpass\" to submit an offer.";
  // display page loading overlay while retrieving information from Firebase
  $ionicLoading.show({
    template: '<i class="icon ion-loading-c"></i>'
  });

  // for display of logged in user's offers from database
  $scope.usersOffers = new Firebase('https://fastpass-connection.firebaseio.com/users/' + authService.getUserId() + '/offers');
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

.controller('offerController', function($scope, $firebase, authService, $state, timerService, giveFastPassService) {
  // $scope properties for drop down menus
  $scope.rides = giveFastPassService.rides;
  $scope.locations = giveFastPassService.locations;
  $scope.numbers_give = giveFastPassService.numbers_give;
  $scope.comments = giveFastPassService.comments;

  var initVars = function() {
    // clear status and error message
    $scope.statusMsg = 'You can only submit one offer every 30 minutes.';
    $scope.errorMsg = '';

    // initialize offer scope and default values
    $scope.offer = {};
    $scope.offer.ride = '';
    $scope.offer.location = '';
    $scope.offer.number_give = '';
    $scope.offer.comment = '';
    $scope.offer.time = new Date();
  };

  var checkTime = function(time) {
      var ageInSeconds = moment().utc().unix() - moment(time).unix();
      var ageInHours = ageInSeconds/3600;
      console.log('ageInHours', ageInHours);
      return ageInHours >= 1;
  };

  // form validation function
  var isDataValid = function() {
    if ($scope.offer.ride === '') {
      $scope.errorMsg = "Please select a ride.";
      return false;
    }
    if ($scope.offer.time === '' || checkTime($scope.offer.time)) {
      $scope.errorMsg = "Please set a valid time";
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

  var formatTime = function (time) {
    var newTime = new Date();
    time = time.split(':');

    newTime.setHours(time[0]);
    newTime.setMinutes(time[1]);
    newTime.setSeconds(0);

    return newTime.toISOString();
  };

  // when user submits an offer do this
  $scope.addOffer = function() {

    $scope.offer.createdAt = new Date();
    $scope.offer.offererId = authService.getUserId();
    $scope.offer.displayName = authService.getDisplayName();
    $scope.offer.available = true;
    $scope.statusMsg = '';


    if (isDataValid()) {
      // need to format time because, angular stores the information as a string
      // in format 'hh:mm', which is why it needs to be converted to UTC string.
      $scope.offer.time = formatTime($scope.offer.time);
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
    $scope.userMessages = $scope.userMessages || {};
    $scope.userMessagesBefore = $scope.userMessages || {};

    for (var key in snapshot.val()) {
      if (!$scope.userMessages[key]) {
        $scope.userMessages[key] = snapshot.val()[key];
      }
    }

    // using timeout to set scroll at end of loop.
    // $timeout(function () {
      $ionicScrollDelegate.scrollBottom();
    // }, 0);
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

// log in user
.controller('loginController', function($scope, authService) {
  $scope.validateUser = function(type) {
    authService.login(type);
  };
  authService.logout();
});
