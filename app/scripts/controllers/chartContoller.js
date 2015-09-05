//'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('ChartCtrl', ['$scope', '$timeout','$http','$stateParams','$location','$state', function ($scope, $timeout,$http,$stateParams,$location,$state) {
    console.log($state.current);


    //console.log($stateParams.year);
    var now = new Date();
    $scope.hasMValue = true;

    $scope.search = {
        city : "Beijing",
        year : $stateParams.year || now.getFullYear(),
        month : now.getMonth()+1

    }

    $scope.goSearchY = function(){

        // $state.go("aqi.year", {
        //        year: $scope.search.year
        // });
        // $location.path('charty');
        getAqiPerY();
        // getAqiPie();
        // getAqiLine();
    }

    $scope.goSearchM = function(){

        getAqiPerM();
        // getAqiPie();
        // getAqiLine();
    }

    var getAqiPerY = function(){
          $http.get('/aqi_y', {params: {city:$scope.search.city,year:$scope.search.year}}).success(function(response) {

            var data = processYearData(response);
            $scope.aqi_annual_pie = initPieChart(data);
            initLineChartY(data);
            initLineChartAllY(data);

        });

    }
    if ($state.current.name === "aqi.year") {

        getAqiPerY();

    };
    var getAqiPerM = function(){
          $http.get('/aqi_m', {params: {city:$scope.search.city,year:$scope.search.year,month:$scope.search.month}}).success(function(response) {

            console.info(response.length);

            if (response.length == 0) {
              $scope.hasMValue = false;
              return;
            }
            else{
              $scope.hasMValue = true;
              var data = countApiDay(response);
              $scope.aqi_monthly_pie = initPieChart(data);
              initLineChartM(response);
            }
        });

    }
    if ($state.current.name === "aqi.month") {

        getAqiPerM();

    };

    var countApiDay = function(docs)
    {

        var a = b = c = d = e = f = 0;
        console.log(docs);
        for (var i = docs.length - 1; i >= 0; i--) {

          var aqi = docs[i].avgaqi;
          if (aqi <= 50) {
            a++;
          };
          if (aqi <= 100 && aqi >50) {
            b++;
          };
          if (aqi <= 150 && aqi >100) {
            c++;
          };
          if (aqi <= 200 && aqi >150) {
            d++;
          };
          if (aqi <= 300 && aqi >200) {
            e++;
          };
          if (aqi >300) {
            f++;
          };
        };
        var response = {'dataY':[a,b,c,d,e,f]};
        return response;

    }

    var processYearData = function(docs){
        var a = b = c = d = e = f = 0;
        var dataByMonth = [[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]];
        var dataByLevel = [[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0]];
        console.log(docs);
        for (var i = docs.length - 1; i >= 0; i--) {

              var aqi = docs[i].avgaqi;
              if (aqi <= 50) {
                a++;
                dataByMonth[docs[i].month-1][0]++;
                dataByLevel[0][docs[i].month-1]++;
              };
              if (aqi <= 100 && aqi >50) {
                b++;
                dataByMonth[docs[i].month-1][1]++;
                dataByLevel[1][docs[i].month-1]++;
              };
              if (aqi <= 150 && aqi >100) {
                c++;
                dataByMonth[docs[i].month-1][2]++;
                dataByLevel[2][docs[i].month-1]++;
              };
              if (aqi <= 200 && aqi >150) {
                d++;
                dataByMonth[docs[i].month-1][3]++;
                dataByLevel[3][docs[i].month-1]++;
              };
              if (aqi <= 300 && aqi >200) {
                e++;
                dataByMonth[docs[i].month-1][4]++;
                dataByLevel[4][docs[i].month-1]++;
              };
              if (aqi >300) {
                f++;
                dataByMonth[docs[i].month-1][5]++;
                dataByLevel[5][docs[i].month-1]++;
              };
        };
        console.log(dataByLevel);
        var response = {'dataY':[a,b,c,d,e,f],'dataM':dataByMonth,'dataL':dataByLevel};
        return response;
    }
    var initPieChart = function(response){
        
        console.log(response); 
        return {
            labels : ["Good", "Moderate", "Unhealthy for Sensitive Groups","Unhealthy","Very Unhealthy","Hazardous"],
            data : response.dataY,
            legend: true,
            options :{   
                animation: true,

                animationSteps : 50,
                segmentShowStroke : false,
                animationEasing : "easeOutBounce"

            },
            colours : ["#00cc00","#ffff00","#eb8a14","#ff0000","#993366","#904747"]
        };

    }
    var initLineChartAllY = function(docs){
    
          $http.get('/aqi_all_y',{params: {city:"beijing"}}).success(function(response) {
            console.info(JSON.stringify(response));
              response = JSON.parse(response[0].aqi);
              console.info(response[0]);
              $scope.aqi_all_bar = {
                        labels: ['2008年', '2009年', '2010年','2011年', '2012年', '2013年','2014年', '2015年'],
                        series: ['GOOD(<100)', 'BAD(>100)'],
                        data: [
                          response[0],
                          response[1]
                        ],
                        colours : ["#00cc00","#ff0000"],
                        onClick: function (points, evt) {
                          console.log(points, evt);
                        }
                };

        });
        

    }
    var initLineChartY = function(docs){
    
        if (docs.length == 0) {
          $scope.hasYValue = false;
          return;
        };
        var goodday = [];
        var badday = [];
        for (var i = 0; i < 12; i++) {
            goodday[i] = docs.dataL[0][i] + docs.dataL[1][i];
            badday[i] = docs.dataL[2][i] + docs.dataL[3][i] + docs.dataL[4][i] + docs.dataL[5][i];
        };
        $scope.aqi_y_line = {
                  labels: ['1月', '2月', '3月','4月', '5月', '6月','7月', '8月', '9月','10月', '11月', '12月'],
                  series: ['GOOD(<100)', 'BAD(>100)'],
                  data: [
                    goodday,
                    badday
                  ],
                  colours : ["#00cc00","#ff0000"],
                  onClick: function (points, evt) {
                    console.log(points, evt);
                  }
          };

    }
    var initLineChartM = function(docs){

        var days = [];
        var aqimax = [];
        var aqimin = [];
        var aqiavg = [];
        console.log(docs);
        for (var i = 0; i < docs.length; i++) {

          days.push(docs[i].day);
          aqiavg.push(docs[i].avgaqi);
          aqimin.push(docs[i].minaqi);
          aqimax.push(docs[i].maxaqi);
         
        };
        var response = {'days':days,'aqimax':aqimax,'aqimin':aqimin,'aqiavg':aqiavg};
        $scope.aqi_monthly_line = {
                  labels: response.days,
                  series: ['Max', 'AVG', 'MIN'],
                  data: [
                    response.aqimax,
                    response.aqiavg,
                    response.aqimin
                  ],
                  animationSteps : 50,
                  onClick: function (points, evt) {
                    console.log(points, evt);
                  }
          };

    }

    var getAqiPie = function(){

        $http.get('/aqipie', {params: {year:$scope.search.year,month:$scope.search.month}}).success(function(response) {
          console.log(response);

          $scope.aqi_monthly_pie = {
              labels : ["Good", "Moderate", "Unhealthy for Sensitive Groups","Unhealthy","Very Unhealthy","Hazardous"],
              data : response,
              legend: true,
              colours : ["#00cc00","#ffff00","#eb8a14","#ff0000","#993366","#904747"]
          };
      });

    };
   //getAqiPie();

    var getAqiLine = function(){

        $http.get('/aqiline_m', {params: {city:$scope.search.city,year:$scope.search.year,month:$scope.search.month}}).success(function(response) {
          console.log(response);

          $scope.aqi_monthly_line = {
                    labels: response.days,
                    series: ['Max', 'AVG', 'MIN'],
                    data: [
                      response.aqimax,
                      response.aqiavg,
                      response.aqimin
                    ],
                    onClick: function (points, evt) {
                      console.log(points, evt);
                    }
            };
      });

    };  

    getAqiLine();

    $scope.line = {
	    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
	    series: ['Series A', 'Series B'],
	    data: [
	      [65, 59, 80, 81, 56, 55, 40],
	      [28, 48, 40, 19, 86, 27, 90]
	    ],
	    onClick: function (points, evt) {
	      console.log(points, evt);
	    }
    };

    $scope.bar = {
	    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
		series: ['Series A', 'Series B'],

		data: [
		   [65, 59, 80, 81, 56, 55, 40],
		   [28, 48, 40, 19, 86, 27, 90]
		]
    	
    };

    $scope.donut = {
    	labels: ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
    	data: [300, 500, 100]
    };

    $scope.radar = {
    	labels:["Eating", "Drinking", "Sleeping", "Designing", "Coding", "Cycling", "Running"],

    	data:[
    	    [65, 59, 90, 81, 56, 55, 40],
    	    [28, 48, 40, 19, 96, 27, 100]
    	]
    };

    $scope.pie = {
    	labels : ["Download Sales", "In-Store Sales", "Mail-Order Sales"],
    	data : [300, 500, 100]
    };





    $scope.polar = {
    	labels : ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"],
    	data : [300, 500, 100, 40, 120]
    };

    $scope.dynamic = {
    	labels : ["Download Sales", "In-Store Sales", "Mail-Order Sales", "Tele Sales", "Corporate Sales"],
    	data : [300, 500, 100, 40, 120],
    	type : 'PolarArea',

    	toggle : function () 
    	{
    		this.type = this.type === 'PolarArea' ?
    	    'Pie' : 'PolarArea';
		}
    };
}]);