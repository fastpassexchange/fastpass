angular.module('fastpass.filters', [])

// Given a user id in the format (facebook|google):[uid], this function returns
// an URL for the profile picture, which can be used later on to display an
// avatar.
.filter('avatar', [function () {
  return function (input) {
    input = input.split(':');
    if (input[0] === 'facebook') {
      return 'http://graph.facebook.com/' + input[1] + '/picture';
    } // else if (input[0] === 'google') {
    //   return '../img/mickey.png';
    // }
  };
}])

// Given a user id in the format (facebook|google):[uid], this function returns
// an URL pointing to the social profile of the user (Facebook or Google).
.filter('profile', [function () {
  return function (input) {
    input = input.split(':');
    if (input[0] === 'facebook') {
      return 'http://facebook.com/' + input[1];
    } else if (input[0] === 'google') {
      return 'https://plus.google.com/u/0/' + input[1] + '/posts';
    }
  };
}])

// Filter out offers that are not available (available set to false or expired).
.filter('available', [function () {
  return function (offers) {
    var available = [];
    angular.forEach(offers, function (offer) {
      // Filter out offers that are older than one hour.
      var ageInSeconds = moment().utc().unix() - moment(offer.time).unix();
      // console.log(JSON.stringify(offer), 'Age in seconds', ageInSeconds);
      var ageInHours = ageInSeconds/3600;
      // console.log(JSON.stringify(offer), 'Age in hours', ageInHours);
      if (offer.available && ageInHours <= 1) {
        available.push(offer);
      }
    });
    return available;
  };
}])

// Exclude all the offers made by this specific user.
.filter('excludeMyOffers', ['authService', function (authService) {
  return function (offers) {
    var byOthers = [];
    angular.forEach(offers, function (offer) {
      if (authService.getUserId() !== offer.offererId) {
        byOthers.push(offer);
      }
    });
    return byOthers;
  };
}])

// Extract rides for drop down box.
.filter('uniqueRides', [function () {
  return function (offers) {
    var rides = {};
    angular.forEach(offers, function (offer) {
      rides[offer.ride] = true;
    });
    return Object.keys(rides);
  };
}])

// Extract rides for drop down box.
.filter('ago', [function () {
  return function (timestamp) {
    return moment(timestamp).fromNow();
  };
}]);
