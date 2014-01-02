require(['departures/main'], function(DepartureTimes) {
    'use strict';

    var departureTimes = new DepartureTimes();

    // temp hack for development
    //departureTimes.showDepartures('ASD');

});
