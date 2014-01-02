require(['departures/main'], function(DepartureTimes) {
    'use strict';

    var departureTimes = new DepartureTimes();
    departureTimes.activate();

    // temp hack for development
    //departureTimes.showDepartures('ASD');

});
