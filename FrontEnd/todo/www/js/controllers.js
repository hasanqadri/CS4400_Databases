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
           $state.go('main.dash');
    };
}])

.controller('LoginCtrl', ['$scope', 'WaterApp','$state', '$ionicPopup', 'userData', function($scope, WaterApp, $state, $ionicPopup) {
    $scope.data = {
        "user": "",
        "pass": ""
    }

    $scope.login = function() {
        WaterApp.login($scope.data).then(function(result) {
            if (!(result.data == 0)) {
                $state.go('main.dash');
            } else {
                var alert = $ionicPopup.show({
                    template: 'Check the username and password',
                    title: 'Login Failed',
                    buttons: [{ text: 'Ok' }]
                })
            }
        })
    }

    $scope.register = function() {
        if ($scope.registerData.user != "" && $scope.registerData.pass != "") {
            WaterApp.registerUser($scope.registerData)
            .then(function(result) {
                console.log(result.data);
                if (result.data == 1) {
                    var alert = $ionicPopup.show({
                        template: 'You have successfully registered, welcome to WaterHound!',
                        title: 'Success',
                        buttons: [{ text: 'Ok' }]
                    });
                } else {
                    var alert = $ionicPopup.show({
                        template: 'Username is taken, try again!',
                        title: 'Try Again',
                        buttons: [{ text: 'Ok' }]
                    });
                }
            })
        } else {
            var alert = $ionicPopup.show({
                template: 'Please fill in both fields',
                title: 'Try Again',
                buttons: [{ text: 'Ok' }]
            });
        }
    }
    $scope.showPopup = function() {
      $scope.registerData = {}
    
      // Custom popup
      var myPopup = $ionicPopup.show({
         template: '<input type = "text" ng-model = "registerData.user" placeholder="Username"> </br>' + 
                    '<input type = "password" ng-model = "registerData.pass" placeholder="Password"> </br>' +
                     '<select ng-model="registerData.type">' + 
                        '<option selected>User</option>' +
                        '<option>Worker</option>' +
                        '<option>Manager</option>' +
                        '<option>Admin</option>' +
                    '</select>',
         title: 'Register',
         scope: $scope,
         buttons: [
            { text: 'Cancel' }, {
               text: '<b>Submit</b>',
               type: 'button-positive',
                  onTap: function(e) {
                     $scope.register();
                  }
            }
         ]
      });

      myPopup.then(function(res) {
         console.log('Tapped!', res);
      });    
   };
}])

.controller('DashCtrl', ['$scope', 'WaterApp','$state', function($scope, WaterApp,$state) {
    $scope.user_data = WaterApp.getUserData();

    $scope.loadMap = function() {
        $state.go('map');
    }

    $scope.logout = function() {
        WaterApp.setUserData(null);
        $state.go('login');
    }

    $scope.sourceReport = function() {
        $state.go('sourceReport');
    }

    $scope.viewSourceReports = function() {
        $state.go('sourceReportList');
    }

}])

.controller('POIdetailCtrl', ['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.goBack = function() {
           $state.go('main.dash');
    };
}])

.controller('MapCtrl', ['$state', '$scope', 'WaterApp', '$ionicLoading', '$rootScope', function($state, $scope, WaterApp, $ionicLoading, $rootScope) {
    var options = {timeout: 10000, enableHighAccuracy: true};
    var latLng = new google.maps.LatLng(33.748995, -84.387982);
 
    var mapOptions = {
      center: latLng,
      zoom: 7,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
        console.log($scope.sourceReports);
        if (typeof $scope.sourceReports === 'undefined' ) {
            WaterApp.getSourceReports().then(function(result) {
                $rootScope.sourceReports = result.data;

                makeMap();
            });
        } else {
            makeMap();
        }
     });


    makeMap = function() {
        var infowindow = new google.maps.InfoWindow();
        for (var i = 0; i < $scope.sourceReports.length; i++) {
            var mkrLatLng = new google.maps.LatLng($scope.sourceReports[i]['latitude'], 
                                                    $scope.sourceReports[i]['longitude']);
            var marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                position: mkrLatLng
            });

            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent("<p><h5>" + $scope.sourceReports[i]['type'] + "</h5>" + 
                                            $scope.sourceReports[i]['cond'] + "<br />" + mkrLatLng.toString()  
                                             + "<br />" + $scope.sourceReports[i]['timestamp'] + 
                                            "</p>");
                    infowindow.open(map, marker);
                }
            })(marker, i)); 
        }
    }

   
}])

.controller('sourceReportCtrl', ['$state', '$scope', 'WaterApp', '$ionicPopup', function($state, $scope, WaterApp, $ionicPopup) {
    
    $scope.reportData = {
        'lat':"",
        'lng':"",
        'source':"",
        'condition':"",
        'user': WaterApp.getUserData()['user']
    }

    $scope.submit = function() {
        console.log($scope.reportData );
        WaterApp.sendSourceReport($scope.reportData)
        .then(function(result) {
            if (result.data != "Failed to update") {
                var alert = $ionicPopup.show({
                    template: 'Thank you!',
                    title: 'Successfully Submitted',
                    buttons: [{ text: 'Ok' }]
                }); 
            } else {
                var alert = $ionicPopup.show({
                    template: 'Something went wrong, please try again later :(',
                    title: 'Error',
                    buttons: [{ text: 'Ok' }]
                });
            }
        })
        .catch(function(reason) {
           console.log(reason);
        });
    }

}])

.controller('sourceReportListCtrl', ['$state', '$scope', 'WaterApp', '$ionicPopup', '$rootScope', function($state, $scope, WaterApp, $ionicPopup, $rootScope) {


     if (typeof $scope.sourceReports === 'undefined' ) {
            WaterApp.getSourceReports().then(function(result) {
                $rootScope.sourceReports = result.data;
                console.log("Queried source reports");
            });
    } 



}]);