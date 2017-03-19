var app=angular.module("myApp",["ngRoute","ngAnimate"])
.controller("mainCtrol",["$scope","$http",function($scope,$http){
	$scope.page={pageNum:1};	
}])
.config(["$routeProvider",function($routeProvider){
	$routeProvider
	.when("/home",{"templateUrl":"static/templates/pages/home.html"})
	.when("/search",{"templateUrl":"static/templates/pages/search.html"})
	.when("/regist",{"templateUrl":"static/templates/pages/regist.html"})
	.when("/stadium/:id",{"templateUrl":"static/templates/pages/stadium.html"})
	.otherwise({"redirectTo":"/home"})
}])
.controller("homeCtrl",["$scope","$http","$location","$ydSearch",function($scope,$http,$location,$ydSearch){
	$scope.page.pageNum=1;
	$scope.goSearch=function(id){
		// 切换  searchCtrl 里面的搜索条件（控制器传参:$rootScope,服务 ;$broadCast $emit）
		// searchInfo.category_id;
		// 跳转到 search 路由里面
		$ydSearch.category_id=id;// 改变的服务的数据；
		$location.path("/search");
//		console.log($ydSearch)
	}
	
}])
.controller("searchCtrl",["$scope","$http","$ydSearch",function($scope,$http,$ydSearch){
	$scope.page.pageNum=2;	
//	$scope.provinces=null;// 省份数据
	$scope.citys=[];// 城市数据
	$scope.searchInfo={
		city_id:'',//城市id
		district_id:'',//区域id
		start:'',//从第jige
		sort:"",//排序 0/1
		start_dates:'',//开始日期
		start_time:'',//结束时间
		category_id:'',//场馆类型
		cbd_id:'',//商圈id
		facility_id:'',//条件
		keyword:'' // 搜索关键字
	};// 当前查询 场馆的条件
	// 让$ydSearch的数据和 searchInfo 的数据合并
	$scope.searchInfo=angular.extend($scope.searchInfo,$ydSearch);
//	console.log($scope.searchInfo)
	
	// $.param($scope.searchInfo)
    //city_id=320100&district_id=&start=&sort=1&start_dates=&start_time=&category_id=&cbd_id=&facility_id=&keyword=
	$scope.searchOptions={};// 可供选择的条件
	$scope.stadiums=[];     // 场馆信息
    $scope.currentCity={};
    // 第一个大步骤  获取城市列表 
	$http.get("http://platform-api.1yd.me/api/meta-data/cities")
	.success(function(res){	
		$scope.provinces=res.provinces;
		for(var i=0;i<$scope.provinces.length;i++){
			// 循环省
			for(var j=0;j<$scope.provinces[i].citys.length;j++){
				// 循环市	
				$scope.citys.push($scope.provinces[i].citys[j])
			}		
		}
		$scope.currentCity=$scope.citys[0];// 默认查询条件的城市 等于城市列表的第0个
		$scope.searchInfo.city_id=$scope.currentCity.city_id;
		$scope.getSearchOptions();// 获得查询的条件 
	    $scope.getStadiums();//获取场馆
	})
	// 设置当前城市
	$scope.setCurrentCity=function(item){
		$scope.currentCity=item;// 设置当前城市
		$scope.searchInfo.city_id=item.city_id;	
		$scope.getSearchOptions();// 获得查询的条件 
	    $scope.getStadiums();//获取场馆
	}
	
	$scope.getSearchOptions=function(){
		// 获得查询的条件 
		$http.get("http://platform-api.1yd.me/api/meta-data/"+$scope.currentCity.city_id)
	    .success(function(res){
	    	$scope.searchOptions=res;
//	    	console.log($scope.searchOptions);
	    })
	}
    $scope.getStadiums=function(){
		//获取场馆
	    $http.get("http://platform-api.1yd.me/api/stadium_resources?"+$.param($scope.searchInfo))
	    .success(function(res){
	    	$scope.stadiums=res;	
	    	
	    })
	}
	$scope.loadMoreStadiums=function(){
		var start=$scope.searchInfo.start=0;
		start+=10;
		 $http.get("http://platform-api.1yd.me/api/stadium_resources?"+$.param($scope.searchInfo))
		 .success(function(res){
		 	$scope.stadiums=$scope.stadiums.concat(res);
		 })
	}
}])
.controller("registCtrl",["$scope","$http",function($scope,$http){
	$scope.page.pageNum=3;
}])
.controller("stadiumCtrl",["$scope","$http","$routeParams","$filter",function($scope,$http,$routeParams,$filter){
	$scope.page.pageNum=2;
	//属性
	$scope.stadiumId=$routeParams.id;//场馆唯一标识符
	$scope.stadiumInfo=null;//场馆信息
	$scope.today=new Date();//当天的日期
	$scope.currentDay=null;//当前默认选择的日期
	$scope.datelist=[];//日期列表
	$scope.stadiumFields=[];//场馆的场地列表
	$scope.selectedFields=[];//用户选择的场地列表
	$scope.user={};
	//方法
	$scope.getStadiumInfo=function(){
		$http.get("http://platform-api.1yd.me/api/stadiums/"+$scope.stadiumId)
		.success(function(res){
			$scope.stadiumInfo=res;
		})
	}// 获取场馆信息
	$scope.getDateList=function(){
		var ArrWeek=["星期天","星期一","星期二","星期三","星期四","星期五","星期六"];
		// 循环7次 添加到 $scope.datelist 列表里面去 
		// 每循环i次 被添加的日期就会比当前的日期（today）多i天
		for(var i=0;i<7;i++){
			var obj={};
			obj.d=new Date($scope.today.getFullYear(),$scope.today.getMonth(),$scope.today.getDate()+i);
			obj.w=ArrWeek[obj.d.getDay()];
			$scope.datelist.push(obj);
		}
		$scope.currentDay=$scope.datelist[0];
//		console.log($scope.datelist);
	}// 获取日期列表
	$scope.setDay=function(item){
		$scope.currentDay=item;
//		$scope.stadiumFields=item.stadiumFields;
		$scope.getStadiumFields();
	}
	$scope.getStadiumFields=function(){
		var d=$filter('date')($scope.currentDay.d,'yyyy-MM-dd');
		
		$http.get("http://platform-api.1yd.me/api/stadiums/"+$scope.stadiumId+"/field_resources?date="+d)
		.success(function(res){
			$scope.stadiumFields=res;
//			console.log($scope.stadiumFields);
		})
	}//获取场馆的场地信息
	
	$scope.$watch("stadiumFields",function(){
    	 // 打勾的 会被push 到 selectedFields
    	 //$scope.selectedFields        设置 用户选择的场地列表
    	 $scope.selectedFields=[];
    	 for(var i=0;i<$scope.stadiumFields.length;i++){
    	 	// 循环场馆
    	 	// 循环场馆的时间段
    	 	for(var k=0;k<$scope.stadiumFields[i].field_resource.length;k++){
    	 		if($scope.stadiumFields[i].field_resource[k].resource_status=="selected"){
    	 			
    	 			$scope.selectedFields.push($scope.stadiumFields[i].field_resource[k]);
    	 		}
    	 	}
    	 }   	 
    },true)
	$scope.setStatus=function(col,name){
    	if(col.resource_status=='ordered'){return}
    	if(col.resource_status=='selected'){
    		col.resource_status='free';
    	}else{
    		col.resource_status='selected';
    		col.field_name=name;
    	}    	
    }
	$scope.getuser=function(){
		$http.get("http://platform-api.1yd.me/api/stadiums/"+$scope.stadiumId+"/comments?size=10&start=0")
		.success(function(res){
			$scope.user=res;
		})
		
	}
	$scope.getStadiumInfo();// 默认获取当前的场馆信息
	$scope.getDateList();// 默认的获取日期列表
	$scope.getStadiumFields();// 默认获场馆的场地列表
	$scope.getuser();
}])
.factory("$ydSearch",[function(){
	return {
		category_id:''//场馆类型
	}
}])