  angular.module('starter')
  .service('userData', function () {
      var user_data = {};
      return {
          getUserData: function () {
              return user_data;
          },
          setUserData: function (value) {
              user_data = value;
          }
      };

  })
  .controller('AppCtrl', ['$rootScope', '$state', function($rootScope, $state) {
      $rootScope.goBack = function() {
             $state.go('dash');
      };
  }])

  .controller('POIreportsCtrl', ['$rootScope', '$state', function($rootScope, $state) {
    var request = $.post("http://localhost:3000/api/poi/list", {});
    request.done(function( msg ) {
      $scope.pendingData = msg;
    }).fail(function( msg ) {
        alert("Could not get poi list");
    });
  }])


  .controller('viewPOICtrl', ['$state', '$scope', function($$state,  $scope) {
    $scope.data = {
      "location_name": null ,
      "city": null ,
      "state": null ,
      "zip": null ,
      "flagged": null ,
      "date_flagged_start" :null ,
      "date_flagged_end" : null 
    }
    $scope.flagged = 0;
    $scope.querySuccess = 0;
    $scope.applyFilter = function() {
      var request = $.post("http://localhost:3000/api/poi/list", $scope.data);
        request.done(function( msg ) {
        $scope.poiInfo = msg;
      }).fail(function( msg ) {
          alert("Could not get poi list");
      });
    }

    $scope.resetFilter = function() {
      for (var key in $scope.data) {
        if ($scope.data.hasOwnProperty(key)) {
          $scope.data[key] = null;
        }
        $scope.flagged = 0;
      }
    }
  }])

  .controller('locationCtrl', ['$rootScope', '$state', '$scope', function($rootScope, $state, $scope) {
    $scope.location;
    $scope.city;
    $scope.state;
    $scope.zip;


  }])

  .controller('adminCtrl', ['$rootScope', '$state', function($rootScope, $state) {

  }])

  .controller('LoginCtrl', ['$scope', 'WaterApp','$state', '$ionicPopup', '$ionicModal', 'userData', function($scope, WaterApp, $state, $ionicPopup, $ionicModal) {
    $scope.data = {
        "username": "",
        "password": "",
        "pass_confirm": "",
        "email": "",
        "usertype": "",
        "city":"",
        "state":"",
        "title":""
    }

    $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openModal = function() {
        $scope.modal.show();
        $scope.showStates = 0;
        //$scope.states = ["OH", "VA", "TN"];
        //$scope.cities = ["Cincinnati", "Columbus", "Atlanta"];

        var request = $.post("http://localhost:3000/api/citystate/list", $scope.data);
          request.done(function( msg ) {
          $scope.states = msg.state;
          $scope.cities = msg.cities;
        }).fail(function( msg ) {
            console.log("Could not access DB for city states");
        });
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };
      // Cleanup the modal when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
      // Execute action on hide modal
      $scope.$on('modal.hidden', function() {
        // Execute action
      });
      // Execute action on remove modal
      $scope.$on('modal.removed', function() {
        // Execute action
      });

    $scope.login = function() {
        console.log($scope.data.user);
        console.log($scope.data.pass);
        var request = $.post("http://localhost:3000/api/login/", { username : $scope.data.username, password : $scope.data.password });
        request.done(function( msg ) {
          $state.go("dash");
        }).fail(function( msg ) {
            alert("Username or password incorrect");
        });
    
    }

    $scope.register = function() {
      //Check if all fields are filled out, very brute forcy but..
      for (var key in $scope.data) {
        if ($scope.data.hasOwnProperty(key)) {
          if ($scope.data[usertype] != "City official") {
            if (key == "state" || key == "title" || key == "city") 
              continue;
          }
          if ($scope.data[key] == "") {
            var alert = $ionicPopup.show({
              template: 'Please fill in all fields',
              title: 'Try Again',
              buttons: [{ text: 'Ok' }]
            });
          }
        }
      }
      //Send the request
      var request = $.post("http://localhost:3000/api/user/new", $scope.data);
        request.done(function( msg ) {
        alert("Successfully registered, please wait for approval!");
      }).fail(function( msg ) {
          alert("Registration error, please try again!");
      });
    }
}])

.controller('DashCtrl', ['$scope', 'WaterApp','$state', function($scope, WaterApp,$state) {

    $scope.addData = function() {
        $state.go('addData');
    }
    $scope.poiDetail = function() {
        $state.go('POIdetail');
    }
    $scope.logout = function() {
        WaterApp.setUserData(null);
        $state.go('login');
    }
    $scope.addPOI = function() {
        $state.go('location');
    }
    $scope.viewPOI = function() {
        $state.go('viewPOI');
    }
    $scope.pendingData = function() {
        $state.go('adminPendingData');
    }
    $scope.pendingOfficials = function() {
        $state.go('Admin');
    }
    $scope.viewReports = function() {
        $state.go('POIreports');
    }

}])

.controller('POIdetailCtrl', ['$rootScope', '$state', '$scope', function($rootScope, $state, $scope) {
    $scope.dataType;
    $scope.dataValueLow;
    $scope.dataValueHigh;
    $scope.start;
    $scope.end;

    $scope.applyFilter = function () {
        var request = $.post("http://localhost:3000/api/data/list", {});
        request.done(function( msg ) {
          $scope.data = msg;
        }).fail(function( msg ) {
            alert("Could not get poi list");
        });
    }
    
}])

.controller('addDataCtrl', ['$state', '$scope','$rootScope', function($state, $scope, $rootScope) {
    $scope.locationName;
    $scope.date;
    $scope.dataType;
    $scope.dataValue;
}])

.controller('adminCtrl', ['$state', '$scope','$rootScope', function($state, $scope, $rootScope) {
    $scope.officials = [];

    var request = $.post("http://localhost:3000/api/users/list", {vals: {'approved': '0'}});
    request.done(function( msg ) {
      $scope.officials = msg;
    }).fail(function( msg ) {
        alert("Could not get user list");
    });

}])

.controller('adminPendingDataCtrl', ['$state', '$scope','$rootScope', function($state, $scope, $rootScope) {
    $scope.pendingData = [];
    var request = $.post("http://localhost:3000/api/datapoint/list", {vals: {'pending': '1'}});
    request.done(function( msg ) {
      $scope.pendingData = msg;
    }).fail(function( msg ) {
        console.log("Could not get data list");
    })
}]);


