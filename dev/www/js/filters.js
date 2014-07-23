angular.module('fastpass.filters', [])

.filter('profilePicture', ['$http', function ($http) {
  return function (input) {
    input = input.split(':');
    if (input[0] === 'facebook') {
      return 'http://graph.facebook.com/' + input[1] + '/picture';
    } else if (input[0] === 'google') {
      return '#';
    }
  };
}])

.filter('profile', [function () {
  return function (input) {
    input = input.split(':');
    if (input[0] === 'facebook') {
      return 'http://facebook.com/' + input[1];
    } else if (input[0] === 'google') {
      return 'https://plus.google.com/u/0/' + input[1] + '/posts';
    }
  };
}]);
