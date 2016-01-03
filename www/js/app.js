// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','starter.directives',"ngCordova",'ui.bootstrap','ionic.ion.imageCacheFactoryCustom'])

.constant('$ionicLoadingConfig', {
    template: '<i class="icon ion-load-c"></i><br/>loading...',
    animation: 'fade-in',
    showBackdrop: false,
    maxWidth: 200,
    showDelay: 100
    //duration : 15000
  })

.run(function($ionicPlatform, $rootScope, ImageService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    $rootScope.osPlatform = "other";
    if( /(android)/i.test(navigator.userAgent) ) {
      $rootScope.osPlatform = "Android";
    } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
      $rootScope.osPlatform = "iOS";
    }

    console.log("osPlatform : " + $rootScope.osPlatform);

    if($rootScope.osPlatform == "iOS"){
      console.log("ios platform");
      ImageService.updateLastImagePathApp();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $cordovaAppRateProvider) {

  //disable swipe to back
  $ionicConfigProvider.views.swipeBackEnabled(false);

  //app rate
  document.addEventListener("deviceready", function () {

    var prefs = {
      language: 'en',
      appName: '',
      iosURL: '<my_app_id>',
      androidURL: 'market://details?id=<package_name>',
      windowsURL: 'ms-windows-store:Review?name=<...>'
    };

    $cordovaAppRateProvider.setPreferences(prefs)

  }, false);

  //config state provider
  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })

    .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html',
          controller: 'BrowseCtrl'
        }
      }
    })

    .state('app.browse.recent', {
      url: '/recent',
      views: {
        'tab-recent': {
          templateUrl: 'templates/tab-recent.html',
          controller: 'RecentCtrl'
        }
      }
    })

    .state('app.browse.view', {
      url: '/view',
      views: {
        'tab-view': {
          templateUrl: 'templates/tab-view.html',
          controller: 'TopViewCtrl'
        }
      }
    })

    .state('app.browse.favorite', {
      url: '/favorite',
      views: {
        'tab-favorite': {
          templateUrl: 'templates/tab-favorite.html',
          controller: 'TopFavoriteCtrl'
        }
      }
    })

    .state('app.browse.download', {
      url: '/download',
      views: {
        'tab-download': {
          templateUrl: 'templates/tab-download.html',
          controller: 'TopDownloadCtrl'
        }
      }
    })

    .state('app.category', {
      url: '/category',
      views: {
        'menuContent': {
          templateUrl: 'templates/category.html',
          controller: 'CategoryCtrl'
        }
      }
    })
    .state('app.image-category', {
      url: '/image-category/:category',
      views: {
        'menuContent': {
          templateUrl: 'templates/image-category.html',
          controller: 'ImageCategoryListCtrl'
        }
      }
    })
    .state('app.demo', {
        url: '/demo',
      views: {
        'menuContent': {
          templateUrl: 'templates/demo.html',
          controller: 'DemoCtrl'
        }
      }
    })
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/browse');
});
