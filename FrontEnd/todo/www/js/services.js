angular.module('starter').factory('WaterApp', ['$http', '$q', function($http, $q) {
var factory = [];
var host = "http://www.yoogoe.com/waterapp/";
var user_data = {};

factory.login = function(data) {
     var deferred = $q.defer();


     connect_db(data).then(function(result) {
                user_data = result.data;
                console.log(user_data);
                deferred.resolve(result);
            })
        
    return deferred.promise;
    }
    

    function connect_db(data) {
        return $http.get(
        host + 'login.php', 
        {
            params: {
                'user': data.user,
                'pass': data.pass
            }
        })
    }
factory.getUserData = function() {
    return user_data;
}

factory.setUserData = function(data) {
    user_data = data;
}

factory.getSourceReports = function(data) {
    var deferred = $q.defer();
    connect_db(data)
        .then(
            function(result) {
                deferred.resolve(result);
            })
        .catch(error_out);
        
    return deferred.promise;

    function connect_db(data) {
        return $http.get(host + 'getSourceReports.php')
    }

    function error_out(data, status) {
        deferred.reject(status);
    }
}

factory.sendSourceReport = function(data) {
    var deferred = $q.defer();
    connect_db(data)
        .then(
            function(result) {
                console.log(result.data);
                deferred.resolve(result);
            })
        .catch(error_out);
        
    return deferred.promise;

    function connect_db(data) {
        console.log(data);
        return $http.post(host + 'sendSourceReport.php', data)
    }

    function error_out(data, status) {
        deferred.reject(status);
    }
}

factory.registerUser = function(data) {
    var deferred = $q.defer();
    connect_db(data)
        .then(
            function(result) {
                deferred.resolve(result);
            })
        .catch(error_out);
        
    return deferred.promise;

    function connect_db(data) {
        console.log(data);
        return $http.post(host + 'register.php', data)
    }

    function error_out(data, status) {
        deferred.reject(status);
    }
}

    
return factory;
}]);
