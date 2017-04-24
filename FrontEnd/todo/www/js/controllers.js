  var host = "54.85.86.111:80";
  var current_poi_location = null; 
  var usertype1 = "admin";
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
        } else {
          $state.go(view);
        }
      };
  }])

  .controller('POIreportsCtrl', ['$rootScope', '$state', '$scope', function($rootScope, $state, $scope) {
    var request = $.post("http://" + host + "/api/poi/report", {});
    request.done(function( msg ) {
      $scope.reports = msg;
      console.log(msg);
    }).fail(function( msg ) {
        console.log("Failed to get POI reports");
    });

    /*$scope.orderByField = 'mold_min';
    $scope.reverseSort = false;*/
    }])


  .controller('viewPOICtrl', ['$state', '$scope', function($state,  $scope) {
    $scope.data = {
      "location_name": null ,
      "city": null ,
      "state": null ,
      "zip_code": null ,
      "checked": false,
      "flag": 0,
      "start": null,
      "end": null,
    };
    $scope.btw = {
      "name": "date_flagged",
      "min": null,
      "max": null
    };

    var request = $.post("http://" + host + "/api/poi/list", {});
        request.done(function( msg ) {
        //console.log( JSON.stringify(msg));
        $scope.field_data = msg;
      }).fail(function( msg ) {
          console.log("Failed.");
          console.log(msg);
          console.log("*********************");
    });

    $scope.querySuccess = 0;
    $scope.applyFilter = function() {
        var between = {};
        if ($scope.data.start && $scope.data.end) {
            $scope.btw.min = getDate($scope.data.start);
            $scope.btw.max =  getDate($scope.data.end);
            between = $scope.btw;
        }
        $scope.data.flag = ($scope.data.checked)? 1:0;
        remove =["start", "end", "checked"];
        request = {};
        query = buildRequestJSON($scope.data, [], remove);   

        if(query && Object.keys(query).length != 0) {
          request.vals = query;
        }

        if(between && Object.keys(between).length != 0) {
          request.between = between;
        }

        console.log(JSON.stringify(request));
        $.ajax({
            type: "POST",
            url: "http://" + host + "/api/poi/list",
            data: JSON.stringify(request),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(msg) {
                $scope.poiInfo = msg;
                console.log("Filtered!");
                console.log($scope.poiInfo);
                $scope.didQuery = 1;

            },
            error: function(msg) {
                console.log("Failed to filter.");
                console.log(msg);
            }
          });


    };



    $scope.resetFilter = function() {
      for (var key in $scope.data) {
        if ($scope.data.hasOwnProperty(key)) {
          $scope.data[key] = null;
        }
        $scope.flag = false;
      }
    };

    $scope.viewPOIDetail = function(location) {
      current_poi_location = location;
      console.log(location);
      if (current_poi_location) {
        $state.go('POIdetail');
      }
    };

  }])

  .controller('locationCtrl', ['$rootScope', '$state', '$scope', function($rootScope, $state, $scope) {

    $scope.data = {
        "location_name": null,
        "city": null,
        "state": null,
        "zip_code": null
    }
    var request = $.post("http://" + host + "/api/poi/list", {});
        request.done(function( msg ) {
        $scope.poiInfo = msg;
      }).fail(function( msg ) {
          console.log(msg);
    });

    

    $scope.submit = function() {
      var request = $.post("http://" + host + "/api/poi/new", $scope.data);
      console.log($scope.data);

        request.done(function( msg ) {
          alert("done")
      }).fail(function( msg ) {
          console.log(msg);
      });
    };  
  }])

  .controller('LoginCtrl', ['$scope', '$rootScope','$state', '$ionicPopup', '$ionicModal', 'userData', function($scope, $rootScope, $state, $ionicPopup, $ionicModal) {
    $scope.data = {
        "username": null,
        "password": null,
        "pass_confirm": null,
        "email": null,
        "usertype": null,
        "city": null,
        "state": null,
        "title": null,
        "approved": "pending"
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

        var request = $.post("http://" + host + "/api/citystate/list", {});
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
        var request = $.post("http://" + host + "/api/login/", $scope.login_data);
        request.done(function( msg ) {
          $state.go("dash");
          $rootScope.usertype = String(msg);
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
          if ($scope.data[key] == null) {
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
      var request = $.post("http://" + host + "/api/users/new", $scope.data);
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

.controller('DashCtrl', ['$scope', '$rootScope','$state', function($scope, $rootScope, $state) {
    
    console.log($rootScope.usertype);
    if($rootScope.usertype == undefined) {
        alert("Your session was reset, please log in again.")
         $state.go('login');
    }
    $scope.addData = function() {
        $state.go('addData');
    }
    $scope.poiDetail = function() {
        $state.go('POIdetail');
    }
    $scope.logout = function() {
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
    "start":null,
    "end":null
  };

  $scope.btw = {
    "date_time": {
          "min":null,
          "max":null
    },
    "data_value": {
          "min":null,
          "max":null
    }
  };

  $scope.didQuery = 0;
  var request = $.get("http://" + host + "/api/datapoint/datatypes", {});
        request.done(function( msg ) {
          $scope.data = msg;
          console.log($scope.data);
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
       var between = {};
        if ($scope.formData.start && $scope.formData.start) {
            between.date_time = {};
            between.date_time.min = $scope.formData.start.toMysqlFormat();
            between.date_time.max =  $scope.formData.end.toMysqlFormat();
        }

        if ($scope.btw.data_value.min && $scope.btw.data_value.max) {
            console.log("hi");
            between.data_value = {};
            between.data_value.min = $scope.btw.data_value.min;
            between.data_value.max = $scope.btw.data_value.max;
        }

        var request = {};
        $scope.data.flag = ($scope.data.checked)? 1:0;
        remove =["start", "end"];
        query = buildRequestJSON($scope.formData, [], remove);   

        if(query && Object.keys(query).length != 0) {
          request.vals = query;
        }
        console.log(between);
        if(between && Object.keys(between).length != 0) {
          request.between = between;
        }
      console.log(request);
      $.ajax({
            type: "POST",
            url: "http://" + host + "/api/datapoint/list",
            data: JSON.stringify(request),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(msg) {
                $scope.table_data = msg; 
                console.log($scope.table_data);
            },
            error: function(msg) {
                console.log("Failed to get POI data details.");
                console.log(msg);
            }
      });
  }
  //Need endpoint for updating flag
  $scope.flag = function () {
      var request = $.post("http://" + host + "/api/poi/update", {"location_name": $scope.formData.location_name, "flag": 1});
      request.done(function( msg ) {
          $scope.data = msg;
      }).fail(function( msg ) {
          console.log("Could not flag POI location");
      });
  }
    
}])

.controller('addDataCtrl', ['$state', '$scope','$rootScope', function($state, $scope, $rootScope) {
    $scope.data = {
        "location_name": null,
        "date":null,
        "date_time": null,
        "data_value": null,
        "data_type": null
    }
    $scope.addLocation = function() {
        $state.go('location');
    }
    var request = $.post("http://" + host + "/api/poi/list", {});
        request.done(function( msg ) {
        $scope.poiInfo = msg;
      }).fail(function( msg ) {
          console.log(msg);
      });
    request = $.get("http://" + host + "/api/datapoint/datatypes");
        request.done(function( msg ) {
        $scope.data_list = msg;
        console.log($scope.data_list);
      }).fail(function( msg ) {
          console.log(msg);
      });
    $scope.submit = function() {
      console.log(($scope.data.date).toMysqlFormat());
      $scope.data.date_time = ($scope.data.date).toMysqlFormat();
      var request = $.post("http://" + host + "/api/datapoint/new",  $scope.data);
        request.done(function( msg ) {
        alert("success!");
      }).fail(function( msg ) {
        alert("could not add data");
      });
    };  
}])

.controller('adminCtrl', ['$state', '$scope','$rootScope', function($state, $scope, $rootScope) {
  $scope.officials = [];
   
  $scope.query = function() {
     $.ajax({
            type: "POST",
            url: "http://" + host + "/api/users/list_officials",
            data: JSON.stringify({"vals":{"approved":"pending"}}),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(msg) {
              $scope.officials = msg;
              console.log($scope.officials);
              for (i in $scope.officials) {
                i.checked = false;
              }

            },
            error: function(msg) {
                console.log("Failed to get pending data.");
                console.log(msg);
            }
      });
   }
   $scope.query();

    $scope.submit = function(action) {
      var updateVal = (action == "Reject")? "rejected" : "approved";
  
      console.log("updateVal:" + updateVal);
      console.log($scope.officials);
      console.log($scope.officials.length);
      for (i = 0; i < $scope.officials.length; i++) {
        console.log(i);
        if ($scope.officials[i].checked) {
          console.log(i);
          $scope.officials[i].approved = updateVal;
          var request = $.post("http://" + host + "/api/users/update",  $scope.officials[i]);
              request.done(function( msg ) {
                console.log("updated " + i);
              }).fail(function( msg ) {
                console.log("Could not update  " + i);
                console.log($scope.officials[i]);
              });
        }
      }
       $scope.query();
    };  
}])

.controller('adminPendingDataCtrl', ['$state', '$scope','$rootScope', function($state, $scope, $rootScope) {
    $scope.pendingData = [];
      
   $scope.query = function() {
            $.ajax({
            type: "POST",
            url: "http://" + host + "/api/datapoint/list",
            data: JSON.stringify({"vals":{"approved":"pending"}}),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function(msg) {
              $scope.pendingData = msg;
              console.log($scope.pendingData);
              for (i in $scope.pendingData) {
                i.checked = false;
              }

            },
            error: function(msg) {
                console.log("Failed to get pending data.");
                console.log(msg);
            }
          });
    }
$scope.query();
    $scope.submit = function(action) {
      var updateVal = (action == "Reject")? "rejected" : "approved";
      for (i = 0; i < $scope.pendingData.length; i++) {
        if ($scope.pendingData[i].checked) {
          $scope.pendingData[i].accepted = updateVal;
          var request = $.post("http://" + host + "/api/datapoint/update",  $scope.pendingData[i]);
              request.done(function( msg ) {
              console.log("updated datapoint");
            }).fail(function( msg ) {
              console.log("Could not updated datapoint");
            });
          }
      }
      $scope.query();
    };  

    

}]);


/**
 * You first need to create a formatting function to pad numbers to two digits…
 **/
function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

/**
 * …and then create the method to output the date string as desired.
 * Some people hate using prototypes this way, but if you are going
 * to apply this to more than one Date object, having it as a prototype
 * makes sense.
 **/
Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

function buildRequestJSON(json, desired_nulls=[], remove=[]) {
  var res = {};
  for (var key in json) {
      if (!contains(remove, key) && json.hasOwnProperty(key) && (json[key] != null || contains(desired_nulls, key))) {
        res[key] = json[key];
      }
  }
  return res;

  function contains(list, queryItem) {
      for(i = 0; i < list.length; i++) {
        if (list[i] == queryItem) {
          return true;
        }
      }
      return false;
  }
}

function getDate(dateObj) {
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    newdate = year + "-" + month + "-" + day;
      return newdate;
}