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
    // try {
    //     screen.mozLockOrientation('portrait-primary');
    // } finally { }

    var departure = new Departure();
    departure.activate();

});
