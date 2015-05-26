var module = angular.module('module',["elastic.search","ui.bootstrap"]);


module.config(['$elasticsearchProvider',function($elasticsearchProvider){

  //$elasticsearchProvider.setUrl("http://10.0.205.248:9200");
  //$elasticsearchProvider.setUrl("http://dev-asthenis-es01:9200");
  $elasticsearchProvider.setUrl("http://localhost:9200");

}]);


module.controller('ExampleController',["$scope","$elasticsearch",function($scope,$elasticsearch){

  $scope.init = function(){
    console.log("init");
    console.log($elasticsearch);
  }

  $scope.search = function(value){
    console.log(value);
    var fields = ["nombre"];
    return $elasticsearch.fuzzy("pacientes",fields,value).then(function(response){
      console.log(response);
      return response;
    });
  };








}]);



module.controller('TemplateController',["$scope",function($scope){

    $scope.label = function(model){

      return model.apellido + ", " +model.mombre;
    };
}]);
