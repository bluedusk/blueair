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

        value: -999,
        color:"good",
        comment:"good",
        time:"暂时没有数据"

    }

    var updateAqi = function(){


         $http.get('/aqi_d', {params: {city:"beijing"},timeout:5000})
         .then(function(response){

            if (response.length == 0) { return};
            console.log(response.data);
            var aqiObj = response.data[0];
            $scope.aqi.value = aqiObj.value;
            $scope.aqi.time = aqiObj.updateTime;

        },function(err){
            //handle err: timeout or other
            console.log(err);
        });

    }
    updateAqi();















    
  });
