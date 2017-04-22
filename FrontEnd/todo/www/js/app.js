// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl',
    cache:false
})
  .state('viewpoi', {
    url: '/viewpoi',
    templateUrl: 'templates/viewpoi.html',
    controller: 'viewpoiCtrl',
    cache:false
  })
  .state('location', {
    url: '/location',
    templateUrl: 'templates/location.html',
    controller: 'locationCtrl',
    cache:false
  })
  .state('POIdetail', {
    url: '/POIdetail',
    templateUrl: 'templates/POIdetail.html',
    controller: 'POIdetailCtrl',
    cache:false
  })
  .state('sourceReport', {
    url: '/sourceReport',
    templateUrl: 'templates/sourceReport.html',
    controller: 'sourceReportCtrl',
    cache:false
  })
  .state('main', {
    url: '/',
    abstract: true,
    templateUrl: 'templates/main.html'
  })
  .state('sourceReportList', {
    url: '/sourceReportList',
    templateUrl: 'templates/sourceReportList.html',
    controller: 'sourceReportListCtrl',
  })
  .state('map', {
    url: '/map',
    templateUrl: 'templates/map.html',
    controller: 'MapCtrl'
  })
  .state('main.dash', {
    url: 'main/dash',
    views: {
        'dash-tab': {
          templateUrl: 'templates/dashboard.html',
          controller: 'DashCtrl'
        }
    }
  })

  .state('main.location', {
    url: 'main/location',
    views: {
      'dash-tab': {
        templateUrl: 'templates/location.html'
      }
    }
  })

  .state('main.public', {
    url: 'main/public',
    views: {
        'public-tab': {
          templateUrl: 'templates/public.html'
        }
    }
  })
  .state('main.admin', {
    url: 'main/admin',
    views: {
        'admin-tab': {
          templateUrl: 'templates/admin.html'
        }
    },

  });
  $urlRouterProvider.otherwise(function ($injector, $location) {
    var $state = $injector.get("$state");
    $state.go("login");
  });
})