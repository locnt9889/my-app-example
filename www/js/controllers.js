angular.module('starter.controllers', [])

  .controller('AppCtrl', ["$scope", "$rootScope", "$state", "$ionicModal", "$cordovaAppRate", "ImageService", function($scope,$rootScope, $state,$ionicModal, $cordovaAppRate, ImageService) {
    //conttrol
    $scope.goDownload = function(){
      $state.go("app.image-category",{category : 0});
    }


    // Create the image modal that we will use later
    $ionicModal.fromTemplateUrl('templates/modal-image.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $rootScope.openModal = function(image) {
      $scope.imageModal = image;
      ImageService.viewImage($scope.imageModal).then(function(result){
        console.log("View .... " + image.id);
        $scope.imageModal.count_view = $scope.imageModal.count_view + 1;
      });
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.imageModal = {};
      $scope.modal.hide();
    };

    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hide', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });
    $scope.$on('modal.shown', function() {
      console.log('Modal is shown!');
    });

    //download image
    $scope.downloadImage = function(){
      $scope.imageModal.isDownload = true;

      if($rootScope.osPlatform == "iOS"){
        ImageService.downloadImageToLibrary($scope.imageModal).then(function(result){
          //$scope.$apply(function(){
            $scope.imageModal.isDownload = true;
            $scope.imageModal.count_download = $scope.imageModal.count_download + 1;
          //})
        }, function(err){
          $scope.imageModal.isDownload = false;
        });
      }else{
        ImageService.downloadImage($scope.imageModal).then(function(result){
          //$scope.$apply(function(){
            $scope.imageModal.urlDownload = result;
            $scope.imageModal.isDownload = true;
            $scope.imageModal.count_download = $scope.imageModal.count_download + 1;
          //})
        }, function(err){
          $scope.imageModal.isDownload = false;
        });
      }
    }

    //favorite image
    $scope.favoriteImage = function(){
      $scope.imageModal.isFavorite = true;
      ImageService.favoriteImage($scope.imageModal).then(function(result){
        //$scope.$apply(function(){
          $scope.imageModal.isFavorite = true;
          $scope.imageModal.count_favorite = $scope.imageModal.count_favorite + 1;
        //})
      }, function(){
        $scope.imageModal.isFavorite = false;
      });
    }

    //make wallpaper for android
    $scope.makeWallpaper = function(){
      var imagePath = "www/img/fruit_wallpaper.jpg";             // Mention the complete path to your image. If it contains under multiple folder then mention the path from level "www" to the level your image contains with its name including its extension.
      var imageTitle = "Fruit";                     // Set title of your choice.
      var folderName = "PluginImagesDownload";                  // Set folder Name of your choice.
      var success = function() { alert("Success"); };           // Do something on success return.
      var error = function(message) { alert("Oopsie! " + message); };   // Do something on error return.

      // For setting wallpaper & saving image
      wallpaper.setImage(imagePath, imageTitle, folderName, success, error);

      // For saving image
      //wallpaper.saveImage(imagePath, imageTitle, folderName, success, error);
    }

    $scope.showRateApp = function(){
      console.log("showRateApp");
      document.addEventListener("deviceready", function () {

        $cordovaAppRate.promptForRating(true).then(function (result) {
          console.log("$cordovaAppRate.promptForRating : success");
        });
      }, false);
    }

  }])

  .controller('BrowseCtrl', ["$scope", "$rootScope","ImageService", function($scope, $rootScope, ImageService) {
    console.log("BrowseCtrl");
  }])

  .controller('CategoryCtrl', ["$scope", "$rootScope", "$ionicLoading", "CategoryService",function($scope, $rootScope, $ionicLoading, CategoryService) {
    //Controller for list category
    $ionicLoading.show();
    CategoryService.getAllCategory().then(function(data) {
      console.log("data : " + JSON.stringify(data));
      $scope.categoryList = data.results;
      $rootScope.categoryBackupList = $scope.categoryList;
      $ionicLoading.hide();
      //$scope.$apply();

    },function(err) {
      console.log("Error getting data: " + JSON.stringify(err));
      $ionicLoading.hide();
    });
  }])

  .controller('ImageCategoryListCtrl', ["$scope", "$rootScope", "$filter", "$ionicLoading", "$timeout", "$cordovaToast", "$ionicModal","$state", "$stateParams", "$ionicSlideBoxDelegate", "$cordovaFileTransfer", "$ImageCacheFactoryCustom", "ImageService" , "CategoryService",
    function($scope, $rootScope, $filter, $ionicLoading, $timeout, $cordovaToast, $ionicModal, $state, $stateParams, $ionicSlideBoxDelegate, $cordovaFileTransfer, $ImageCacheFactoryCustom, ImageService, CategoryService) {
      var PER_PAGE = 10;

      var categoryId = isNaN($stateParams.category) ? 0 : parseInt($stateParams.category);

      $scope.categoryId = categoryId;
      var categoryName = "";
      if(categoryId > 0){
        categoryName = CategoryService.getNameByIdInList($rootScope.categoryBackupList, categoryId);
      }else if(categoryId == 0){
        categoryName = "Downloaded";
      }

      $scope.categoryName = categoryName;

      $scope.isLoadingData = false;

      $scope.imageList = [];
      $scope.imageModal = {};
      var loadImage= function(page) {
        $scope.isLoadingData = true;

        $ionicLoading.show();
        ImageService.getByCategory(page, PER_PAGE, $scope.categoryId).then(function (data) {
          console.log("data : " + JSON.stringify(data));
          $ionicLoading.hide();
          $scope.imageList = data.results.items;
          $scope.totalItems = data.results.totalItems;
          $scope.isLoadingData = false;

        }, function (err) {
          console.log("Error getting data: " + JSON.stringify(err));
          $scope.isLoadingData = false;
          $ionicLoading.hide();
        });
      };

      var loadImageDownloaded= function() {
        ImageService.getDownloadList().then(function (data) {
          console.log("data : " + JSON.stringify(data));
          $scope.imageList = data;
        }, function (err) {
          console.log("Error getting data: " + JSON.stringify(err));
        });
      };

      $scope.$emit('downloaded.removeErrorSrc', function(){
        console.log("downloaded.removeErrorSrc reload");
        loadImageDownloaded();
      });

      if ($scope.categoryId > 0) {
        $scope.current = {};
        $scope.current.currentPage = 1;
        $scope.totalItems = 0;
        loadImage($scope.current.currentPage);
      }else{
        loadImageDownloaded();
      }
      //paging
      $scope.changePageNumber = function(){
        loadImage($scope.current.currentPage);
      }

      //onSwipeRight
      $scope.onSwipeRight = function(){
        if($scope.current.currentPage > 1 && !$scope.isLoadingData){
          $scope.current.currentPage = $scope.current.currentPage - 1;
          loadImage($scope.current.currentPage);
        }
      }

      //onSwipeLeft
      $scope.onSwipeLeft = function(){
        if(!$scope.isLoadingData) {
          $scope.current.currentPage = $scope.current.currentPage + 1;
          loadImage($scope.current.currentPage);
        }
      }

      $scope.openModalForImage = function(index) {
        console.log("index : " + index);
        var imageModal = {};
        if($scope.categoryId == 0){
          imageModal = $scope.imageList[index].image;
        }else{
          imageModal = $scope.imageList[index];
        }
        $rootScope.openModal(imageModal);
      };
  }])

  .controller('DemoCtrl', ["$scope", "$rootScope" , function($scope, $rootScope) {
    console.log("DemoCtrl");
  }]);
