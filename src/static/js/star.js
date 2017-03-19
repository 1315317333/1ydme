app
.directive("star",[function(){
			return {
				restrict:"ECMA",
				template:'<span class=" glyphicon " ng-class="{\'glyphicon-star\':item.type==1,\'glyphicon-star-empty\':item.type==0}" ng-repeat="item in stars track by $index" ng-mouseout="setStar(score)" ng-mouseover="setStar($index+1)" ng-click="setScore($index+1)"></span>',
			   
			    link:function(scope,elem,attrs){
			    	
			    	scope.setStar=function(num){
//			    		console.log("out",num);
			    		scope.stars=[];
			    		for(var i=1;i<=5;i++){
				    		var star={};
				    		if(i<=num){
				    			// 实星星
				    			star.type=1;
				    		}else{
				    			// 空的星星	
				    			star.type=0;
				    		}
			    			scope.stars.push(star);
			    			// 不管空星还是实星 都添加到星星集合里面
			    		
			    		}
			    	}
			    	// 默认绘制一次星星
			    	scope.setStar(scope.score);
			    	// 改变分数 通过函数改变的会触发脏检查
			        scope.setScore=function(num){
			        	scope.score=num;
			        	console.log(scope.score);
			        }
			    	
			    },
			    scope:{score:"="},
			    // score 双向绑定
			    
			}
		}])