angular.module('fastpass.controllers', ['ionic', 'firebase'])

// log in user
.controller('loginController', function($scope, authService) {
  $scope.validateUser = function(type) {
    authService.login(type);
  };
})



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
