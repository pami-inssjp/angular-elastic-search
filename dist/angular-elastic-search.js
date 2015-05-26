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

  self = this;

  var config = {
    url:"",
    size:10,
    cssClass :""
  };

  this.setConfig = function(config){
    self.config = config;
  };


  this.$get = ["$http",function($http){
    return new ElasticSearch($http,self.config);
  }];

});




function ElasticSearch($http,config){

    self = this;
    this.url = config.url;

    this.buildQuery = function(index){

      return this.url+"/"+index+"/_search";

    };

    this.search = function(index,fields,query,transformation){
      var q = this.buildQuery(index);

      var params = {
        size: config.size
      };

      var fieldsToHigh = this.fieldsToHighlight(fields);
      var body = self.createBody(fields,query,fieldsToHigh,config.cssClass);

      return $http.post(q,body,{params:params}).then(function(response){
        var data = response.data;
        return data.hits.hits.map(transformation);
      });

    };


    this.createBody = function(fields,query,fieldsToHigh,cssClass){
      return {
        query: {
          fuzzy_like_this : {
            fields : fields,
            like_text : query
          }
          },
          highlight : {
              pre_tags : ['<span class=\"'+cssClass+'\">'],
              post_tags : ["</span>"],
              fields : fieldsToHigh
          }

      };
    };


      this.fieldsToHighlight = function(fields){
            var response = {};
            fields.forEach(function(field){
              response[field] = {force_source : true};
            });
        return response;
      };

    this.fuzzyWithHighlights = function(index,fields,query){

      return this.search(index,fields,query,function(elem){

        var item = elem._source;
        var highlights = elem.highlight;

        fields.forEach(function(field){

          var fieldName = self.generateHighlightedFieldName(field);
          var highlightedField = highlights[field];
          if(highlightedField !== undefined){
            // Si esta existe el campo en highlight entonces
            // reemplazo el valor original por el highlight;
            item[fieldName] = highlightedField[0];
          }else{
            // En caso contrario escribo el campo pero uso el valor original
            item[fieldName] = item[field];
          }
        });
        return item;
      });
    };

    this.generateHighlightedFieldName = function(field){
      return field+"_highlighted";
    };

    this.fuzzyWithoutHighlights = function(index,fields,query){
      return this.search(index,fields,query,function(elem){
        return elem._source;
      });
    };


    this.fuzzy  = function(index,fields,query,highlight){
      if(highlight === true){
        return this.fuzzyWithHighlights(index,fields,query);
      }else{
        return this.fuzzyWithoutHighlights(index,fields,query);
      }
    };

}

})();
