angular.module('fastpass', ['firebase', 'ionic', 'fastpass.controllers', 'fastpass.services'])

.run(function($ionicPlatform, authService) {
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

// ui-router https://github.com/angular-ui/ui-router
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tabs.home', {
      url: "/home",
      views: {
        'home-tab': {
          templateUrl: "templates/home.html",
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
          templateUrl: "templates/getDetails.html",
          controller: 'detailController'
        }
      }
    })
    .state('tabs.connection', {
      url: "/connection",
      views: {
        'home-tab': {
          templateUrl: "templates/connection.html",
          controller: 'connectionController'
        }
      }
    })
    .state('tabs.chat', {
      url: "/chat",
      views: {
        'home-tab': {
          templateUrl: "templates/chat.html",
          controller: 'chatController'
        }
      }
    })
    .state('tabs.about', {
      url: "/about",
      views: {
        'about-tab': {
          templateUrl: "templates/about.html"
        }
      }
    })
    .state('tabs.navstack', {
      url: "/navstack",
      views: {
        'about-tab': {
          templateUrl: "templates/nav-stack.html"
        }
      }
    })
    .state('tabs.signin', {
      url: "/signin",
      views: {
        'contact-tab': {
          templateUrl: "templates/signin.html"
        }
      }
    })
    .state('tabs.signout', {
      url: "/signout",
      views: {
        'contact-tab': {
          templateUrl: "templates/signout.html"
        }
      }
    });
   // if any other url is entered go to home page
   $urlRouterProvider.otherwise("/tab/home");
});

