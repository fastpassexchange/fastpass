angular.module('fastpass', ['ionic', 'fastpass.controllers', 'firebase', 'fastpass.services', 'fastpass.filters'])

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
      $state.go("app.home").then(function(){
        $rootScope.$broadcast('$stateChangeSuccess');
      });
      event.preventDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
    })

    .state('app.home', {
      url: "/home",
      views: {
        'menuContent': {
          templateUrl: "templates/home.html",
          controller: 'HomeTabCtrl'
        }
      }
    })

    .state('app.getDetails', {
      url: "/getDetails",
      authenticate: true,
      views: {
        'menuContent': {
          templateUrl: "templates/getDetails.html",
          controller: 'detailController'
        }
      }
    })

    .state('app.getPass', {
      url: "/getPass",
      authenticate: true,
      views: {
        'menuContent': {
          templateUrl: "templates/passes.html",
          controller: 'listController'
        }
      }
    })

    .state('app.myConvos', {
      url: "/myConvos",
      authenticate: true,
      views: {
        'menuContent': {
          templateUrl: "templates/myConvos.html",
          controller: "myConvosController"
        }
      }
    })

    .state('app.myOffers', {
      url: "/myOffers",
      authenticate: true,
      views: {
        'menuContent': {
          templateUrl: "templates/myOffers.html",
          controller: "myOffersController"
        }
      }
    })

    .state('app.offerInput', {
      url: "/offerInput",
      authenticate: true,
      views: {
        'menuContent': {
          templateUrl: "templates/offerInput.html",
          controller: 'offerController'
        }
      }
    })


    .state('app.chat', {
      url: "/chat",
      authenticate: true,
      views: {
        'menuContent': {
          templateUrl: "templates/chat.html",
          controller: 'chatController'
        }
      }
    })

    .state('app.about', {
      url: "/about",
      authenticate: true,
      views: {
        'menuContent': {
          templateUrl: "templates/about.html",
        }
      }
    })

    .state('app.signout', {
      url: "/signout",
      views: {
        'menuContent': {
          templateUrl: "templates/signout.html"
        }
      }
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});

