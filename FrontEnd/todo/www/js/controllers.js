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

.controller('POIreportsCtrl', ['$rootScope', '$state', function($rootScope, $state) {
    var request = $.post("http://localhost:3000/api/poi/list", {});
    request.done(function( msg ) {
      $scope.pendingData = msg;
    }).fail(function( msg ) {
        alert("Could not get poi list");
    });
}])


  .controller('viewPOICtrl', ['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.goBack = function() {
      $state.go('main.dash');
    };

    var request = $.post("http://localhost:3000/api/poi/list", {});
    request.done(function( msg ) {
      $scope.pendingData = msg;
    }).fail(function( msg ) {
        alert("Could not get poi list");
    });

  }])

  .controller('locationCtrl', ['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.goBack = function() {
      $state.go('main.dash');
    };
  }])

  .controller('adminCtrl', ['$rootScope', '$state', function($rootScope, $state) {
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
.controller('POIdetailCtrl', ['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.goBack = function() {
           $state.go('main.dash');
    };

    var request = $.post("http://localhost:3000/api/data/list", {});
    request.done(function( msg ) {
      $scope.data = msg;
    }).fail(function( msg ) {
        alert("Could not get poi list");
    });
}])

.controller('addDataCtrl', ['$state', '$scope','$rootScope', function($state, $scope, $rootScope) {
    
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


