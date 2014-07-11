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

.controller('offerController', function($scope, $firebase, formService) {
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
    'sell for $10',
    'sell for $20',
    'sell for $30',
    'sell for $40',
    'sell for $50',
    'sell for $60',
    'sell for $70',
    'sell for $80',
    'sell for $90',
    'sell for $100',
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

.controller('connectionController', function($scope, $firebase, $rootScope, $ionicModal) {
 
  // unused modal functionality
  $ionicModal.fromTemplateUrl('templates/my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

})

.controller('chatController', function($scope) {
  $scope.sendComment = function() {
    console.log($scope.comment.text);
    $scope.comment.text = '';
    console.log($scope.comment.text);
    // try to use modal for successful send of message
    // $scope.openModal();
  };
 // handle messages to/from users
  $scope.comment = {
    text: ''
  };
})

.controller('loginController', function($scope, $firebase) {
  $scope.user = {
    email: '',
    password: ''
  };
  // use this tutorial for firebase simple login, give option for FB or Twitter
  // http://www.sitepoint.com/creating-firebase-powered-end-end-ionic-application
  $scope.validateUser = function() {
    console.log($scope.user);
    $scope.user = {
      email: '',
      password: ''
    };
  };

})

.controller('HomeTabCtrl', function($scope) {
  console.log('HomeTabCtrl');
});
