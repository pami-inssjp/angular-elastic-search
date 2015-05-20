# Angular Elastic Search

Esta lib contiene un provider para AngularJS, que nos permite configurar un enpoint de elastic search para poder utilizarlo como servicio.


## Build

### Dependencias

* NPM
* Grunt
* Bower
 
### Comandos

Resolver las dependencias de NPM:
`npm install`

Resolver las dependencias de Bower:
`bower install`

Ejecutar los comandos para construir DIST:
`grunt`

En la carpeta `/dist` se encuenta los archivos minificados finales.

## Modo de uso

```javascript
var module = angular.module('module',["elastic.search"]);


module.config(['$elasticsearchProvider',function($elasticsearchProvider){

  $elasticsearchProvider.setUrl("http://localhost:9200");

}]);

module.controller('ExampleController',["$scope","$elasticsearch",function($scope,$elasticsearch){

  $scope.search = function(value){
    console.log(value);
    return $elasticsearch.sources("index","key",value).then(function(response){
      console.log(response);
      return response;
    });
  };

}]);

```

## License

MIT

## Contributors
* Adriel Paredes <adriel.paredes@gmail.com> <aparedes@redhat.com>
