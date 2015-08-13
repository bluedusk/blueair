'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('TestCtrl', ['$scope', '$timeout','$http', function ($scope, $timeout, $http) {
   
    var refresh = function() {
      $http.get('/contactlist').success(function(response) {
        console.log("I got the data I requested");
        $scope.contactlist = response;
      });
    };

    refresh();
    $scope.test = {

        a:"what"

    };

    $scope.getAqiData = function(){

        $http.get('/aqidata').success(function(response) {
          console.log("getAqiData");
          $scope.aqidata = response;
      });

    };
}]);