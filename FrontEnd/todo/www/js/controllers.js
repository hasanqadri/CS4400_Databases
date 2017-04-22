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


  .controller('viewPOICtrl', ['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.goBack = function() {
      $state.go('main.dash');
    };
  }])

  .controller('locationCtrl', ['$rootScope', '$state', function($rootScope, $state) {
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
        console.log($scope.data.user);
        console.log($scope.data.pass);
        var request = $.post("http://localhost:3000/api/login", { username : $scope.data.user, password : $scope.data.pass });
 
        request.done(function( msg ) {
          $state.go("main.dash");
        }).fail(function( msg ) {
            alert("Username or password incorrect");
        });
    
    }

    $scope.register = function() {
        if ($scope.registerData.user != "" && $scope.registerData.pass != "") {
        } else {
            var alert = $ionicPopup.show({
                template: 'Please fill in all fields',
                title: 'Try Again',
                buttons: [{ text: 'Ok' }]
            });
        }
    }


}])

.controller('DashCtrl', ['$scope', 'WaterApp','$state', function($scope, WaterApp,$state) {
    $scope.user_data = WaterApp.getUserData();

     $scope.addData = function() {
        $state.go('addData');
    }

     $scope.poiDetail = function() {
        $state.go('POIdetail');
    }

     $scope.Admin = function() {
        $state.go('Admin');
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

}])
.controller('POIdetailCtrl', ['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.goBack = function() {
           $state.go('main.dash');
    };
}])

.controller('addDataCtrl', ['$state', '$scope','$rootScope', function($state, $scope, $rootScope) {
    
}])

.controller('adminCtrl', ['$state', '$scope','$rootScope', function($state, $scope, $rootScope) {
    $scope.officials = [];
    $scope.officials.push({"username" : "blah", "email" : "kevin", "city" : "kevin", "state" : "blah", "title" : "kevin"});
}])

.controller('adminPendingDataCtrl', ['$state', '$scope','$rootScope', function($state, $scope, $rootScope) {
    $scope.pendingData = [];
    $scope.pendingData.push({"location" : "blah", "dataType" : "hi", "dataValue" : "kevin", "timeDate" : "hi"});
    console.log($scope.pendingData)
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


