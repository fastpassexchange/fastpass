angular.module('fastpass.controllers', ['ionic'])

.controller('listController', function($scope, $state, listService) {
  $scope.text = listService;

})

.controller('HomeTabCtrl', function($scope) {
  console.log('HomeTabCtrl');
});
