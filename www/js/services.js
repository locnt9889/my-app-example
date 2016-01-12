angular.module('starter.services', [])
  .factory('ImageService', function($q, $http, $rootScope, $cordovaFileTransfer, $timeout, $cordovaToast) {
    var DOMAIN = "http://6recipes.com:5555";

    return {
      getSearchImage: function(page, perPage, orderBy, orderType, categoryId, name) {
        var deferred = $q.defer();

        var url = DOMAIN + "/rest/image/search?pageNum=" + page +"&perPage=" + perPage + "&orderBy=" + orderBy + "&orderType=" + orderType;
        if(categoryId > 0){
          url = url + "&category=" + categoryId;
        }

        if(name && name != ""){
          url = url + "&name=" + name;
        }

        $http.get(url).then(function(res){
          deferred.resolve(res.data);
        }, function(err){
          deferred.reject(err);
        });

        return deferred.promise;
      },
      getRandomImage: function(number) {
        var deferred = $q.defer();

        var url = DOMAIN + "/rest/image/find-random?number=" + number;
        $http.get(url).then(function(res){
          deferred.resolve(res.data);
        }, function(err){
          deferred.reject(err);
        });

        return deferred.promise;
      },
      getByCategory: function(page, perPage, categoryId) {
        var deferred = $q.defer();

        //var url = "http://104.131.166.42:5002/image/find-by-category?page=" + page +"&perPage=" + perPage + "&category_id=" + categoryId;
        var url = DOMAIN + "/rest/image/search?pageNum=" + page +"&perPage=" + perPage + "&category=" + categoryId;
        console.log("getByCategory url " + url);
        $http.get(url).then(function(res){
          deferred.resolve(res.data);
        }, function(err){
          deferred.reject(err);
        });

        return deferred.promise;
      },
      getExtendedFileByUrl : function(url){
        var ext = "png";
        if(url && url.indexOf(".") > 0){
          var array = url.split(".");
          if(array.length > 1){
            ext = array[array.length - 1];
          }
        }

        return ext;
      },
      favoriteImage : function (image) {
        var deferred = $q.defer();

        var url = DOMAIN + "/rest/image/execute?id=" + image.id + "&type=FAVORITE";
        $http.get(url).then(function(res){
          $cordovaToast.showShortTop('Favotited : ' + image.id);
          deferred.resolve(res.data);
        }, function(err){
          deferred.reject(err);
        });

        return deferred.promise;
      },
      viewImage : function (image) {
        var deferred = $q.defer();

        var url = DOMAIN + "/rest/image/execute?id=" + image.id + "&type=VIEW";
        $http.get(url).then(function(res){
          deferred.resolve(res.data);
        }, function(err){
          deferred.reject(err);
        });

        return deferred.promise;
      },
      downloadImage : function (image) {
        var deferred = $q.defer();

        //var ext = this.getExtendedFileByUrl(url);
        var url = image.img640;
        var filename = url.split("/").pop();
        var targetPath = cordova.file.externalRootDirectory + "Download/ImageGalleryDownloads/" + "Image_" + image.id + "_" +filename;

        if($rootScope.osPlatform == "iOS"){
           targetPath = cordova.file.documentsDirectory + "ImageGalleryDownloads/" + "Image_" + image.id + "_" +filename;
           console.log("targetPath : " + targetPath);
        }
        var trustHosts = true;
        var options = {};

        //downloading
        $cordovaToast.showShortTop('Downloading...');
        $cordovaFileTransfer.download(url, targetPath, options, trustHosts).then(function(result) {
          console.log("download success");
          image.urlDownload = result.nativeURL;

          console.log("url download : " + result.nativeURL);

          $cordovaToast.showLongTop('Downloaded : ' + image.id);

          var url = DOMAIN + "/rest/image/execute?id=" + image.id + "&type=DOWNLOAD";
          $http.get(url).then(function(res){
            console.log("increase download success");
            //deferred.resolve(res.data);
          }, function(err){
            console.log("increase download error");
            //deferred.reject(err);
          });

          deferred.resolve(result.nativeURL);
        }, function(err) {
          console.log("download error");
          $cordovaToast.showLongTop('Download error');
          deferred.reject(err);
        }, function (progress) {
          $timeout(function () {
            var downloadProgress = $filter('number')((progress.loaded / progress.total) * 100, 2);
            console.log('Download Progress : ' + downloadProgress + "%");
          })
        });

        return deferred.promise;
      },
      downloadImageToLibrary : function (image) {
        var deferred = $q.defer();
        $cordovaToast.showShortTop('Downloading...');
        var url = image.img640;
        var canvas = document.getElementById("myCanvasForDownload");
        var context = canvas.getContext("2d");

        var imageObj = new Image();
        imageObj.src = url;

        imageObj.onload = function () {
          context.drawImage(imageObj, 0, 0);
          window.canvas2ImagePlugin.saveImageDataToLibrary(
            function(msg){
              console.log("saveImageDataToLibrary msg" + msg);
              image.urlDownload = url;
              $cordovaToast.showLongTop('Downloaded : ' + image.id);

              var url = DOMAIN + "/rest/image/execute?id=" + image.id + "&type=DOWNLOAD";
              $http.get(url).then(function(res){
                console.log("increase download success");
                //deferred.resolve(res.data);
              }, function(err){
                console.log("increase download error");
                //deferred.reject(err);
              });

              deferred.resolve(msg);
            },
            function(err){
              console.log("saveImageDataToLibrary err" + err);
              $cordovaToast.showLongTop('Download error');
            },
            document.getElementById('myCanvasForDownload')
          );
        };

        return deferred.promise;
      }

    };
  })
.factory('CategoryService', function($q, $http) {
    var DOMAIN = "http://6recipes.com:5555";

  return {
    getAllCategory: function() {
      var deferred = $q.defer();

      //var url = "http://104.131.166.42:5002/category/findall";
      var url = DOMAIN + "/rest/category/all";
      $http.get(url).then(function(res){
        deferred.resolve(res.data);
      }, function(err){
        deferred.reject(err);
      });

      return deferred.promise;
    },
    getNameByIdInList: function(categorisList, id) {
      var nameDefault = "Image";
      if(categorisList == undefined){
        return nameDefault;
      }

      if(categorisList.length == 0){
        return nameDefault;
      }

      for(var i = 0; i < categorisList.length; i++){
        if(id == categorisList[i].id){
          return "Image of " + categorisList[i].name;
        }
      }

      return nameDefault;
    }
  };
});
