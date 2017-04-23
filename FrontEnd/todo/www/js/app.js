// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'angular.filter', 'angularjs-datetime-picker'])

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
   .state('POIreports', {
    url: '/POIreports',
    templateUrl: 'templates/POIreports.html',
    controller: 'POIreportsCtrl',
    cache:false
  })
  .state('viewPOI', {
    url: '/viewPOI',
    templateUrl: 'templates/viewPOI.html',
    controller: 'viewPOICtrl',
    cache:false
  })
  .state('adminPendingData', {
    url: '/adminPendingData',
    templateUrl: 'templates/adminPendingData.html',
    controller: 'adminPendingDataCtrl',
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
  .state('addData', {
    url: '/addData',
    templateUrl: 'templates/addData.html',
    controller: 'addDataCtrl'
  })
  .state('dash', {
    url: '/dash',
    templateUrl: 'templates/dashboard.html',
    controller: 'DashCtrl',
    cache:false
  })
  .state('Admin', {
    url: '/admin',
    templateUrl: 'templates/admin.html',
    controller: 'adminCtrl',
    cache:false
  });
  $urlRouterProvider.otherwise(function ($injector, $location) {
    var $state = $injector.get("$state");
    $state.go("login");
  });
})
