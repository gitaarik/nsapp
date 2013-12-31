'use strict';

require(['departures/main'], function(DepartureTimes) {

    var departureTimes = new DepartureTimes()

    // temp hack for development
    //departureTimes.showDepartures('ASD');

});
