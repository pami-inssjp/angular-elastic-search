# Angular Elasticsearch

Esta lib contiene un provider para AngularJS que nos permite configurar un endpoint de Elasticsearch para poder utilizarlo como servicio.


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

En la carpeta `/dist` se encuentra los archivos minificados finales.

## Modo de uso

### Consideraciones

Este componente de AngularJS no es una _directive_, sino que es un _service_. Abstrae la llamada por REST a un Elasticsearch, cuya ruta se configura en un _provider_. Es compatible con **Angular BootstrapUI**. Para un mejor ejemplo revisar la carpeta `examples` donde se podrá encontrar una pequeña app AngularJS con el **angular-elastic-search** y `typeahead` de **Angular BootstrapUI**

### Pasos a seguir

* Primero debemos agregar la dependencia de bower

` bower install --save 'git@github.com:pami-inssjp/angular-elastic-search#v1.0.0'`

* Luego tenemos que importar en nuestro `index.html` el servicio.

```javascript
<script src="bower_components/angular-elastic-search/dist/angular-elastic-search.min.js" charset="utf-8"></script>
```

* Crear la clase CSS para realizar el highlight del texto encontrado e importarlo dentro del `index.html`

```css
.bold{
  font-weight: bold;
}
```

* En el módulo principal de nuestra aplicación angular agregamos la dependencia al módulo del servicio, lo inyectamos en la configuración y allí mismo le pasamos los parámetros que va a utlizar.

```javascript

// Importar el modulo de elastic ("elastic.search")
var module = angular.module('module',["elastic.search"]);


// Inyectar el $elasticsearchProvider para poder configurar el
// servicio
module.config(['$elasticsearchProvider',function($elasticsearchProvider){


  // Primero configuro el elasticsearch

  // Le paso URL del elastic
  // La cantidad de resultados por búsqueda
  // La clase CSS para el highlight

  $elasticsearchProvider.setConfig({
    url:"http://localhost:9200",
    size:20,
    cssClass:"bold"
  });

}]);
```
* Luego en el controller que vamos a utilizar lo inyectamos, y ejecutamos la función de _fuzzy search_.


```javascript

// Inyectar al controller el service de elastic ($elasticsearch)

module.controller('ExampleController',["$scope","$elasticsearch",function($scope,$elasticsearch){

  $scope.search = function(value){

    // Defino los campos por los cuales voy a hacer una busqueda fuzzy
    var fields = ["nombre","apellido"];

    // LLamo al elastic y le envío:
    // El index sobre el cual quiero hacer la query
    // Los campos sobre los que se buscan
    // El valor de busqueda
    // Si la respuesta va a tener hightlight o no
    return $elasticsearch.fuzzy("indice",fields,value,true).then(function(response){

      //La respuesta devuelve el objeto correspondiente

      return response;
    });
  };

}]);

```

## Manejo de Errores

`$elasticsearch.fuzzy(...)` devuelve una `$promise` de `$http`. En caso de ser satisfactoria la respuesta devuelve una lista de los objetos buscados. Pero en caso de haberse producido un error devuelve el response `$http`. Para poder manejar la respuesta en caso de error hay que enviarle dos parámetros a la función `.then()`, las cuales deberán ser dos funciones que reciben como único parámetro el _response_. Por ejemplo:

```javascript
$elasticsearch.fuzzy("indice",fields,value,true)
  .then(
    function(okResponse){
      //Manejo la respuesta satisfactoria
    },
    function(errorResponse){
      //Manejo el error
    });
```

Observen que el then recibe dos parámetros: una función para el caso correcto y otra para el error. Allí dentro deberán manejar el error y hacer con la respuesta lo que crean correcto.

## License

MIT

## Contributors
* Adriel Paredes <adriel.paredes@gmail.com> <aparedes@redhat.com>
