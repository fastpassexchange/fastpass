angular.module('fastpass.controllers', [])

.controller('listController', function($scope, listService) {
  listService.$bind($scope, 'text');
}
);

// .controller('DashCtrl', function($scope) {
// })

// .controller('FriendsCtrl', function($scope, Friends) {
//   $scope.friends = Friends.all();
// })

// .controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
//   $scope.friend = Friends.get($stateParams.friendId);
// })

// .controller('AccountCtrl', function($scope) {
// });
