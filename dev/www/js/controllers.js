angular.module('fastpass.controllers', ['ionic', 'firebase'])

.controller('listController', function($scope, $state, listService) {
  $scope.text = listService;
 
})

// couldn't get three way data binding to work :(
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

.controller('HomeTabCtrl', function($scope) {
  console.log('HomeTabCtrl');
});
