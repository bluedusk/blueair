'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
    .directive('aqibox',function() {
        return {
        templateUrl:'scripts/directives/realtime/realtime.html',
        restrict:'E',
        replace:true,
        scope: {
        'model': '=',
        'comments': '@',
        'aqi': '@',
        'name': '@',
        'colour': '@',
        'details':'@',
        'updateTime':'@',
        'goto':'@',
        'city':'@'
        }
        
    }
  });
