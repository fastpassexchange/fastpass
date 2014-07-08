angular.module('fastpass.controllers', ['ionic', 'firebase'])

.controller('listController', function($scope, $state, listService) {
  $scope.text = listService;
  // the following line does not work, why?
  // service.$bind($scope, "text");
  // $scope.addOffer = function() {
  //   // add details from form to database
  //   // $scope.text.$add({});
  //   // $scope.text
  // };
})

// .controller('listController', ['$scope', 'listService',
//   function($scope, service) {
//     service.$bind($scope, 'text');
//   }
// ])

.controller('offerController', function($scope, $firebase, formService) {
  $scope.offer = {};
  $scope.addOffer = function() {
    $scope.offer.createdAt = new Date();
    console.log($scope.offer);
    var offerRef = new Firebase('https://fastpass-connection.firebaseio.com/offers');
    $firebase(offerRef).$add($scope.offer);
  };
})

.controller('HomeTabCtrl', function($scope) {
  console.log('HomeTabCtrl');
});
