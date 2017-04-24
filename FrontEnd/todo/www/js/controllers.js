  host = "128.61.35.128";
  current_poi_location = null; 
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
      $rootScope.goBack = function(view) {
        if(!view) {
          $state.go('dash');
        }
        $state.go(view);
      };
  }])

  .controller('POIreportsCtrl', ['$rootScope', '$state', '$scope', function($rootScope, $state, $scope) {
    var request = $.post("http://" + host + ":3000/api/datapoint/list", {});
    request.done(function( msg ) {
      console.log(msg);
      $scope.pendingData = msg;
    }).fail(function( msg ) {
        console.log("Failed to get POI reports");
    });
  }])


  .controller('viewPOICtrl', ['$state', '$scope', function($state,  $scope) {
    $scope.data = {
      "location_name": null ,
      "city": null ,
      "state": null ,
      "zip": null ,
      "flag": false,
      "date_flagged_start" :null ,
      "date_flagged_end" : null 
    }
    var request = $.post("http://" + host + ":3000/api/poi/list", {});
        request.done(function( msg ) {
        //console.log( JSON.stringify(msg));
        $scope.poiInfo = msg;
      }).fail(function( msg ) {
          console.log("Failed.");
          console.log(msg);
          console.log("*********************");
    });

    $scope.querySuccess = 0;
    $scope.applyFilter = function() {
      console.log({vals: $scope.data});
      var request = $.post("http://" + host + ":3000/api/poi/list", {vals: $scope.data});
        request.done(function( msg ) {

        $scope.querySuccess = 1;
        console.log( $scope.querySuccess);
        console.log(msg);
        $scope.poiInfo = msg;
       
      }).fail(function( msg ) {
          console.log("fail");
      });
    }

    $scope.resetFilter = function() {
      for (var key in $scope.data) {
        if ($scope.data.hasOwnProperty(key)) {
          $scope.data[key] = null;
        }
        $scope.flag = false;
      }
    }

    $scope.viewPOIDetail = function(location) {
      current_poi_location = location;
      console.log(location);
      if (current_poi_location) {
        $state.go('POIdetail');
      }
    }

  }])

  .controller('locationCtrl', ['$rootScope', '$state', '$scope', function($rootScope, $state, $scope) {

    
    var request = $.post("http://" + host + ":3000/api/poi/list", {});
        request.done(function( msg ) {
        $scope.poiInfo = msg;
      }).fail(function( msg ) {
          console.log(msg);
    });

    

    $scope.submit = function() {
      var request = $.post("http://" + host + ":3000/api/poi/new", $scope.data);
      console.log($scope.data);
        request.done(function( msg ) {
          alert("done")
      }).fail(function( msg ) {
          console.log(msg);
      });
    };  
  }])

  .controller('adminCtrl', ['$rootScope', '$state', function($rootScope, $state) {
      $scope.data = {
        "username": "",
        "email": "",
        "city": "",
        "state": "",
  }



  }])

  .controller('LoginCtrl', ['$scope', 'WaterApp','$state', '$ionicPopup', '$ionicModal', 'userData', function($scope, WaterApp, $state, $ionicPopup, $ionicModal) {
    $scope.data = {
        "username": null,
        "password": null,
        "pass_confirm": null,
        "email": null,
        "usertype": null,
        "city": null,
        "state": null,
        "title": null
    }

    $scope.login_data = {
      "username": null,
      "password": null
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

        var request = $.post("http://" + host + ":3000/api/citystate/list", {});
          request.done(function( msg ) {
          $scope.city_states = msg;
          console.log(msg);
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
        console.log($scope.login_data);
        var request = $.post("http://" + host + ":3000/api/login/", $scope.login_data);
        request.done(function( msg ) {
          $state.go("dash");
          console.log(msg);
        }).fail(function( msg ) {
            alert("Username or password incorrect");
        });
    
    }

    $scope.register = function() {
      //Check if all fields are filled out, very brute forcy but..
      for (var key in $scope.data) {
        if ($scope.data.hasOwnProperty(key)) {
          if ($scope.data["usertype"] != "Official") {
            if (key == "state" || key == "title" || key == "city") 
              continue;
          }
          if ($scope.data[key] == "") {
            var error = $ionicPopup.show({
              template: 'Please fill in all fields',
              title: 'Try Again',
              buttons: [{ text: 'Ok' }]
            });
            return;
          }
        }
      }

      if($scope.data.password != $scope.data.pass_confirm) {
         var error = $ionicPopup.show({
            template: "Passwords don't match.",
            title: 'Try Again',
            buttons: [{ text: 'Ok' }]
          });
          return;
      }
      //Send the request
      var request = $.post("http://" + host + ":3000/api/users/new", $scope.data);
      request.done(function( msg ) {
        $scope.modal.remove();
      }).fail(function( msg ) {
            var alert = $ionicPopup.show({
              template: 'Registration failed!',
              title: 'Try Again',
              buttons: [{ text: 'Ok' }]
            });
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

  console.log(current_poi_location);
  $scope.formData = {
    "location_name": current_poi_location,
    "data_type":null,
    "dataValueLow":null,
    "dataValueHigh":null,
    "start":null,
    "end":null
  }
  

  $scope.didQuery = 0;
  var request = $.post("http://" + host + ":3000/api/datapoints/datatype", {});
        request.done(function( msg ) {
          $scope.data = msg;
        }).fail(function( msg ) {
            console.log("Could not get datatypes");
  });

  $scope.resetFilter = function() {
    for (var key in $scope.formData) {
      if ($scope.formData.hasOwnProperty(key)) {
        $scope.formData[key] = null;
      }
    }
  }

  $scope.applyFilter = function () {
    //Need value and time endpoints
      var request = $.post("http://" + host + ":3000/api/data/list", $scope.formData);
      request.done(function( msg ) {
        $scope.data = msg;
      }).fail(function( msg ) {
          alert("Could not get poi list");
      });
  }
  //Need endpoint for updating flag
  $scope.flag = function () {
      var request = $.post("http://" + host + ":3000/api/poi/update", {"location_name": $scope.formData.location_name, "flag": 1});
      request.done(function( msg ) {
        $scope.data = msg;
      }).fail(function( msg ) {
          console.log("Could not flag POI location");
      });
  }
    
}])

.controller('addDataCtrl', ['$state', '$scope','$rootScope', function($state, $scope, $rootScope) {
    $scope.locationName;
    $scope.date;
    $scope.dataType;
    $scope.dataValue;

    $scope.addLocation = function() {
        $state.go('location');
    }

    var request = $.post("http://" + host + ":3000/api/poi/list", {});
        request.done(function( msg ) {
        $scope.poiInfo = msg;
      }).fail(function( msg ) {
          console.log(msg);
  });

    $scope.submit = function() {
      var request = $.post("http://" + host + ":3000/api/datapoint/new", {vals: {'location_name' : $scope.locationName, 'date_time' : $scope.date, 'data_value' : $scope.dataValue, 'data_type' : $scope.dataType}});
        request.done(function( msg ) {
        alert("success!");
      }).fail(function( msg ) {
        alert("could not add data");
      });
    };  
}])

.controller('adminCtrl', ['$state', '$scope','$rootScope', function($state, $scope, $rootScope) {
    $scope.officials = [];

    var request = $.post("http://" + host + ":3000/api/users/list", {vals: {'approved': '0'}});
    request.done(function( msg ) {
      $scope.officials = msg;
    }).fail(function( msg ) {
        alert("Could not get user list");
    });

}])

.controller('adminPendingDataCtrl', ['$state', '$scope','$rootScope', function($state, $scope, $rootScope) {
    $scope.pendingData = [];
    var request = $.post("http://" + host + ":3000/api/datapoint/list", {vals: {'pending': '1'}});
    request.done(function( msg ) {
      $scope.pendingData = msg;
    }).fail(function( msg ) {
        console.log("Could not get data list");
    })
}]);


