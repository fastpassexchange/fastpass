angular.module('fastpass.controllers', ['ionic'])

.controller('listController', function($scope, listService) {
  listService.$bind($scope, 'text');
})

.controller('HomeTabCtrl', function($scope) {
  console.log('HomeTabCtrl');
});
