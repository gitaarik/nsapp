require(['departures/main'], function(Departure) {
    'use strict';

    // We lock the screen orientation of this app to 'portrait' because
    // we don't see any use of this app being in landscape, and it will
    // prevent annoyances when people accidentally tilt the screen or
    // when the orentation accelerometer of the phone is buggy.
    //
    // At the time of writing, this API call is experimental and only
    // Gecko has an implementation for it under `mozLockOrientation`, so
    // we put it inside a try.
    //
    // The orientation is also specified in the manifest.webapp but that
    // doesn't seem to work correctly on at least the Geeksphone Peek.
    // It acts as if it was 'portrait' instead of 'portrait-primary'.
    // For more info see:
    // https://developer.mozilla.org/en-US/Apps/Developing/Manifest
    //
    try {
        screen.mozLockOrientation('portrait-primary');
    } finally { }

    var departure = new Departure();
    departure.activate();

});
