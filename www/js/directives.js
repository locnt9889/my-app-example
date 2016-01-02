/**
 * Created by LocNT on 12/30/15.
 */
angular.module('starter.directives', [])
  .directive('errSrc', function($rootScope, ImageService) {
  return {
    link: function(scope, element, attrs) {
      element.bind('error', function() {
        console.log("removeDownloadItem " + attrs.errSrc);
        ImageService.removeDownloadItem(attrs.errSrc);
      });
    }
  }
});
