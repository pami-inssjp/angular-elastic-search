/*
The MIT License (MIT)

Copyright (c) 2015 Instituto Nacional de Servicios Sociales para Jubilados y Pensionados

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


(function(){
  "use strict";

var module = angular.module("elastic.search",[]);


module.provider('$elasticsearch',function(){

  var url = "";
  self = this;

  this.setUrl = function(elasticUrl){
    self.url = elasticUrl;
  };

  this.$get = ["$http",function($http){
    return new ElasticSearch($http,self.url);
  }];

});




function ElasticSearch($http,elasticUrl){

    this.url = elasticUrl;

    this.buildQuery = function(index){

      return this.url+"/"+index+"/_search";

    };

    this.buildParams = function(criteria,query){
      return {
        q:criteria+":"+query
      };
    };

    this.search  = function(index,criteria,query){
      var q = this.buildQuery(index);
      var params = this.buildParams(criteria,query);
      return $http.get(q,{params:params}).then(function(response){
        return response.data;
      });
    };

    this.hits  = function(index,criteria,query){
      return this.search(index,criteria,query).then(function(response){
        return response.hits;
      });
    };

    this.sources  = function(index,criteria,query){
      return this.hits(index,criteria,query).then(function(response){
        return response.hits.map(function(elem){
          return elem._source;
        });
      });
    };

    this.fuzzy  = function(index,fields,query){
      var q = this.buildQuery(index);

      var body = {
        query: {
        fuzzy_like_this : {
          fields : fields,
          like_text : query,
          max_query_terms : 12
          }
        }
      };


      return $http.post(q,body).then(function(response){
        var data = response.data;
        console.log(data);
        return data.hits.hits.map(function(elem){
          return elem._source;
        });
      });
    };

}

})();
