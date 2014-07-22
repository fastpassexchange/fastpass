angular.module('fastpass', ['firebase', 'ionic', 'fastpass.controllers', 'fastpass.services'])

.run(function($ionicPlatform, $rootScope, authService, $state) {
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
  authService.logout();
  // if(window.cookies){
  //   window.cookies.clear(function() {
  //     console.log('Cookies cleared!');
  //   });
  // }
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if (toState.authenticate && !authService.isAuthenticated()){
      // User not authenticated
      console.log("User not authenticated");
      $state.go("tabs.signin").then(function(){
        $rootScope.$broadcast('$stateChangeSuccess');
      });
      event.preventDefault();
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
      authenticate: true,
      views: {
        'home-tab': {
          templateUrl: "templates/passes.html",
          controller: 'listController'
        }
      }
    })
    .state('tabs.offerInput', {
      url: "/offerInput",
      authenticate: true,
      views: {
        'home-tab': {
          templateUrl: "templates/offerInput.html",
          controller: 'offerController'
        }
      }
    })
    .state('tabs.getDetails', {
      url: "/getDetails",
      authenticate: true,
      views: {
        'home-tab': {
          templateUrl: "templates/getDetails.html",
          controller: 'detailController'
        }
      }
    })
    .state('tabs.connection', {
      url: "/connection",
      authenticate: true,
      views: {
        'home-tab': {
          templateUrl: "templates/connection.html",
          controller: 'connectionController'
        }
      }
    })
    .state('tabs.chat', {
      url: "/chat",
      authenticate: true,
      views: {
        'dashboard-tab': {
          templateUrl: "templates/chat.html",
          controller: 'chatController'
        }
      }
    })
    .state('tabs.myOffers', {
      url: "/myOffers",
      authenticate: true,
      views: {
        'dashboard-tab': {
          templateUrl: "templates/myOffers.html",
          controller: "myOffersController"
        }
      }
    })
    .state('tabs.myConvos', {
      url: "/myConvos",
      authenticate: true,
      views: {
        'dashboard-tab': {
          templateUrl: "templates/myConvos.html",
          controller: "myConvosController"
        }
      }
    })
    .state('tabs.dashboard', {
      url: "/dashboard",
      authenticate: true,
      views: {
        'dashboard-tab': {
          templateUrl: "templates/dashboard.html",
          controller: 'dashboardController'
        }
      }
    })
    .state('tabs.signin', {
      url: "/signin",
      views: {
        'signin-tab': {
          templateUrl: "templates/signin.html"
        }
      }
    })
    .state('tabs.signout', {
      url: "/signout",
      views: {
        'signout-tab': {
          templateUrl: "templates/signout.html"
        }
      }
    });
   // if any other url is entered go to home page
   $urlRouterProvider.otherwise("/tab/home");
});

