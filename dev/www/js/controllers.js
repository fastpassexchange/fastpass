angular.module('fastpass.controllers', ['ionic', 'firebase'])

.controller('chatController', function($scope, $rootScope, $ionicScrollDelegate, $timeout, $firebase, listService, authService) {
  // initialize object for message contents
  $scope.comment = {};
  // the name associated with the selected offer
  $scope.to = $rootScope.selected.offererId;
  console.log('selected: ', $rootScope.selected);

  // current logged in user
  $scope.from = authService.getUserId();
  
  var messageRef = new Firebase('https://fastpass-connection.firebaseio.com/messages/' + $scope.from + '/' + $scope.to);
  var otherMessageRef = new Firebase('https://fastpass-connection.firebaseio.com/messages/' + $scope.to + '/' + $scope.from);

  messageRef.on('value', function(snapshot) {
    $scope.userMessages = snapshot.val();
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
    //refactor to use $transaction not working yet
    // $firebase(messageRef).$transaction(function(currentData) {
    //   return {offer: $rootScope.selected, displayName: $rootScope.selected.displayName};
    // });
    // $firebase(otherMessageRef).$transaction(function(currentData) {
    //   return {offer: $rootScope.selected, displayName: $scope.comment.senderDisplayName};
    // });

    $scope.comment.content = '';
    

    // todo: try to use modal for successful send of message
    // $scope.openModal();
    

    // $ionicScrollDelegate.scrollBottom();
  };

})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})
