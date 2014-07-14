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

.controller('listController', function($scope, $state, $rootScope, listService) {
  $scope.text = listService;
   // getting object that we click on to see detailed view
   $scope.setMaster = function(section) {
    // setting this object on the rootscope so that we can access it in the detailed view
    $rootScope.selected = section;
    console.log($scope.selected);
  };
})

// couldn't get three way data binding to work :(
// .controller('listController', ['$scope', 'listService',
//   function($scope, service) {
//     service.$bind($scope, 'text');
//   }
// ])

.controller('offerController', function($scope, $firebase, formService, authService) {

  // verify that user is logged in
  authService.checkSession();

  $scope.offer = {};
  // $scope properties for drop down menus
  $scope.rides = [
    'splash mountain',
    'space mountain',
    'big thunder mountain railroad',
    'buzz lightyear astro blasters',
    'haunted mansion',
    'indiana jones',
    'matterhorn bobsleds',
    'star tours'
  ];

  $scope.locations = [
    'current location: adventureland',
    'current location: critter country',
    'current location: fantasyland',
    'current location: frontierland',
    'current location: main street',
    'current loctation: mickey\'s toontown',
    'current location: new orleans square',
    'current location: tomorrowland'
  ];

  $scope.numbers_give = [
    '1 fastpass',
    '2 fastpasses',
    '3 fastpasses',
    '4 fastpasses',
    '5 fastpasses'
  ];

  $scope.comments = [
    'free',
    'trade',
  ];

  // set default properties for drop down menus
  $scope.offer.ride = $scope.rides[0];
  $scope.offer.location = $scope.locations[0];
  $scope.offer.number_give = $scope.numbers_give[0];
  $scope.offer.comment = $scope.comments[0];

  // when user submits an offer do this
  $scope.addOffer = function() {
    // set a createdAt property that is equal to the current date/time
    $scope.offer.createdAt = new Date();
    // get all offers from the database
    var offerRef = new Firebase('https://fastpass-connection.firebaseio.com/offers');
    // add new offer to the database
    $firebase(offerRef).$add($scope.offer);
    // clear input fields of form
    $scope.offer = {
      name: '',
      ride: '',
      number_give: '',
      location: '',
      comment: ''
    };
  };
})

.controller('detailController', function($scope, $firebase) {


})

.controller('connectionController', function($scope, $firebase, $rootScope, $ionicModal, authService) {
  // verify that user is logged in
  // authService.checkSession();      

  // handle messages to/from users
  $scope.comment = {
    text: ''
  };

  // var map = L.mapbox.map('map', 'jamesjsdev.io6o2ok3', {
  //   maxZoom: 18,
  //   dragging: true
  // });
  // console.log(map);
  // map.locate({setView: true, maxZoom: 16});
 
  $scope.sendComment = function() {
    console.log($scope.comment.text);
    $scope.comment.text = '';
    console.log($scope.comment.text);
    // try to use modal for successful send of message
    // $scope.openModal();
  };

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

.controller('chatController', function($scope, $rootScope, $timeout, $firebase, listService) {
  // initialize object for message contents
  $scope.comment = {};
  // the name asociated of the selected offer
  $scope.to = $rootScope.selected.name;
  // current logged in user 'james'
  $scope.from = "James";
  var messageRef = new Firebase('https://fastpass-connection.firebaseio.com/messages/' + $scope.from + '/' + $scope.to);
  var otherMessageRef = new Firebase('https://fastpass-connection.firebaseio.com/messages/' + $scope.to + '/' + $scope.from);

  messageRef.on('value', function(snapshot) {
    $scope.userMessages = snapshot.val();
  });

  $scope.sendComment = function() {
    $scope.comment.createdAt = new Date();
    // add new message to the database
    // todo: refactor with transaction
    $firebase(messageRef).$add($scope.comment);

    $firebase(otherMessageRef).$add($scope.comment);

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
  console.log('HomeTabCtrl');
});
