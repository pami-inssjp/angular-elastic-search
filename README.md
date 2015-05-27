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

### Consideraciones

Este componente de AngularJS no es una _directive_, sino que es un _service_. Abstrae la llamada por REST a un Elastic Search, cuya ruta se configura en un _provider_. Es compatible con **Angular BootstrapUI**. Para un mejor ejemplo revisar la carpeta `examples` donde se podrá encontrar una pequeña app AngularJS con el **angular-elastic-search** y `typeahead` de **Angular BootstrapUI**

### Pasos a seguir

* Primero debemos agregar la dependencia de bower

` bower install --save 'git@github.com:pami-inssjp/angular-elastic-search#v1.0.0'`

* Luego tenemos que importar en nuestro `index.html` el servicio.

```javascript
<script src="bower_components/angular-elastic-search/dist/angular-elastic-search.min.js" charset="utf-8"></script>
```

* En el módulo principal de nuestra aplicación angular agregamos la dependencia al modulo del servicio, lo inyectamos en la configuración y allí mismo le pasamos los parámetros que va a utlizar.

```javascript

// Importar el modulo de elastic ("elastic.search")
var module = angular.module('module',["elastic.search"]);


// Inyectar esl $elasticsearchProvider para poder configurar el
// servicio
module.config(['$elasticsearchProvider',function($elasticsearchProvider){


  // Primero configuro el estastic search

  // Le paso URL del elastic
  // La cantidad de resultados por busqueda
  // La clase CSS para el highlight

  $elasticsearchProvider.setConfig({
    url:"http://localhost:9200",
    size:20,
    cssClass:"bold"
  });

}]);
```
* Luego en el controller que vamos a utilizar lo inyectamos, y ejecutamos la funcion de _fuzzy search_.


```javascript

// Inyectar al controller el service de elastic ($elasticsearch)

module.controller('ExampleController',["$scope","$elasticsearch",function($scope,$elasticsearch){

  $scope.search = function(value){

    // Defino los campos por los cuales voy a hacer una busqueda fuzzy
    var fields = ["nombre","apellido"];

    // LLamo al elastic y le envio:
    // El index sobre el cual quiero hacer la query
    // Los campos sobre los que se buscan
    // El valor de busqueda
    // Si la respuesta va a tener hightlight o no
    return $elasticsearch.fuzzy("pacientes",fields,value,true).then(function(response){

      //La respuesta devuelve el objeto correspondiente

      return response;
    });
  };

}]);

```

## License

MIT

## Contributors
* Adriel Paredes <adriel.paredes@gmail.com> <aparedes@redhat.com>
