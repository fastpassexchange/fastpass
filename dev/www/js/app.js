angular.module('fastpass', ['firebase', 'ionic', 'fastpass.controllers', 'fastpass.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "tabs.html"
    })
    .state('tabs.home', {
      url: "/home",
      views: {
        'home-tab': {
          templateUrl: "home.html",
          controller: 'HomeTabCtrl'
        }
      }
    })
    .state('tabs.getPass', {
      url: "/getPass",
      views: {
        'home-tab': {
          templateUrl: "templates/passes.html",
          controller: 'listController'
        }
      }
    })
    .state('tabs.offerInput', {
      url: "/offerInput",
      views: {
        'home-tab': {
          templateUrl: "templates/offerInput.html",
          controller: 'offerController'
        }
      }
    })
    .state('tabs.getDetails', {
      url: "/getDetails",
      views: {
        'home-tab': {
          templateUrl: "getDetails.html",
          controller: 'detailController'
        }
      }
    })
    .state('tabs.connection', {
      url: "/connection",
      views: {
        'home-tab': {
          templateUrl: "connection.html",
          controller: 'connectionController'
        }
      }
    })
    .state('tabs.about', {
      url: "/about",
      views: {
        'about-tab': {
          templateUrl: "about.html"
        }
      }
    })
    .state('tabs.navstack', {
      url: "/navstack",
      views: {
        'about-tab': {
          templateUrl: "nav-stack.html"
        }
      }
    })
    .state('tabs.contact', {
      url: "/contact",
      views: {
        'contact-tab': {
          templateUrl: "contact.html"
        }
      }
    });


   $urlRouterProvider.otherwise("/tab/home");

});

