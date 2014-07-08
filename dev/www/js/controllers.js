angular.module('fastpass.controllers', ['ionic', 'firebase'])

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
  // $scope.isSelected = function(section) {
  //   return $scope.selected === section;
  // };
})

// couldn't get three way data binding to work :(
// .controller('listController', ['$scope', 'listService',
//   function($scope, service) {
//     service.$bind($scope, 'text');
//   }
// ])

.controller('offerController', function($scope, $firebase, formService) {
  $scope.offer = {};
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
  $scope.offer.ride = $scope.rides[0];

  $scope.addOffer = function() {
    $scope.offer.createdAt = new Date();
    console.log($scope.offer);
    var offerRef = new Firebase('https://fastpass-connection.firebaseio.com/offers');
    //delete $scope.offer.rides;
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
  $scope.comment = {
    text: ''
  };

  $scope.sendComment = function() {
    console.log($scope.comment.text);
    $scope.comment.text = '';
    console.log($scope.comment.text);
    // $scope.openModal();
  };

    $ionicModal.fromTemplateUrl('my-modal.html', {
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

// .controller('adminController', function($scope) {
//   $scope.setMaster = function(section) {
//     $scope.selected = section;
//   };
//   $scope.isSelected = function(section) {
//     return $scope.selected === section;
//   };
// })
// 

.controller('loginController', function($scope, $firebase) {
  $scope.user = {
    email: '',
    password: ''
  };
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
