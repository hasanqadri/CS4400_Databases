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

.controller('LoginCtrl', ['$scope', 'WaterApp','$state', '$ionicPopup', '$ionicModal', 'userData', function($scope, WaterApp, $state, $ionicPopup, $ionicModal) {
    $scope.data = {
        "user": "",
        "pass": ""
    }

    $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
      $scope.openModal = function() {
        $scope.modal.show();
        $scope.registerData = {};
        $scope.showStates = 0;
        $scope.states = ["OH", "VA", "TN"];
        $scope.cities = ["Cincinnati", "Columbus", "Atlanta"];

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

            //Data validation
            WaterApp.registerUser($scope.registerData)
            .then(function(result) {
                console.log(result.data);
                if (result.data == 1) {
                    var alert = $ionicPopup.show({
                        template: 'You have successfully registered!',
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
                template: 'Please fill in all fields',
                title: 'Try Again',
                buttons: [{ text: 'Ok' }]
            });
        }
    }
}
    

   
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