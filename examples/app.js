var module = angular.module('module',["elastic.search","ui.bootstrap"]);


module.config(['$elasticsearchProvider',function($elasticsearchProvider){

  $elasticsearchProvider.setUrl("http://localhost:9200");

}]);


module.controller('ExampleController',["$scope","$elasticsearch",function($scope,$elasticsearch){

  $scope.init = function(){
    console.log("init");
    console.log($elasticsearch);
  }

  $scope.search = function(criteria,value){
    console.log(value);
    return $elasticsearch.sources("jdbc",criteria,value).then(function(response){
      console.log(response);
      return response;
    });
  };





}]);
