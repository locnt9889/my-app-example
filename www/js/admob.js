var admobid = {};
if( /(android)/i.test(navigator.userAgent) ) {
    admobid = { // for Android
        banner: 'ca-app-pub-4592293799234361/5965657734',
        interstitial: 'ca-app-pub-4592293799234361/4488924537'
    };
} else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) {
    admobid = { // for iOS
        banner: 'ca-app-pub-4592293799234361/1535458133',
        interstitial: 'ca-app-pub-4592293799234361/4628525334'
    };
} else {
    admobid = { // for Windows Phone
        banner: 'ca-app-pub-4592293799234361/2872590539',
        interstitial: 'ca-app-pub-4592293799234361/1395857334'
    };
}

if(( /(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent) )) {
    document.addEventListener('deviceready', initApp, false);
} else {
    initApp();
}

function initApp() {
    if (! AdMob ) { alert( 'admob plugin not ready' ); return; }

  var defaultOptions = {
    // adSize: 'SMART_BANNER',
    // width: integer, // valid when set adSize 'CUSTOM'
    // height: integer, // valid when set adSize 'CUSTOM'
    //position: AdMob.AD_POSITION.BOTTOM_CENTER,
    // offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
    //bgColor: 'black', // color name, or '#RRGGBB'
    // x: integer,		// valid when set position to 0 / POS_XY
    // y: integer,		// valid when set position to 0 / POS_XY
    isTesting: true, // set to true, to receiving test ad for testing purpose
    // autoShow: true // auto show interstitial ad when loaded, set to false if prepare/show
  };
  AdMob.setOptions( defaultOptions );

    AdMob.createBanner( {
        adId: admobid.banner,
        isTesting: true,
        overlap: false,
        offsetTopBar: false,
        position: AdMob.AD_POSITION.BOTTOM_CENTER,
        bgColor: 'black'
    } );

    AdMob.prepareInterstitial({
        adId: admobid.interstitial,
        autoShow: true
    });
}

