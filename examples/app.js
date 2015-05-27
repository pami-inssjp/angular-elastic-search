var module = angular.module('module',["elastic.search","ui.bootstrap"]);


module.config(['$elasticsearchProvider',function($elasticsearchProvider){

  //$elasticsearchProvider.setUrl("http://10.0.205.248:9200");
  //$elasticsearchProvider.setUrl("http://dev-asthenis-es01:9200");
  $elasticsearchProvider.setConfig({
    url:"http://localhost:9200",
    size:20,
    cssClass:"bold"
  });

}]);


module.controller('ExampleController',["$scope","$elasticsearch",function($scope,$elasticsearch){

  $scope.init = function(){
  }

  $scope.search = function(value){
    var fields = ["nombre","apellido"];
    return $elasticsearch.fuzzy("pacientes",fields,value,false).then(function(response){
      return response;
    });
  };


}]);



module.controller('TemplateController',["$scope",function($scope){

    $scope.label = function(model){

      return model.apellido + ", " +model.mombre;
    };
}]);
