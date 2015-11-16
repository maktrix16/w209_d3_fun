myApp.controller('locsCtrl', function($scope,locFactory){
	$scope.locs = [];

	//chart variables
	$scope.bus_x=["bus_x"];
	$scope.bus=["bus"];
	$scope.walk_x=["walk_x"];
	$scope.walk=["walk"];

	//Call data from factory and call chart creating function
	locFactory.getLocs(function(data){
		$scope.locs = data;
  	showChart($scope.locs);
	});

	//Checkbox query
	 $scope.checkboxModel = {
    value1 : true,
    value2 : true,
    value3 : true,
    value4 : true,
    value5 : true,
    value6 : true,
    value7 : true,
    value8 : true
  };

  $scope.checkboxQuery = {
  	
  }

// 	$scope.editUser = function(){
// 		userFactory.editUser($scope.changeUser,$routeParams.userId,function(data){
// 			$scope.user = data;
// 		});
// 		$scope.changeUser = {};
// 	}


	//main function for creating the chart
	function showChart(data_locs){
		//split data into bus and walk modes
		for (var i=0; i<$scope.locs.length; i++){
			if ($scope.locs[i]['transport']=='NA'){
				$scope.walk_x.push($scope.locs[i]['longitude']);
				$scope.walk.push($scope.locs[i]['latitude']);
			}
		}
		for (var i=0; i<$scope.locs.length; i++){
			if ($scope.locs[i]['transport']=='bus'){
				$scope.bus_x.push($scope.locs[i]['longitude']);
				$scope.bus.push($scope.locs[i]['latitude']);
			}
		}

		//check results at console
		console.log($scope.walk_x);
		console.log($scope.walk);
		console.log($scope.bus_x);
		console.log($scope.bus);

		//using example from http://c3js.org/samples/chart_scatter.html and plug in our own data
		$scope.test_chart1 = c3.generate({
			bindto: "#test-chart1",
		  data: {
	      xs: {
	        bus: 'bus_x',
	        walk: 'walk_x',
	      },
	      columns: [
	      	// ["bus_x",1,0],
	      	// ["walk_x",0.5,0],
	      	// ["bus",1,0],
	      	// ["walk",0.5,0]
	      	$scope.bus_x,
	      	$scope.walk_x,
	      	$scope.bus,
	      	$scope.walk
	      ],
	      type: 'scatter'
	    },
	    axis: {
	      x: {
	        label: 'x-coordinate'
	      },
	      y: {
	  	    label: 'y-coordinate'
	      }
	    }
	  });		
	
  
		//original example: http://c3js.org/samples/chart_scatter.html
		$scope.test_chart2 = c3.generate({
			bindto: "#test-chart2",
		  data: {
	      xs: {
	          setosa: 'setosa_x',
	          versicolor: 'versicolor_x',
	      },
	      // iris data from R
	      columns: [
	          ["setosa_x", 3.5, 3.0, 3.2, 3.1, 3.6, 3.9, 3.4, 3.4, 2.9, 3.1, 3.7, 3.4, 3.0, 3.0, 4.0, 4.4, 3.9, 3.5, 3.8, 3.8, 3.4, 3.7, 3.6, 3.3, 3.4, 3.0, 3.4, 3.5, 3.4, 3.2, 3.1, 3.4, 4.1, 4.2, 3.1, 3.2, 3.5, 3.6, 3.0, 3.4, 3.5, 2.3, 3.2, 3.5, 3.8, 3.0, 3.8, 3.2, 3.7, 3.3],
	          ["versicolor_x", 3.2, 3.2, 3.1, 2.3, 2.8, 2.8, 3.3, 2.4, 2.9, 2.7, 2.0, 3.0, 2.2, 2.9, 2.9, 3.1, 3.0, 2.7, 2.2, 2.5, 3.2, 2.8, 2.5, 2.8, 2.9, 3.0, 2.8, 3.0, 2.9, 2.6, 2.4, 2.4, 2.7, 2.7, 3.0, 3.4, 3.1, 2.3, 3.0, 2.5, 2.6, 3.0, 2.6, 2.3, 2.7, 3.0, 2.9, 2.9, 2.5, 2.8],
	          ["setosa", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
	          ["versicolor", 1.4, 1.5, 1.5, 1.3, 1.5, 1.3, 1.6, 1.0, 1.3, 1.4, 1.0, 1.5, 1.0, 1.4, 1.3, 1.4, 1.5, 1.0, 1.5, 1.1, 1.8, 1.3, 1.5, 1.2, 1.3, 1.4, 1.4, 1.7, 1.5, 1.0, 1.1, 1.0, 1.2, 1.6, 1.5, 1.6, 1.5, 1.3, 1.3, 1.3, 1.2, 1.4, 1.2, 1.0, 1.3, 1.2, 1.3, 1.3, 1.1, 1.3],
	      ],
	      type: 'scatter'
		  },
		  axis: {
		      x: {
		          label: 'Sepal.Width',
		          tick: {
		              fit: false
		          }
		      },
		      y: {
		          label: 'Petal.Width'
		      }
		  }
		});
  
		setTimeout(function () {
		  $scope.test_chart2.load({
		    xs: {
		        virginica: 'virginica_x'
		    },
		      columns: [
		          ["virginica_x", 3.3, 2.7, 3.0, 2.9, 3.0, 3.0, 2.5, 2.9, 2.5, 3.6, 3.2, 2.7, 3.0, 2.5, 2.8, 3.2, 3.0, 3.8, 2.6, 2.2, 3.2, 2.8, 2.8, 2.7, 3.3, 3.2, 2.8, 3.0, 2.8, 3.0, 2.8, 3.8, 2.8, 2.8, 2.6, 3.0, 3.4, 3.1, 3.0, 3.1, 3.1, 3.1, 2.7, 3.2, 3.3, 3.0, 2.5, 3.0, 3.4, 3.0],
		          ["virginica", 2.5, 1.9, 2.1, 1.8, 2.2, 2.1, 1.7, 1.8, 1.8, 2.5, 2.0, 1.9, 2.1, 2.0, 2.4, 2.3, 1.8, 2.2, 2.3, 1.5, 2.3, 2.0, 2.0, 1.8, 2.1, 1.8, 1.8, 1.8, 2.1, 1.6, 1.9, 2.0, 2.2, 1.5, 1.4, 2.3, 2.4, 1.8, 1.8, 2.1, 2.4, 2.3, 1.9, 2.3, 2.5, 2.3, 1.9, 2.0, 2.3, 1.8],
		      ]
		  });
		}, 1000);

		setTimeout(function () {
		  $scope.test_chart2.unload({
		      ids: 'setosa'
		  });
		}, 2000);

		setTimeout(function () {
		  $scope.test_chart2.load({
		      columns: [
		          ["virginica", 0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.3, 0.2, 0.2, 0.1, 0.2, 0.2, 0.1, 0.1, 0.2, 0.4, 0.4, 0.3, 0.3, 0.3, 0.2, 0.4, 0.2, 0.5, 0.2, 0.2, 0.4, 0.2, 0.2, 0.2, 0.2, 0.4, 0.1, 0.2, 0.2, 0.2, 0.2, 0.1, 0.2, 0.2, 0.3, 0.3, 0.2, 0.6, 0.4, 0.3, 0.2, 0.2, 0.2, 0.2],
		        ]
		  });
		}, 3000);

  }
});  
 


		// $scope.addUser = function(){
		// 	userFactory.addUser($scope.newUser, function(data){
		// 		$scope.users = data;
		// 	});
		// 	$scope.newUser={};
		// }
		// $scope.removeUser = function(user){
		// 	userFactory.removeUser($scope.users.indexOf(user),function(data){
		// 		$scope.users = data;
		// 	});
		// }



// myApp.controller('usersDetailCtrl', function($scope,$routeParams,userFactory){
// 	$scope.user = {};
// 	userFactory.getOneUser($routeParams.userId,function(data){
// 		$scope.user = data;
// 	});
// 	$scope.editUser = function(){
// 		userFactory.editUser($scope.changeUser,$routeParams.userId,function(data){
// 			$scope.user = data;
// 		});
// 		$scope.changeUser = {};
// 	}
// });
