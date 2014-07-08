angular.module('fastpass.controllers', ['ionic'])

.controller('listController', function($scope, $state, listService) {
  $scope.text = listService;
  // the following line does not work, why?
  // service.$bind($scope, "text");
  $scope.addOffer = function() {
    // add details from form to database
    // $scope.text.$add({});
    // $scope.text
  };
})

.controller('formController', function($scope, formService) {
  
})

.controller('HomeTabCtrl', function($scope) {
  console.log('HomeTabCtrl');
});
