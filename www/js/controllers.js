angular.module('starter.controllers', [])

  .controller('AppCtrl', ["$scope", "$rootScope", "$state", "$stateParams","$ionicModal", "$cordovaAppRate", "$cordovaNetwork", "$ionicPopup", "ImageService", function($scope,$rootScope, $state, $stateParams, $ionicModal, $cordovaAppRate, $cordovaNetwork, $ionicPopup, ImageService) {
    //check network
    document.addEventListener("deviceready", function () {

      var type = $cordovaNetwork.getNetwork()

      //var isOnline = $cordovaNetwork.isOnline()

      var checkNetWork = function() {
        var isOffline = $cordovaNetwork.isOffline();
        console.log("isOffline : " + isOffline);
        if (isOffline) {
          var alertPopup = $ionicPopup.alert({
            title: 'Offline Internet Connection ',
            template: 'The internet connection is failure. Please check your network, then <e>pull down to refresh</e> !'
          });

          alertPopup.then(function (res) {
            checkNetWork();
          });
        }
      }

      checkNetWork();

      // listen for Online event
      $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
        var onlineState = networkState;
      })

      // listen for Offline event
      $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
        var offlineState = networkState;
        checkNetWork();
      })

    }, false);


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

    /*$rootScope.openModal = function(image) {
      $scope.imageModal = image;
      ImageService.viewImage($scope.imageModal).then(function(result){
        console.log("View .... " + image.id);
        $scope.imageModal.count_view = $scope.imageModal.count_view + 1;
      });
      $scope.modal.show();
    };*/

    $scope.imageListModal = [];

    //$scope.imageListModal and imageList are one
    $rootScope.openModal = function(imageList, index) {
      $scope.imageListModal = imageList;
      $scope.index = index;
      ImageService.viewImage($scope.imageListModal[index]).then(function(result){
        console.log("View .... " + $scope.imageListModal[index].id);
        $scope.imageListModal[index].count_view = $scope.imageListModal[index].count_view + 1;
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
      $scope.imageListModal[$scope.index].isDownload = true;

      if($rootScope.osPlatform == "iOS"){
        ImageService.downloadImageToLibrary($scope.imageListModal[$scope.index]).then(function(result){
          //$scope.$apply(function(){
          $scope.imageListModal[$scope.index].isDownload = true;
          $scope.imageListModal[$scope.index].count_download += 1;
          //})
        }, function(err){
          $scope.imageListModal[$scope.index].isDownload = false;
        });
      }else{
        ImageService.downloadImage($scope.imageListModal[$scope.index]).then(function(result){
          //$scope.$apply(function(){
          $scope.imageListModal[$scope.index].urlDownload = result;
          $scope.imageListModal[$scope.index].isDownload = true;
          $scope.imageListModal[$scope.index].count_download += 1;
          //})
        }, function(err){
          $scope.imageListModal[$scope.index].isDownload = false;
        });
      }
    }

    //favorite image
    $scope.favoriteImage = function(){
      $scope.imageListModal[$scope.index].isFavorite = true;
      ImageService.favoriteImage($scope.imageListModal[$scope.index]).then(function(result){
        //$scope.$apply(function(){
        $scope.imageListModal[$scope.index].isFavorite = true;
        $scope.imageListModal[$scope.index].count_favorite += 1;
        //})
      }, function(){
        $scope.imageListModal[$scope.index].isFavorite = false;
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

    //onSwipeRightModal
    $scope.onSwipeRightModal = function(){
      if($scope.index > 1){
        $scope.index = $scope.index - 1;
      }
    }

    //onSwipeLeftModal
    $scope.onSwipeLeftModal = function(){
      if($scope.index < $scope.imageListModal.length - 2) {
        $scope.index = $scope.index + 1;
      }
    }

  }])

  .controller('BrowseCtrl', ["$scope", "$rootScope","ImageService", function($scope, $rootScope, ImageService) {
    console.log("BrowseCtrl");
  }])

  //recent
  .controller('RecentCtrl', ["$scope", "$rootScope","ImageService", function($scope, $rootScope, ImageService) {
    console.log("RecentCtrl");
    $scope.isRecentLoading = true;
    $scope.imageRecentList = [];
    var NUMBER = 20;
    $scope.doRefreshRecent = function(){
      ImageService.getRandomImage(NUMBER).then(function (data) {
        console.log("data : " + JSON.stringify(data));
        $scope.imageRecentList = data.results;
        $scope.isRecentLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
      }, function (err) {
        console.log("Error getting data: " + JSON.stringify(err));
        $scope.isRecentLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
    $scope.doRefreshRecent();

    $scope.$broadcast("network.recentReload", function(){
      $scope.doRefreshRecent();
    });
  }])

  //top view
  .controller('TopViewCtrl', ["$scope", "$rootScope","ImageService", function($scope, $rootScope, ImageService) {
    console.log("TopViewCtrl");
    $scope.isTopViewLoading = true;
    $scope.imageTopViewList = [];
    var page = 1;
    var PER_PAGE = 20;
    $scope.doRefreshTopView = function() {
      ImageService.getSearchImage(page, PER_PAGE, "count_view", "DESC", 0, "").then(function (data) {
        console.log("data : " + JSON.stringify(data));
        $scope.imageTopViewList = data.results.items;
        $scope.isTopViewLoading = false;
        $scope.$broadcast('scroll.refreshComplete');

      }, function (err) {
        console.log("Error getting data: " + JSON.stringify(err));
        $scope.isTopViewLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
    $scope.doRefreshTopView();
  }])

  //top favorite
  .controller('TopFavoriteCtrl', ["$scope", "$rootScope","ImageService", function($scope, $rootScope, ImageService) {
    console.log("TopFavoriteCtrl");
    $scope.isTopFavoriteLoading = true;
    $scope.imageTopFavoriteList = [];
    var page = 1;
    var PER_PAGE = 20;
    $scope.doRefreshTopFavorite = function() {
      ImageService.getSearchImage(page, PER_PAGE, "count_favorite", "DESC", 0, "").then(function (data) {
        console.log("data : " + JSON.stringify(data));
        $scope.imageTopFavoriteList = data.results.items;
        $scope.isTopFavoriteLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
      }, function (err) {
        console.log("Error getting data: " + JSON.stringify(err));
        $scope.isTopFavoriteLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

    $scope.doRefreshTopFavorite();
  }])

  //top download
  .controller('TopDownloadCtrl', ["$scope", "$rootScope","ImageService", function($scope, $rootScope, ImageService) {
    console.log("TopDownloadCtrl");
    $scope.isTopDownloadLoading = true;
    $scope.imageTopDownloadList = [];
    var page = 1;
    var PER_PAGE = 20;
    $scope.doRefreshTopDownload = function() {
      ImageService.getSearchImage(page, PER_PAGE, "count_download", "DESC", 0, "").then(function (data) {
        console.log("data : " + JSON.stringify(data));
        $scope.imageTopDownloadList = data.results.items;
        $scope.isTopDownloadLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
      }, function (err) {
        console.log("Error getting data: " + JSON.stringify(err));
        $scope.isTopDownloadLoading = false;
        $scope.$broadcast('scroll.refreshComplete');
      });
    }
    $scope.doRefreshTopDownload();
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
        categoryName = "Image";
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

      if ($scope.categoryId > 0) {
        $scope.current = {};
        $scope.current.currentPage = 1;
        $scope.totalItems = 0;
        loadImage($scope.current.currentPage);
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
  }])

  .controller('DemoCtrl', ["$scope", "$rootScope" , function($scope, $rootScope) {
    console.log("DemoCtrl");
  }]);
