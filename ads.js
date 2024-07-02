function initializeIMA() {
    console.log("initializing IMA");
    adContainer = document.getElementById('ad-container');
    adContainer.addEventListener('click', adContainerClick);
    adDisplayContainer = new google.ima.AdDisplayContainer(adContainer, videoElement);
    adsLoader = new google.ima.AdsLoader(adDisplayContainer);
    adsLoader.addEventListener(
        google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED,
        onAdsManagerLoaded,
        false);
    adsLoader.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError,
        false);

    // Let the AdsLoader know when the video has ended
    videoElement.addEventListener('ended', function() {
        adsLoader.contentComplete();
        console.log("contentComplete")
    });

    var adsRequest = new google.ima.AdsRequest();
    adsRequest.adTagUrl = 'https://pubads.g.doubleclick.net/gampad/ads?' +
      'iu=/21775744923/external/single_ad_samples&sz=640x480&' +
      'cust_params=sample_ct%3Dlinear&ciu_szs=300x250%2C728x90&' +
      'gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=';

    // Specify the linear and nonlinear slot sizes. This helps the SDK to
    // select the correct creative if multiple are returned.
    adsRequest.linearAdSlotWidth = videoElement.clientWidth;
    adsRequest.linearAdSlotHeight = videoElement.clientHeight;
    adsRequest.nonLinearAdSlotWidth = videoElement.clientWidth;
    adsRequest.nonLinearAdSlotHeight = videoElement.clientHeight / 3;

    // Pass the request to the adsLoader to request ads
    adsLoader.requestAds(adsRequest);
}

function adContainerClick(event) {
    console.log("ad container clicked");
    if(videoElement.paused) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
  }

function loadAds(event) {
    console.log("loadAds")
    // Prevent this function from running on if there are already ads loaded
    // if(adsLoaded) {
    //     return;
    // }
    adsLoaded = true;

    // Prevent triggering immediate playback when ads are loading
    event.preventDefault();

    console.log("loading ads");
    // Initialize the container. Must be done via a user action on mobile devices.
    // videoElement.resize();
    // videoElement.load();
    adDisplayContainer.initialize();

    var width = videoElement.clientWidth;
    var height = videoElement.clientHeight;
    try {
        adsManager.init(width, height, google.ima.ViewMode.NORMAL);
        adsManager.start();
        console.log(adsManager)
    } catch (adError) {
        // Play the video without ads, if an error occurs
        console.log("AdsManager could not be started");
        console.log(adError)
        // videoElement.play();
    }
}

function onAdsManagerLoaded(adsManagerLoadedEvent) {
    // Instantiate the AdsManager from the adsLoader response and pass it the video element
    adsManager = adsManagerLoadedEvent.getAdsManager(
        videoElement);
    adsManager.addEventListener(
        google.ima.AdErrorEvent.Type.AD_ERROR,
        onAdError);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED,
        onContentPauseRequested);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED,
        onContentResumeRequested);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.LOADED,
        onAdLoaded);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.STARTED,
        onAdsStarted);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.COMPLETE,
        onAdsCompleted);
    adsManager.addEventListener(
        google.ima.AdEvent.Type.ALL_ADS_COMPLETED,
        onAdEvent);
}
  
function onAdError(adErrorEvent) {
    // Handle the error logging.
    console.log(adErrorEvent.getError());
    if(adsManager) {
        adsManager.destroy();
    }
}

function onContentPauseRequested() {
    videoElement.pause();
}
  
function onContentResumeRequested() {
    videoElement.play();
    if (countdownTimer) {
        clearInterval(countdownTimer);
    }
}

function onAdLoaded(adEvent) {
    var ad = adEvent.getAd();
    if (!ad.isLinear()) {
      videoElement.play();
    }
}

function onAdsStarted(adEvent) {
    // videoElement.focus();
    console.log("onAdsStarted")
    console.log(skipButton)
    // skipButton.classList.add("able");
    // skipButton.focus();
    console.log(document.activeElement)
    countdownTimer = setInterval(function() {
        timer.classList.add("able");
        skip.classList.add("able");
        controls.classList.add("disable");
        var timeRemaining = adsManager.getRemainingTime();
        // Update UI with timeRemaining
        timerCounter.textContent = Math.round(timeRemaining);
        console.log(timeRemaining)
    }, 1000);
}

function onAdsCompleted(adEvent) {
    console.log("onAdsCompleted")
    clearInterval(countdownTimer);
    
    timer.classList.remove("able");
    timer.classList.add("disable");
    skip.classList.remove("able");
    skip.classList.add("disable");
    gameContainer.classList.add("able");
    controls.classList.add("able");
    gameStart();
}

function onAdEvent(adEvent) {
    adsManager.destroy();
    initializeIMA();
}

skipButton.addEventListener('click', function(event) {
    console.log("skipButton")
    console.log(adsManager.getAdSkippableState())
    //getAdSkippableState = false, skip() function doesn`t work
    //thats why stop() func used
    adsManager.stop()
    onAdsCompleted()
});
