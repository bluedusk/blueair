'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('RealtimeAqiCtrl', function($scope,$http) {

    var colors = ["good","moderate","unhealthy","unhealthy1","unhealthy2","hazardous"];
    $scope.aqi = {

        value: 501,
        color:"good",
        comment:"good",
        time:"2015年8月22日  23:00"

    }

    var updateAqi = function(){


         $http.get('/aqi_d', {params: {city:"beijing"}}).success(function(response) {

            console.log(response[0]);
            var aqiObj = response[0];
            $scope.aqi.value = aqiObj.value;
            $scope.aqi.time = aqiObj.updateTime;



        });

    }
    updateAqi();















    
  });
