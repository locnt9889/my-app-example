/**
 * Created by LocNT on 12/14/15.
 */

angular.module('ionic.ion.imageCacheFactoryCustom', [])

  .factory('$ImageCacheFactoryCustom', ['$q', function($q) {
    return {
      Cache: function(urls) {
        if (!(urls instanceof Array))
          return $q.reject('Input is not an array');

        var promises = [];

        for (var i = 0; i < urls.length; i++) {
          var deferred = $q.defer();
          var img = new Image();

          img.onload = (function(deferred) {
            return function(){
              deferred.resolve();
            }
          })(deferred);

          img.onerror = (function(deferred,url) {
            return function(){
              deferred.reject(url);
            }
          })(deferred,urls[i].image);

          promises.push(deferred.promise);
          img.src = urls[i].image;
        }

        return $q.all(promises);
      }
    }
  }]);
