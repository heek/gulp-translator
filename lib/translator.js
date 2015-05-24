var YAML = require('yamljs');
var q = require('q');

module.exports = (function() {

  var EXPRESSION_REG = /\{{3}([\w\.\s\"\']+)\s*(\|\s+\w+)*\s*\}{3}/g;
  var FILTER_REG = /\|\s*(\w+)/g;
  var EXPRESSION_VALUE_REG = /\{{3}\s*[\'\"]?([\w\.]*)[\'\"]?/;

  var getLocale = function(dir){
    return YAML.load(dir);
  };

  var getLocaleValue = function(key, locale) {
    return key.trim().split('.').reduce(function(obj, key){
      return obj[key];
    }, locale);
  };

  // FILTERS

  var uppercase = function(content) {
    return content.toUpperCase();
  };

  var lowercase = function(content) {
    return content.toLowerCase();
  };

  // FILTERS

  var Translator = function(options){
    this.result = q.defer();
    this.locale = getLocale(options.localePath);
  };

  Translator.prototype.uppercase = uppercase;
  Translator.prototype.lowercase = lowercase;
  Translator.prototype.translate = function(content) {
    var resultPromise = q.defer();
    var self = this;

    var localeName = Object.keys(this.locale)[0];
    var localeValues = this.locale[localeName];

    var expressions = content.match(EXPRESSION_REG);
    if(expressions) {
      resultPromise.resolve(
        expressions.reduce(function(content, expression) {

        var filters = [];
        var filtersmatch = expression.match(FILTER_REG);
        if (filtersmatch != null && filtersmatch.length > 0) {
          filters = filtersmatch[0].split('|').map(function (key) {
            return key.trim();
          });
        }

        var expressionValue = getLocaleValue(
          expression.match(EXPRESSION_VALUE_REG)[1],
          localeValues
        ) || resultPromise.reject("Cannot find that key in locales " + expression);
          console.log(filters);
        var resultValue = filters.reduce(function(value, filter){
          if(self[filter] && typeof self[filter] === 'function') {
            console.log(value);
            return self[filter](value);
          } else {
            return resultPromise.reject(filter + " filter is not supported");
          }
        }, expressionValue);

        return content.replace(
          expression,
          resultValue
        );
      }, content));
    } else {
      resultPromise.resolve(content);
    }

    return resultPromise.promise;

  };

  return Translator;

}());
